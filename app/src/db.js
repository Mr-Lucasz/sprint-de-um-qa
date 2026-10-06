// Banco de dados em memória. Os dados voltam ao estado inicial
// quando o servidor reinicia ou quando alguém chama POST /api/test/reset.
const crypto = require('node:crypto');

function hashSenha(senha) {
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.scryptSync(senha, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

function conferirSenha(senha, armazenado) {
  const [salt, hash] = armazenado.split(':');
  const tentativa = crypto.scryptSync(senha, salt, 32).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(tentativa, 'hex'));
}

const db = {
  usuarios: [],
  cursos: [],
  inscricoes: [],
  tokens: new Map(),
  seq: { usuario: 0, curso: 0, inscricao: 0 },
};

function proximoId(tipo) {
  db.seq[tipo] += 1;
  return db.seq[tipo];
}

function criarUsuario({ nome, email, senha, perfil = 'aluno' }) {
  const usuario = {
    id: proximoId('usuario'),
    nome,
    email: email.toLowerCase(),
    senhaHash: hashSenha(senha),
    perfil,
    criadoEm: new Date().toISOString(),
  };
  db.usuarios.push(usuario);
  return usuario;
}

function criarCurso(dados) {
  const curso = { id: proximoId('curso'), ...dados };
  db.cursos.push(curso);
  return curso;
}

function criarInscricao(usuarioId, cursoId) {
  const inscricao = {
    id: proximoId('inscricao'),
    usuarioId,
    cursoId,
    criadaEm: new Date().toISOString(),
  };
  db.inscricoes.push(inscricao);
  return inscricao;
}

function semear() {
  db.usuarios = [];
  db.cursos = [];
  db.inscricoes = [];
  db.tokens = new Map();
  db.seq = { usuario: 0, curso: 0, inscricao: 0 };

  criarUsuario({ nome: 'Admin Inscrevi', email: 'admin@inscrevi.dev', senha: 'Admin@123', perfil: 'admin' });
  const maria = criarUsuario({ nome: 'Maria Souza', email: 'maria@inscrevi.dev', senha: 'Senha@123' });
  const joao = criarUsuario({ nome: 'João Pereira', email: 'joao@inscrevi.dev', senha: 'Senha@123' });

  const dia1 = criarCurso({
    titulo: 'A Sprint de um QA — Dia 1',
    descricao: 'Fundamentos, análise de requisitos, testes manuais e gestão de defeitos.',
    data: '2026-10-06', inicio: '19:00', fim: '22:00', vagas: 42, local: 'Laboratório 003',
  });
  criarCurso({
    titulo: 'Git para quem testa',
    descricao: 'Branches, commits e pull requests no dia a dia de QA.',
    data: '2026-10-06', inicio: '20:00', fim: '21:00', vagas: 30, local: 'Laboratório 005',
  });
  criarCurso({
    titulo: 'A Sprint de um QA — Dia 2',
    descricao: 'APIs com Postman, automação com Playwright e Cypress, IA e CI/CD.',
    data: '2026-10-07', inicio: '19:00', fim: '22:00', vagas: 42, local: 'Laboratório 003',
  });
  criarCurso({
    titulo: 'Oficina de acessibilidade web',
    descricao: 'Leitores de tela, contraste e navegação por teclado na prática.',
    data: '2026-10-07', inicio: '14:00', fim: '17:00', vagas: 2, local: 'Sala 112',
  });
  criarCurso({
    titulo: 'Testes de performance com K6',
    descricao: 'Primeiros scripts de carga e leitura de métricas.',
    data: '2026-10-08', inicio: '19:00', fim: '21:00', vagas: 25, local: 'Laboratório 003',
  });
  const palestra = criarCurso({
    titulo: 'Palestra: carreira em QA',
    descricao: 'Bate-papo sobre mercado, certificações e primeiros passos.',
    data: '2026-10-08', inicio: '10:00', fim: '11:00', vagas: 1, local: 'Auditório',
  });

  criarInscricao(joao.id, dia1.id);
  criarInscricao(maria.id, palestra.id);
}

semear();

module.exports = { db, semear, criarUsuario, criarCurso, criarInscricao, conferirSenha };
