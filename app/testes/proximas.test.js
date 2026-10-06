// Testes das rotas das histórias US07 a US16.
// Sobem o app num processo próprio (modo estável, porta 3111) e usam a API de verdade.
//
//   npm run test:app
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');

const PORTA = 3111;
const BASE = `http://localhost:${PORTA}/api`;
let servidor;

async function api(metodo, caminho, { token, corpo } = {}) {
  const resposta = await fetch(`${BASE}${caminho}`, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  const tipo = resposta.headers.get('content-type') || '';
  const dados = tipo.includes('json') ? await resposta.json() : Buffer.from(await resposta.arrayBuffer());
  return { status: resposta.status, dados, tipo };
}

async function entrar(email, senha) {
  const { status, dados } = await api('POST', '/login', { corpo: { email, senha } });
  assert.equal(status, 200);
  return dados;
}

let sequencia = 0;
async function novaPessoa(nome = 'Pessoa de Teste') {
  sequencia += 1;
  const dados = { nome, email: `teste${Date.now()}${sequencia}@teste.dev`, senha: 'Senha@12345' };
  assert.equal((await api('POST', '/usuarios', { corpo: dados })).status, 201);
  return { ...dados, ...(await entrar(dados.email, dados.senha)) };
}

let admin;
async function novoCurso(extra = {}) {
  sequencia += 1;
  const dia = String((sequencia % 27) + 1).padStart(2, '0');
  const { status, dados } = await api('POST', '/cursos', {
    token: admin.token,
    corpo: { titulo: `Curso ${sequencia}`, data: `2031-03-${dia}`, inicio: '19:00', fim: '21:00', vagas: 1, ...extra },
  });
  assert.equal(status, 201);
  return dados;
}

const inscrever = (pessoa, curso) => api('POST', '/inscricoes', { token: pessoa.token, corpo: { cursoId: curso.id } });

before(async () => {
  servidor = spawn(process.execPath, [path.join(__dirname, '..', 'server.js'), '--modo=estavel', `--porta=${PORTA}`], {
    env: { ...process.env, DATABASE_URL: '' }, stdio: 'ignore',
  });
  for (let i = 0; i < 60; i += 1) {
    try { if ((await fetch(`${BASE}/cursos`)).ok) break; } catch { /* ainda subindo */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  admin = await entrar('admin@inscrevi.dev', 'Admin@123');
});

after(() => servidor.kill());

test('US08 · sair invalida o token', async () => {
  const pessoa = await novaPessoa();
  assert.equal((await api('GET', '/usuarios/me', { token: pessoa.token })).status, 200);
  assert.equal((await api('POST', '/logout', { token: pessoa.token })).status, 204);
  assert.equal((await api('GET', '/usuarios/me', { token: pessoa.token })).status, 401);
});

test('US10 · altera o nome e recusa nome fora dos limites ou outros campos', async () => {
  const pessoa = await novaPessoa();
  const ok = await api('PATCH', '/usuarios/me', { token: pessoa.token, corpo: { nome: '  Maria Lima  ' } });
  assert.equal(ok.status, 200);
  assert.equal(ok.dados.nome, 'Maria Lima');
  assert.equal((await api('PATCH', '/usuarios/me', { token: pessoa.token, corpo: { nome: 'ab' } })).status, 400);
  assert.equal((await api('PATCH', '/usuarios/me', { token: pessoa.token, corpo: { nome: 'a'.repeat(81) } })).status, 400);
  assert.equal((await api('PATCH', '/usuarios/me', { token: pessoa.token, corpo: { email: 'x@y.com' } })).status, 400);
  assert.equal((await api('PATCH', '/usuarios/me', { corpo: { nome: 'Sem Login' } })).status, 401);
});

test('US09 · recuperação de senha não revela e-mail, vale uma vez e segue a regra de senha', async () => {
  const pessoa = await novaPessoa();
  const existente = await api('POST', '/recuperar-senha', { corpo: { email: pessoa.email } });
  const inexistente = await api('POST', '/recuperar-senha', { corpo: { email: 'ninguem@teste.dev' } });
  assert.equal(existente.status, 200);
  assert.deepEqual(existente.dados, inexistente.dados);
  assert.equal(existente.dados.token, undefined);

  assert.equal((await api('GET', '/emails', { token: pessoa.token })).status, 403);
  const { dados: emails } = await api('GET', '/emails', { token: admin.token });
  const email = emails.find((e) => e.para === pessoa.email);
  const token = email.corpo.match(/redefinir-senha\/([0-9a-f]+)/)[1];

  assert.equal((await api('POST', '/redefinir-senha', { corpo: { token, senha: '1234567' } })).status, 400);
  assert.equal((await api('POST', '/redefinir-senha', { corpo: { token, senha: 'NovaSenha@1' } })).status, 204);
  assert.equal((await api('POST', '/redefinir-senha', { corpo: { token, senha: 'OutraSenha@1' } })).status, 400);
  assert.equal((await api('POST', '/login', { corpo: { email: pessoa.email, senha: pessoa.senha } })).status, 401);
  assert.equal((await api('POST', '/login', { corpo: { email: pessoa.email, senha: 'NovaSenha@1' } })).status, 200);
  assert.equal((await api('GET', '/usuarios/me', { token: pessoa.token })).status, 401, 'sessões antigas caem');
});

test('US11 e US12 · detalhes trazem ministrante e pré-requisitos; busca ignora maiúsculas e acentos', async () => {
  const curso = await novoCurso({ titulo: 'Introdução à Automação', ministrante: 'Ana Prado', preRequisitos: 'Nenhum.' });
  const { dados } = await api('GET', `/cursos/${curso.id}`);
  assert.equal(dados.ministrante, 'Ana Prado');
  assert.equal(dados.preRequisitos, 'Nenhum.');
  assert.equal(dados.vagasDisponiveis, 1);

  const achados = (await api('GET', '/cursos?busca=AUTOMACAO')).dados;
  assert.ok(achados.some((c) => c.id === curso.id));
  assert.deepEqual((await api('GET', '/cursos?busca=zzzznaoexiste')).dados, []);
  assert.ok((await api('GET', '/cursos?busca=')).dados.length >= 6);
});

test('US14 · não exclui minicurso com inscritos', async () => {
  const curso = await novoCurso();
  const pessoa = await novaPessoa();
  await inscrever(pessoa, curso);
  const recusa = await api('DELETE', `/cursos/${curso.id}`, { token: admin.token });
  assert.equal(recusa.status, 409);
  assert.equal(recusa.dados.mensagem, 'Não é possível excluir um curso com inscrições.');
  const vazio = await novoCurso();
  assert.equal((await api('DELETE', `/cursos/${vazio.id}`, { token: pessoa.token })).status, 403);
  assert.equal((await api('DELETE', `/cursos/${vazio.id}`, { token: admin.token })).status, 204);
});

test('US07 · lista de espera: regras de entrada e promoção ao cancelar', async () => {
  const curso = await novoCurso({ vagas: 1 });
  const [dona, primeira, segunda] = [await novaPessoa(), await novaPessoa(), await novaPessoa()];

  const comVaga = await api('POST', `/cursos/${curso.id}/lista-espera`, { token: primeira.token });
  assert.equal(comVaga.status, 409);
  assert.equal(comVaga.dados.mensagem, 'Este curso ainda tem vagas disponíveis.');

  const inscricao = (await inscrever(dona, curso)).dados;
  assert.equal((await api('POST', `/cursos/${curso.id}/lista-espera`, { token: dona.token })).status, 409, 'já inscrita');
  assert.equal((await api('POST', `/cursos/${curso.id}/lista-espera`, {})).status, 401);

  // a primeira da fila tem conflito de horário com o curso e será pulada
  const conflitante = await novoCurso({ data: curso.data, inicio: '20:00', fim: '22:00', vagas: 5 });
  await inscrever(primeira, conflitante);
  const e1 = await api('POST', `/cursos/${curso.id}/lista-espera`, { token: primeira.token });
  const e2 = await api('POST', `/cursos/${curso.id}/lista-espera`, { token: segunda.token });
  assert.deepEqual([e1.status, e1.dados.posicao, e2.status, e2.dados.posicao], [201, 1, 201, 2]);
  assert.equal((await api('POST', `/cursos/${curso.id}/lista-espera`, { token: segunda.token })).status, 409, 'repetida');
  assert.equal((await api('GET', `/cursos/${curso.id}/lista-espera`, { token: admin.token })).dados.length, 2);

  assert.equal((await api('DELETE', `/inscricoes/${inscricao.id}`, { token: dona.token })).status, 204);
  const daSegunda = (await api('GET', `/usuarios/${segunda.usuario.id}/inscricoes`, { token: segunda.token })).dados;
  assert.ok(daSegunda.some((i) => i.cursoId === curso.id), 'a segunda foi promovida');
  const filaDaPrimeira = (await api('GET', '/lista-espera', { token: primeira.token })).dados;
  assert.deepEqual(filaDaPrimeira.map((f) => [f.cursoId, f.posicao]), [[curso.id, 1]]);
  assert.equal((await api('GET', `/cursos/${curso.id}`)).dados.vagasDisponiveis, 0);

  assert.equal((await api('DELETE', `/cursos/${curso.id}/lista-espera`, { token: primeira.token })).status, 204);
  assert.equal((await api('DELETE', `/cursos/${curso.id}/lista-espera`, { token: primeira.token })).status, 404);
});

test('US07 · a lista de espera tem limite de 10 pessoas', async () => {
  const curso = await novoCurso({ vagas: 1 });
  await inscrever(await novaPessoa(), curso);
  for (let i = 0; i < 10; i += 1) {
    assert.equal((await api('POST', `/cursos/${curso.id}/lista-espera`, { token: (await novaPessoa()).token })).status, 201);
  }
  const cheia = await api('POST', `/cursos/${curso.id}/lista-espera`, { token: (await novaPessoa()).token });
  assert.equal(cheia.status, 409);
  assert.equal(cheia.dados.mensagem, 'A lista de espera deste curso está cheia.');
});

test('US15 e US16 · presença só de inscritos; certificado só com presença e só para a própria pessoa', async () => {
  const curso = await novoCurso({ titulo: 'Testes — módulo avançado', vagas: 5, inicio: '19:00', fim: '22:00' });
  const [presente, ausente, deFora] = [await novaPessoa('José Antônio Conceição'), await novaPessoa(), await novaPessoa()];
  const inscricao = (await inscrever(presente, curso)).dados;
  const inscricaoAusente = (await inscrever(ausente, curso)).dados;

  const marcar = (pessoa, valor, token = admin.token) =>
    api('POST', '/presencas', { token, corpo: { usuarioId: pessoa.usuario.id, cursoId: curso.id, presente: valor } });
  assert.equal((await marcar(presente, true, presente.token)).status, 403);
  assert.equal((await marcar(deFora, true)).status, 409);
  assert.equal((await marcar(presente, true)).status, 200);
  assert.equal((await marcar(presente, true)).status, 200, 'marcar duas vezes não falha');

  const lista = (await api('GET', `/cursos/${curso.id}/presencas`, { token: admin.token })).dados;
  assert.deepEqual(lista.map((l) => [l.usuarioId, l.presente]).sort(), [[presente.usuario.id, true], [ausente.usuario.id, false]].sort());

  assert.equal((await api('GET', `/inscricoes/${inscricaoAusente.id}/certificado`, { token: ausente.token })).status, 409);
  assert.equal((await api('GET', `/inscricoes/${inscricao.id}/certificado`, { token: ausente.token })).status, 403);
  assert.equal((await api('GET', '/inscricoes/99999999/certificado', { token: presente.token })).status, 404);

  const pdf = await api('GET', `/inscricoes/${inscricao.id}/certificado`, { token: presente.token });
  assert.equal(pdf.status, 200);
  assert.match(pdf.tipo, /application\/pdf/);
  const texto = pdf.dados.toString('latin1');
  assert.ok(texto.startsWith('%PDF-1.4\n') && texto.trimEnd().endsWith('%%EOF'));
  const xref = Number(texto.match(/startxref\n(\d+)/)[1]);
  assert.equal(texto.slice(xref, xref + 4), 'xref', 'a tabela xref está onde o arquivo diz');
  assert.match(texto, /3 horas/);

  const codigo = texto.match(/verifica\\347\\343o: ([0-9A-F]{10})/)[1];
  const conferencia = await api('GET', `/certificados/${codigo}`);
  assert.deepEqual(conferencia.dados, { valido: true, nome: 'José Antônio Conceição', curso: 'Testes — módulo avançado', data: curso.data, cargaHoraria: '3 horas' });
  assert.equal((await api('GET', '/certificados/0000000000')).status, 404);

  const minhas = (await api('GET', `/usuarios/${presente.usuario.id}/inscricoes`, { token: presente.token })).dados;
  assert.equal(minhas[0].presencaRegistrada, true);
  assert.equal((await marcar(presente, false)).status, 200);
  assert.equal((await api('GET', `/inscricoes/${inscricao.id}/certificado`, { token: presente.token })).status, 409);
});
