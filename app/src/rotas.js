const crypto = require('node:crypto');
const express = require('express');
const banco = require('./banco');

const router = express.Router({ mergeParams: true });

// Cada requisição chega com req.amb = { slug, s, ativo(id) }, onde "s" é o
// schema do Postgres do ambiente (ver server.js).

// ---------- utilitários ----------

function erro(res, status, mensagem) {
  return res.status(status).json({ mensagem });
}

// IDs vindos da URL ou do corpo: só inteiros que cabem na coluna serial
function lerId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}

function cursoPublico(c) {
  return { ...c, vagasDisponiveis: Math.max(c.vagas - c.inscritos, 0) };
}

function minutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function horariosConflitam(a, b) {
  if (a.data !== b.data) return false;
  return minutos(a.inicio) < minutos(b.fim) && minutos(b.inicio) < minutos(a.fim);
}

const COLUNAS_USUARIO = 'id, nome, email, perfil, criado_em AS "criadoEm"';
const COLUNAS_INSCRICAO = 'id, usuario_id AS "usuarioId", curso_id AS "cursoId", criada_em AS "criadaEm"';

function sqlCursos(s, filtro = '') {
  return `
    SELECT c.id, c.titulo, c.descricao, c.data, c.inicio, c.fim, c.vagas, c.local,
           (SELECT count(*)::int FROM ${s}.inscricoes i WHERE i.curso_id = c.id) AS inscritos
      FROM ${s}.cursos c ${filtro}`;
}

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMAIL_FROUXO = /^[^\s@]+@[^\s]*$/;

function validarCadastro({ nome, email, senha }, ativo) {
  if (typeof nome !== 'string' || nome.trim().length < 3 || nome.trim().length > 80) {
    return 'O nome deve ter entre 3 e 80 caracteres.';
  }
  const regexEmail = ativo('F03') ? EMAIL_FROUXO : EMAIL_VALIDO;
  if (typeof email !== 'string' || !regexEmail.test(email.trim())) {
    return 'Informe um e-mail válido, no formato nome@dominio.com.';
  }
  const minimo = ativo('F02') ? 7 : 8;
  if (typeof senha !== 'string' || senha.length < minimo || senha.length > 64) {
    return 'A senha deve ter entre 8 e 64 caracteres.';
  }
  return null;
}

// ---------- autenticação ----------

async function autenticar(req, res, next) {
  const cabecalho = req.get('authorization') || '';
  const [tipo, token] = cabecalho.split(' ');
  if (tipo !== 'Bearer' || !token) return erro(res, 401, 'Faça login para continuar.');
  const { s } = req.amb;
  const [usuario] = await banco.consultar(
    `SELECT u.id, u.nome, u.email, u.perfil, u.criado_em AS "criadoEm"
       FROM ${s}.sessoes t JOIN ${s}.usuarios u ON u.id = t.usuario_id
      WHERE t.token_hash = $1`,
    [banco.hashToken(token)],
  );
  if (!usuario) return erro(res, 401, 'Faça login para continuar.');
  req.usuario = usuario;
  next();
}

function somenteAdmin(req, res, next) {
  if (req.usuario.perfil !== 'admin') return erro(res, 403, 'Apenas administradores podem fazer isso.');
  next();
}

// ---------- usuários e login ----------

router.post('/usuarios', async (req, res) => {
  const { s, ativo, registrar } = req.amb;
  const dados = req.body || {};
  const problema = validarCadastro(dados, ativo);
  if (problema) return erro(res, 400, problema);

  const email = dados.email.trim().toLowerCase();
  let usuario;
  try {
    [usuario] = await banco.consultar(
      `INSERT INTO ${s}.usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING ${COLUNAS_USUARIO}`,
      [dados.nome.trim(), email, await banco.hashSenha(dados.senha)],
    );
  } catch (e) {
    if (e.code === '23505') return erro(res, 409, 'Este e-mail já está cadastrado.');
    throw e;
  }
  if (dados.senha.length < 8) await registrar('F02');
  if (!EMAIL_VALIDO.test(dados.email.trim())) await registrar('F03');
  return res.status(201).json(usuario);
});

router.post('/login', async (req, res) => {
  const { s } = req.amb;
  const { email, senha } = req.body || {};
  const [usuario] = await banco.consultar(
    `SELECT ${COLUNAS_USUARIO}, senha_hash FROM ${s}.usuarios WHERE email = $1`,
    [String(email || '').trim().toLowerCase()],
  );
  if (!usuario || typeof senha !== 'string' || !(await banco.conferirSenha(senha, usuario.senha_hash))) {
    return erro(res, 401, 'E-mail ou senha incorretos.');
  }
  const token = crypto.randomBytes(24).toString('hex');
  await banco.consultar(`INSERT INTO ${s}.sessoes (token_hash, usuario_id) VALUES ($1, $2)`, [banco.hashToken(token), usuario.id]);
  delete usuario.senha_hash;
  return res.status(200).json({ token, usuario });
});

router.get('/usuarios/me', autenticar, (req, res) => {
  res.json(req.usuario);
});

router.get('/usuarios/:id/inscricoes', autenticar, async (req, res) => {
  const { s, ativo, registrar } = req.amb;
  const id = lerId(req.params.id);
  const alheio = req.usuario.id !== id && req.usuario.perfil !== 'admin';
  if (alheio && !ativo('F08')) {
    return erro(res, 403, 'Você só pode ver as suas próprias inscrições.');
  }
  const [existe] = id ? await banco.consultar(`SELECT 1 FROM ${s}.usuarios WHERE id = $1`, [id]) : [];
  if (!existe) return erro(res, 404, 'Usuário não encontrado.');

  const [inscricoes, cursos] = await Promise.all([
    banco.consultar(`SELECT ${COLUNAS_INSCRICAO} FROM ${s}.inscricoes WHERE usuario_id = $1 ORDER BY id`, [id]),
    banco.consultar(sqlCursos(s, `WHERE c.id IN (SELECT curso_id FROM ${s}.inscricoes WHERE usuario_id = $1)`), [id]),
  ]);
  if (alheio) await registrar('F08');
  const porId = new Map(cursos.map((c) => [c.id, cursoPublico(c)]));
  res.json(inscricoes.map((i) => ({ ...i, curso: porId.get(i.cursoId) })));
});

// ---------- cursos ----------

router.get('/cursos', async (req, res) => {
  const cursos = await banco.consultar(sqlCursos(req.amb.s, 'ORDER BY c.data, c.inicio, c.id'));
  res.json(cursos.map(cursoPublico));
});

router.get('/cursos/:id', async (req, res) => {
  const id = lerId(req.params.id);
  const [curso] = id ? await banco.consultar(sqlCursos(req.amb.s, 'WHERE c.id = $1'), [id]) : [];
  if (!curso) return erro(res, 404, 'Curso não encontrado.');
  res.json(cursoPublico(curso));
});

router.post('/cursos', autenticar, somenteAdmin, async (req, res) => {
  const { titulo, descricao = '', data, inicio, fim, vagas, local = '' } = req.body || {};
  if (typeof titulo !== 'string' || titulo.trim().length < 3) return erro(res, 400, 'Informe um título com pelo menos 3 caracteres.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data || '')) return erro(res, 400, 'A data deve estar no formato AAAA-MM-DD.');
  if (!/^\d{2}:\d{2}$/.test(inicio || '') || !/^\d{2}:\d{2}$/.test(fim || '')) return erro(res, 400, 'Os horários devem estar no formato HH:MM.');
  if (minutos(inicio) >= minutos(fim)) return erro(res, 400, 'O horário de início deve ser anterior ao de término.');
  if (!Number.isInteger(vagas) || vagas < 1 || vagas > 500) return erro(res, 400, 'O número de vagas deve ser um inteiro entre 1 e 500.');

  const [curso] = await banco.consultar(
    `INSERT INTO ${req.amb.s}.cursos (titulo, descricao, data, inicio, fim, vagas, local)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, titulo, descricao, data, inicio, fim, vagas, local, 0 AS inscritos`,
    [titulo.trim(), String(descricao), data, inicio, fim, vagas, String(local)],
  );
  res.status(201).json(cursoPublico(curso));
});

router.delete('/cursos/:id', autenticar, somenteAdmin, async (req, res) => {
  const { s } = req.amb;
  const id = lerId(req.params.id);
  const [curso] = id ? await banco.consultar(sqlCursos(s, 'WHERE c.id = $1'), [id]) : [];
  if (!curso) return erro(res, 404, 'Curso não encontrado.');
  if (curso.inscritos > 0) return erro(res, 409, 'Não é possível excluir um curso com inscrições.');
  await banco.consultar(`DELETE FROM ${s}.cursos WHERE id = $1`, [id]);
  res.status(204).end();
});

// ---------- inscrições ----------

router.post('/inscricoes', autenticar, async (req, res) => {
  const { s, ativo, registrar } = req.amb;
  const cursoId = lerId((req.body || {}).cursoId);
  if (!cursoId) return erro(res, 404, 'Curso não encontrado.');

  // Tudo numa transação, com a linha do curso travada: duas inscrições
  // simultâneas na última vaga são avaliadas uma depois da outra.
  const resultado = await banco.transacao(async (q) => {
    const [travado] = await q(`SELECT id FROM ${s}.cursos WHERE id = $1 FOR UPDATE`, [cursoId]);
    if (!travado) return { status: 404, mensagem: 'Curso não encontrado.' };
    const [curso] = await q(sqlCursos(s, 'WHERE c.id = $1'), [cursoId]);

    const meusCursos = await q(
      `SELECT c.id, c.titulo, c.data, c.inicio, c.fim
         FROM ${s}.inscricoes i JOIN ${s}.cursos c ON c.id = i.curso_id
        WHERE i.usuario_id = $1 ORDER BY i.id`,
      [req.usuario.id],
    );
    const ocorridos = [];

    if (meusCursos.some((c) => c.id === cursoId)) {
      if (!ativo('F04')) return { status: 409, mensagem: 'Você já está inscrito neste curso.' };
      ocorridos.push('F04');
    }

    const lotado = ativo('F01') ? curso.inscritos > curso.vagas : curso.inscritos >= curso.vagas;
    if (lotado) return { status: 409, mensagem: 'Curso sem vagas disponíveis.' };
    if (curso.inscritos >= curso.vagas) ocorridos.push('F01');

    const conflito = meusCursos.find((outro) => outro.id !== cursoId && horariosConflitam(outro, curso));
    if (conflito) {
      if (!ativo('F05')) return { status: 409, mensagem: `Conflito de horário com o curso "${conflito.titulo}".` };
      ocorridos.push('F05');
    }

    const [inscricao] = await q(
      `INSERT INTO ${s}.inscricoes (usuario_id, curso_id) VALUES ($1, $2) RETURNING ${COLUNAS_INSCRICAO}`,
      [req.usuario.id, cursoId],
    );
    curso.inscritos += 1;
    return { inscricao, curso, ocorridos };
  });

  if (resultado.mensagem) return erro(res, resultado.status, resultado.mensagem);

  let status = 201;
  if (ativo('F06')) { status = 200; resultado.ocorridos.push('F06'); }
  for (const item of resultado.ocorridos) await registrar(item);
  res.status(status).json({ ...resultado.inscricao, curso: cursoPublico(resultado.curso) });
});

router.delete('/inscricoes/:id', autenticar, async (req, res) => {
  const { s, ativo, registrar } = req.amb;
  const id = lerId(req.params.id);
  const [inscricao] = id ? await banco.consultar(`SELECT id, usuario_id FROM ${s}.inscricoes WHERE id = $1`, [id]) : [];
  if (!inscricao) {
    if (ativo('F07')) { await registrar('F07'); return res.status(204).end(); }
    return erro(res, 404, 'Inscrição não encontrada.');
  }
  if (inscricao.usuario_id !== req.usuario.id && req.usuario.perfil !== 'admin') {
    return erro(res, 403, 'Você só pode cancelar as suas próprias inscrições.');
  }
  await banco.consultar(`DELETE FROM ${s}.inscricoes WHERE id = $1`, [id]);
  res.status(204).end();
});

// ---------- apoio a testes ----------

router.post('/test/reset', async (req, res) => {
  // Num banco compartilhado, quem reinicia os dados é o painel do instrutor.
  if (banco.hospedado) return erro(res, 403, 'Disponível apenas no ambiente local.');
  await banco.semear(req.amb.slug);
  res.status(204).end();
});

module.exports = router;
