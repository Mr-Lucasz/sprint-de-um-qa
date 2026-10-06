const crypto = require('node:crypto');
const express = require('express');
const { db, semear, criarUsuario, criarCurso, criarInscricao, conferirSenha } = require('./db');
const { ativo } = require('./config');

const router = express.Router();

// ---------- utilitários ----------

function erro(res, status, mensagem) {
  return res.status(status).json({ mensagem });
}

function usuarioPublico(u) {
  const { senhaHash, ...resto } = u;
  return resto;
}

function inscritosNoCurso(cursoId) {
  return db.inscricoes.filter((i) => i.cursoId === cursoId).length;
}

function cursoPublico(c) {
  const inscritos = inscritosNoCurso(c.id);
  return { ...c, inscritos, vagasDisponiveis: Math.max(c.vagas - inscritos, 0) };
}

function minutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function horariosConflitam(a, b) {
  if (a.data !== b.data) return false;
  return minutos(a.inicio) < minutos(b.fim) && minutos(b.inicio) < minutos(a.fim);
}

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMAIL_FROUXO = /^[^\s@]+@[^\s]*$/;

function validarCadastro({ nome, email, senha }) {
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

function autenticar(req, res, next) {
  const cabecalho = req.get('authorization') || '';
  const [tipo, token] = cabecalho.split(' ');
  const usuarioId = tipo === 'Bearer' ? db.tokens.get(token) : undefined;
  const usuario = db.usuarios.find((u) => u.id === usuarioId);
  if (!usuario) return erro(res, 401, 'Faça login para continuar.');
  req.usuario = usuario;
  next();
}

function somenteAdmin(req, res, next) {
  if (req.usuario.perfil !== 'admin') return erro(res, 403, 'Apenas administradores podem fazer isso.');
  next();
}

// ---------- usuários e login ----------

router.post('/usuarios', (req, res) => {
  const dados = req.body || {};
  const problema = validarCadastro(dados);
  if (problema) return erro(res, 400, problema);

  const email = dados.email.trim().toLowerCase();
  if (db.usuarios.some((u) => u.email === email)) {
    return erro(res, 409, 'Este e-mail já está cadastrado.');
  }
  const usuario = criarUsuario({ nome: dados.nome.trim(), email, senha: dados.senha });
  return res.status(201).json(usuarioPublico(usuario));
});

router.post('/login', (req, res) => {
  const { email, senha } = req.body || {};
  const usuario = db.usuarios.find((u) => u.email === String(email || '').trim().toLowerCase());
  if (!usuario || typeof senha !== 'string' || !conferirSenha(senha, usuario.senhaHash)) {
    return erro(res, 401, 'E-mail ou senha incorretos.');
  }
  const token = crypto.randomBytes(24).toString('hex');
  db.tokens.set(token, usuario.id);
  return res.status(200).json({ token, usuario: usuarioPublico(usuario) });
});

router.get('/usuarios/me', autenticar, (req, res) => {
  res.json(usuarioPublico(req.usuario));
});

router.get('/usuarios/:id/inscricoes', autenticar, (req, res) => {
  const id = Number(req.params.id);
  const ehDono = req.usuario.id === id;
  if (!ehDono && req.usuario.perfil !== 'admin' && !ativo('F08')) {
    return erro(res, 403, 'Você só pode ver as suas próprias inscrições.');
  }
  if (!db.usuarios.some((u) => u.id === id)) return erro(res, 404, 'Usuário não encontrado.');

  const lista = db.inscricoes
    .filter((i) => i.usuarioId === id)
    .map((i) => ({ ...i, curso: cursoPublico(db.cursos.find((c) => c.id === i.cursoId)) }));
  res.json(lista);
});

// ---------- cursos ----------

router.get('/cursos', (req, res) => {
  const ordenados = [...db.cursos].sort((a, b) =>
    `${a.data} ${a.inicio}`.localeCompare(`${b.data} ${b.inicio}`),
  );
  res.json(ordenados.map(cursoPublico));
});

router.get('/cursos/:id', (req, res) => {
  const curso = db.cursos.find((c) => c.id === Number(req.params.id));
  if (!curso) return erro(res, 404, 'Curso não encontrado.');
  res.json(cursoPublico(curso));
});

router.post('/cursos', autenticar, somenteAdmin, (req, res) => {
  const { titulo, descricao = '', data, inicio, fim, vagas, local = '' } = req.body || {};
  if (typeof titulo !== 'string' || titulo.trim().length < 3) return erro(res, 400, 'Informe um título com pelo menos 3 caracteres.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data || '')) return erro(res, 400, 'A data deve estar no formato AAAA-MM-DD.');
  if (!/^\d{2}:\d{2}$/.test(inicio || '') || !/^\d{2}:\d{2}$/.test(fim || '')) return erro(res, 400, 'Os horários devem estar no formato HH:MM.');
  if (minutos(inicio) >= minutos(fim)) return erro(res, 400, 'O horário de início deve ser anterior ao de término.');
  if (!Number.isInteger(vagas) || vagas < 1 || vagas > 500) return erro(res, 400, 'O número de vagas deve ser um inteiro entre 1 e 500.');

  const curso = criarCurso({ titulo: titulo.trim(), descricao, data, inicio, fim, vagas, local });
  res.status(201).json(cursoPublico(curso));
});

router.delete('/cursos/:id', autenticar, somenteAdmin, (req, res) => {
  const id = Number(req.params.id);
  const curso = db.cursos.find((c) => c.id === id);
  if (!curso) return erro(res, 404, 'Curso não encontrado.');
  if (inscritosNoCurso(id) > 0) return erro(res, 409, 'Não é possível excluir um curso com inscrições.');
  db.cursos = db.cursos.filter((c) => c.id !== id);
  res.status(204).end();
});

// ---------- inscrições ----------

router.post('/inscricoes', autenticar, (req, res) => {
  const cursoId = Number((req.body || {}).cursoId);
  const curso = db.cursos.find((c) => c.id === cursoId);
  if (!curso) return erro(res, 404, 'Curso não encontrado.');

  const minhas = db.inscricoes.filter((i) => i.usuarioId === req.usuario.id);

  if (!ativo('F04') && minhas.some((i) => i.cursoId === cursoId)) {
    return erro(res, 409, 'Você já está inscrito neste curso.');
  }

  const inscritos = inscritosNoCurso(cursoId);
  const lotado = ativo('F01') ? inscritos > curso.vagas : inscritos >= curso.vagas;
  if (lotado) return erro(res, 409, 'Curso sem vagas disponíveis.');

  if (!ativo('F05')) {
    const conflito = minhas
      .map((i) => db.cursos.find((c) => c.id === i.cursoId))
      .find((outro) => outro && outro.id !== cursoId && horariosConflitam(outro, curso));
    if (conflito) return erro(res, 409, `Conflito de horário com o curso "${conflito.titulo}".`);
  }

  const inscricao = criarInscricao(req.usuario.id, cursoId);
  const status = ativo('F06') ? 200 : 201;
  res.status(status).json({ ...inscricao, curso: cursoPublico(curso) });
});

router.delete('/inscricoes/:id', autenticar, (req, res) => {
  const id = Number(req.params.id);
  const inscricao = db.inscricoes.find((i) => i.id === id);
  if (!inscricao) {
    if (ativo('F07')) return res.status(204).end();
    return erro(res, 404, 'Inscrição não encontrada.');
  }
  if (inscricao.usuarioId !== req.usuario.id && req.usuario.perfil !== 'admin') {
    return erro(res, 403, 'Você só pode cancelar as suas próprias inscrições.');
  }
  db.inscricoes = db.inscricoes.filter((i) => i.id !== id);
  res.status(204).end();
});

// ---------- apoio a testes ----------

router.post('/test/reset', (req, res) => {
  semear();
  res.status(204).end();
});

module.exports = router;
