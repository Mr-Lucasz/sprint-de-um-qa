// Rotas das histórias US07 a US16: lista de espera, sair, recuperar senha, perfil,
// presença e certificado. Estas rotas não têm comportamento alternado pelo modo do app.
const crypto = require('node:crypto');
const banco = require('./banco');
const { gerarPdf, cargaHoraria } = require('./certificado');

const LIMITE_LISTA_ESPERA = 10;
const VALIDADE_LINK_SENHA = '30 minutes';

module.exports = function registrar(router, { erro, lerId, cursoPublico, sqlCursos, horariosConflitam, autenticar, somenteAdmin }) {
  // "Envio" de e-mail: fica numa caixa de saída que administradores consultam em GET /emails.
  function enviarEmail(q, s, para, assunto, corpo) {
    return q(`INSERT INTO ${s}.emails (para, assunto, corpo) VALUES ($1, $2, $3)`, [para, assunto, corpo]);
  }

  // ---------- US08 · sair da conta ----------

  router.post('/logout', autenticar, async (req, res) => {
    const token = (req.get('authorization') || '').split(' ')[1];
    await banco.consultar(`DELETE FROM ${req.amb.s}.sessoes WHERE token_hash = $1`, [banco.hashToken(token)]);
    res.status(204).end();
  });

  // ---------- US10 · editar perfil (por enquanto, só o nome) ----------

  router.patch('/usuarios/me', autenticar, async (req, res) => {
    const dados = req.body || {};
    if (Object.keys(dados).some((campo) => campo !== 'nome')) {
      return erro(res, 400, 'Por enquanto só o nome pode ser alterado.');
    }
    if (typeof dados.nome !== 'string' || dados.nome.trim().length < 3 || dados.nome.trim().length > 80) {
      return erro(res, 400, 'O nome deve ter entre 3 e 80 caracteres.');
    }
    const [usuario] = await banco.consultar(
      `UPDATE ${req.amb.s}.usuarios SET nome = $1 WHERE id = $2 RETURNING id, nome, email, perfil, criado_em AS "criadoEm"`,
      [dados.nome.trim(), req.usuario.id],
    );
    res.json(usuario);
  });

  // ---------- US09 · recuperar senha ----------

  router.post('/recuperar-senha', async (req, res) => {
    const { s } = req.amb;
    const email = String((req.body || {}).email || '').trim().toLowerCase();
    const [usuario] = await banco.consultar(`SELECT id, nome FROM ${s}.usuarios WHERE email = $1`, [email]);
    if (usuario) {
      const token = crypto.randomBytes(24).toString('hex');
      await banco.transacao(async (q) => {
        await q(`DELETE FROM ${s}.tokens_senha WHERE usuario_id = $1`, [usuario.id]);
        await q(
          `INSERT INTO ${s}.tokens_senha (token_hash, usuario_id, expira_em) VALUES ($1, $2, now() + interval '${VALIDADE_LINK_SENHA}')`,
          [banco.hashToken(token), usuario.id],
        );
        await enviarEmail(q, s, email, 'Redefinição de senha',
          `Olá, ${usuario.nome.split(' ')[0]}. Para definir uma senha nova, abra #/redefinir-senha/${token} no Inscrevi. O link vale por 30 minutos e só pode ser usado uma vez.`);
      });
    }
    // A mesma resposta para qualquer e-mail: não revela quem tem conta.
    res.json({ mensagem: 'Se o e-mail estiver cadastrado, você receberá o link para redefinir a senha.' });
  });

  router.post('/redefinir-senha', async (req, res) => {
    const { s } = req.amb;
    const { token, senha } = req.body || {};
    if (typeof senha !== 'string' || senha.length < 8 || senha.length > 64) {
      return erro(res, 400, 'A senha deve ter entre 8 e 64 caracteres.');
    }
    const feito = await banco.transacao(async (q) => {
      const [registro] = await q(
        `DELETE FROM ${s}.tokens_senha WHERE token_hash = $1 AND expira_em > now() RETURNING usuario_id`,
        [banco.hashToken(String(token || ''))],
      );
      if (!registro) return false;
      await q(`UPDATE ${s}.usuarios SET senha_hash = $1 WHERE id = $2`, [await banco.hashSenha(senha), registro.usuario_id]);
      await q(`DELETE FROM ${s}.sessoes WHERE usuario_id = $1`, [registro.usuario_id]);
      return true;
    });
    if (!feito) return erro(res, 400, 'Link de redefinição inválido ou expirado.');
    res.status(204).end();
  });

  // Caixa de saída dos e-mails simulados
  router.get('/emails', autenticar, somenteAdmin, async (req, res) => {
    const emails = await banco.consultar(
      `SELECT id, para, assunto, corpo, enviado_em AS "enviadoEm" FROM ${req.amb.s}.emails ORDER BY id DESC LIMIT 50`,
    );
    res.json(emails);
  });

  // ---------- US07 · lista de espera ----------

  router.post('/cursos/:id/lista-espera', autenticar, async (req, res) => {
    const { s } = req.amb;
    const cursoId = lerId(req.params.id);
    if (!cursoId) return erro(res, 404, 'Curso não encontrado.');

    const resultado = await banco.transacao(async (q) => {
      const [travado] = await q(`SELECT id FROM ${s}.cursos WHERE id = $1 FOR UPDATE`, [cursoId]);
      if (!travado) return { status: 404, mensagem: 'Curso não encontrado.' };
      const [curso] = await q(sqlCursos(s, 'WHERE c.id = $1'), [cursoId]);

      const [inscrito] = await q(`SELECT 1 FROM ${s}.inscricoes WHERE usuario_id = $1 AND curso_id = $2`, [req.usuario.id, cursoId]);
      if (inscrito) return { status: 409, mensagem: 'Você já está inscrito neste curso.' };
      if (curso.inscritos < curso.vagas) return { status: 409, mensagem: 'Este curso ainda tem vagas disponíveis.' };

      const fila = await q(`SELECT usuario_id FROM ${s}.lista_espera WHERE curso_id = $1 ORDER BY id`, [cursoId]);
      if (fila.some((f) => f.usuario_id === req.usuario.id)) return { status: 409, mensagem: 'Você já está na lista de espera deste curso.' };
      if (fila.length >= LIMITE_LISTA_ESPERA) return { status: 409, mensagem: 'A lista de espera deste curso está cheia.' };

      const [entrada] = await q(
        `INSERT INTO ${s}.lista_espera (usuario_id, curso_id) VALUES ($1, $2)
         RETURNING id, usuario_id AS "usuarioId", curso_id AS "cursoId", criada_em AS "criadaEm"`,
        [req.usuario.id, cursoId],
      );
      return { entrada: { ...entrada, posicao: fila.length + 1 } };
    });

    if (resultado.mensagem) return erro(res, resultado.status, resultado.mensagem);
    res.status(201).json(resultado.entrada);
  });

  router.delete('/cursos/:id/lista-espera', autenticar, async (req, res) => {
    const cursoId = lerId(req.params.id);
    const removidas = cursoId ? await banco.consultar(
      `DELETE FROM ${req.amb.s}.lista_espera WHERE usuario_id = $1 AND curso_id = $2 RETURNING id`,
      [req.usuario.id, cursoId],
    ) : [];
    if (removidas.length === 0) return erro(res, 404, 'Você não está na lista de espera deste curso.');
    res.status(204).end();
  });

  // As listas de espera da pessoa logada, com a posição em cada uma
  router.get('/lista-espera', autenticar, async (req, res) => {
    const { s } = req.amb;
    const [entradas, cursos] = await Promise.all([
      banco.consultar(
        `SELECT l.id, l.curso_id AS "cursoId", l.criada_em AS "criadaEm",
                (SELECT count(*)::int FROM ${s}.lista_espera a WHERE a.curso_id = l.curso_id AND a.id <= l.id) AS posicao
           FROM ${s}.lista_espera l WHERE l.usuario_id = $1 ORDER BY l.id`,
        [req.usuario.id],
      ),
      banco.consultar(sqlCursos(s, `WHERE c.id IN (SELECT curso_id FROM ${s}.lista_espera WHERE usuario_id = $1)`), [req.usuario.id]),
    ]);
    const porId = new Map(cursos.map((c) => [c.id, cursoPublico(c)]));
    res.json(entradas.map((e) => ({ ...e, curso: porId.get(e.cursoId) })));
  });

  router.get('/cursos/:id/lista-espera', autenticar, somenteAdmin, async (req, res) => {
    const { s } = req.amb;
    const id = lerId(req.params.id);
    const [curso] = id ? await banco.consultar(`SELECT id FROM ${s}.cursos WHERE id = $1`, [id]) : [];
    if (!curso) return erro(res, 404, 'Curso não encontrado.');
    const fila = await banco.consultar(
      `SELECT l.id, l.usuario_id AS "usuarioId", u.nome, u.email, l.criada_em AS "criadaEm"
         FROM ${s}.lista_espera l JOIN ${s}.usuarios u ON u.id = l.usuario_id
        WHERE l.curso_id = $1 ORDER BY l.id`,
      [id],
    );
    res.json(fila.map((f, i) => ({ ...f, posicao: i + 1 })));
  });

  // Chamada dentro da transação do cancelamento: se abriu vaga, inscreve a primeira
  // pessoa da fila que não tenha conflito de horário. Quem tem conflito continua na fila.
  async function promoverDaListaDeEspera(q, s, cursoId) {
    const [curso] = await q(sqlCursos(s, 'WHERE c.id = $1'), [cursoId]);
    if (!curso || curso.inscritos >= curso.vagas) return;
    const fila = await q(
      `SELECT l.id, l.usuario_id, u.email, u.nome FROM ${s}.lista_espera l JOIN ${s}.usuarios u ON u.id = l.usuario_id
        WHERE l.curso_id = $1 ORDER BY l.id`,
      [cursoId],
    );
    for (const candidato of fila) {
      const outros = await q(
        `SELECT c.data, c.inicio, c.fim FROM ${s}.inscricoes i JOIN ${s}.cursos c ON c.id = i.curso_id WHERE i.usuario_id = $1`,
        [candidato.usuario_id],
      );
      if (outros.some((outro) => horariosConflitam(outro, curso))) continue;
      await q(`INSERT INTO ${s}.inscricoes (usuario_id, curso_id) VALUES ($1, $2)`, [candidato.usuario_id, cursoId]);
      await q(`DELETE FROM ${s}.lista_espera WHERE id = $1`, [candidato.id]);
      await enviarEmail(q, s, candidato.email, 'Sua vaga foi confirmada',
        `Olá, ${candidato.nome.split(' ')[0]}. Abriu uma vaga em "${curso.titulo}" e você, que estava na lista de espera, foi inscrito.`);
      return;
    }
  }

  // ---------- US15 · lista de presença ----------

  router.get('/cursos/:id/presencas', autenticar, somenteAdmin, async (req, res) => {
    const { s } = req.amb;
    const id = lerId(req.params.id);
    const [curso] = id ? await banco.consultar(`SELECT id FROM ${s}.cursos WHERE id = $1`, [id]) : [];
    if (!curso) return erro(res, 404, 'Curso não encontrado.');
    const lista = await banco.consultar(
      `SELECT i.usuario_id AS "usuarioId", u.nome, u.email, (p.id IS NOT NULL) AS presente
         FROM ${s}.inscricoes i JOIN ${s}.usuarios u ON u.id = i.usuario_id
         LEFT JOIN ${s}.presencas p ON p.usuario_id = i.usuario_id AND p.curso_id = i.curso_id
        WHERE i.curso_id = $1 ORDER BY u.nome, u.id`,
      [id],
    );
    res.json(lista);
  });

  router.post('/presencas', autenticar, somenteAdmin, async (req, res) => {
    const { s } = req.amb;
    const { usuarioId, cursoId, presente = true } = req.body || {};
    const aluno = lerId(usuarioId);
    const curso = lerId(cursoId);
    if (!aluno || !curso || typeof presente !== 'boolean') {
      return erro(res, 400, 'Informe usuarioId, cursoId e presente (true ou false).');
    }
    const [inscricao] = await banco.consultar(`SELECT 1 FROM ${s}.inscricoes WHERE usuario_id = $1 AND curso_id = $2`, [aluno, curso]);
    if (!inscricao) return erro(res, 409, 'A pessoa precisa estar inscrita no minicurso.');

    if (presente) {
      await banco.consultar(
        `INSERT INTO ${s}.presencas (usuario_id, curso_id, codigo) VALUES ($1, $2, $3) ON CONFLICT (usuario_id, curso_id) DO NOTHING`,
        [aluno, curso, crypto.randomBytes(5).toString('hex').toUpperCase()],
      );
    } else {
      await banco.consultar(`DELETE FROM ${s}.presencas WHERE usuario_id = $1 AND curso_id = $2`, [aluno, curso]);
    }
    res.json({ usuarioId: aluno, cursoId: curso, presente });
  });

  // ---------- US16 · certificado ----------

  router.get('/inscricoes/:id/certificado', autenticar, async (req, res) => {
    const { s } = req.amb;
    const id = lerId(req.params.id);
    const [registro] = id ? await banco.consultar(
      `SELECT i.usuario_id, u.nome, c.titulo, c.data, c.inicio, c.fim, p.codigo
         FROM ${s}.inscricoes i JOIN ${s}.usuarios u ON u.id = i.usuario_id JOIN ${s}.cursos c ON c.id = i.curso_id
         LEFT JOIN ${s}.presencas p ON p.usuario_id = i.usuario_id AND p.curso_id = i.curso_id
        WHERE i.id = $1`,
      [id],
    ) : [];
    if (!registro) return erro(res, 404, 'Inscrição não encontrada.');
    if (registro.usuario_id !== req.usuario.id && req.usuario.perfil !== 'admin') {
      return erro(res, 403, 'Você só pode baixar os seus próprios certificados.');
    }
    if (!registro.codigo) return erro(res, 409, 'O certificado fica disponível depois que a sua presença for registrada.');
    res.type('application/pdf')
      .set('Content-Disposition', `attachment; filename="certificado-${id}.pdf"`)
      .send(gerarPdf({ nome: registro.nome, curso: registro, codigo: registro.codigo }));
  });

  // Qualquer pessoa confere a autenticidade de um certificado pelo código
  router.get('/certificados/:codigo', async (req, res) => {
    const { s } = req.amb;
    const [registro] = await banco.consultar(
      `SELECT u.nome, c.titulo, c.data, c.inicio, c.fim
         FROM ${s}.presencas p JOIN ${s}.usuarios u ON u.id = p.usuario_id JOIN ${s}.cursos c ON c.id = p.curso_id
        WHERE p.codigo = $1`,
      [String(req.params.codigo).toUpperCase()],
    );
    if (!registro) return erro(res, 404, 'Certificado não encontrado.');
    res.json({ valido: true, nome: registro.nome, curso: registro.titulo, data: registro.data, cargaHoraria: cargaHoraria(registro) });
  });

  return { promoverDaListaDeEspera };
};
