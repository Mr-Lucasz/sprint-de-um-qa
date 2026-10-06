// Acesso ao banco de dados (PostgreSQL).
//
// - Com a variável DATABASE_URL: conecta num Postgres de verdade (Neon, por exemplo).
// - Sem ela: usa o PGlite, um Postgres embutido que roda em memória dentro do Node.
//   Os dados voltam ao estado inicial quando o servidor reinicia.
//
// Cada "ambiente" de teste é um schema do Postgres com as suas próprias tabelas,
// então os IDs começam em 1 em todo ambiente.
const crypto = require('node:crypto');
const { promisify } = require('node:util');

const scrypt = promisify(crypto.scrypt);
const URL_BANCO = process.env.DATABASE_URL;

// ---------- conexão ----------

let conexao;

function conectar() {
  if (conexao) return conexao;
  if (URL_BANCO) {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: URL_BANCO, max: 5 });
    conexao = Promise.resolve({
      consultar: (sql, params) => pool.query(sql, params),
      executar: (sql) => pool.query(sql),
      async transacao(fn) {
        const cliente = await pool.connect();
        try {
          await cliente.query('BEGIN');
          const resultado = await fn((sql, params) => cliente.query(sql, params));
          await cliente.query('COMMIT');
          return resultado;
        } catch (e) {
          await cliente.query('ROLLBACK').catch(() => {});
          throw e;
        } finally {
          cliente.release();
        }
      },
    });
  } else {
    const { PGlite } = require('@electric-sql/pglite');
    const pglite = new PGlite();
    conexao = pglite.waitReady.then(() => ({
      consultar: (sql, params) => pglite.query(sql, params),
      executar: (sql) => pglite.exec(sql),
      transacao: (fn) => pglite.transaction((tx) => fn((sql, params) => tx.query(sql, params))),
    }));
  }
  return conexao;
}

async function consultar(sql, params = []) {
  const bd = await conectar();
  const { rows } = await bd.consultar(sql, params);
  return rows;
}

async function executar(sql) {
  const bd = await conectar();
  await bd.executar(sql);
}

// fn recebe uma função q(sql, params) que devolve as linhas, tudo na mesma transação
async function transacao(fn) {
  const bd = await conectar();
  return bd.transacao((consulta) => fn(async (sql, params = []) => (await consulta(sql, params)).rows));
}

// ---------- senhas e tokens ----------

async function hashSenha(senha) {
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = (await scrypt(senha, salt, 32)).toString('hex');
  return `${salt}:${hash}`;
}

async function conferirSenha(senha, armazenado) {
  const [salt, hash] = armazenado.split(':');
  const tentativa = await scrypt(senha, salt, 32);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), tentativa);
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

// ---------- estrutura ----------

const SLUG_VALIDO = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function slugValido(slug) {
  return typeof slug === 'string' && slug.length <= 24 && SLUG_VALIDO.test(slug);
}

// O nome do schema entra direto no SQL, por isso só aceita slugs já validados.
function esquemaDe(slug) {
  if (!slugValido(slug)) throw new Error(`Nome de ambiente inválido: ${slug}`);
  return `amb_${slug.replace(/-/g, '_')}`;
}

let basePronta;

function garantirBase() {
  if (!basePronta) {
    basePronta = executar(`
      CREATE SCHEMA IF NOT EXISTS painel;
      CREATE TABLE IF NOT EXISTS painel.ambientes (
        slug      text PRIMARY KEY,
        modo      text NOT NULL DEFAULT 'sprint',
        criado_em timestamptz NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS painel.ocorrencias (
        ambiente text NOT NULL REFERENCES painel.ambientes(slug) ON DELETE CASCADE,
        item     text NOT NULL,
        vezes    integer NOT NULL DEFAULT 1,
        primeira timestamptz NOT NULL DEFAULT now(),
        ultima   timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (ambiente, item)
      );
      CREATE TABLE IF NOT EXISTS painel.itens (
        id        text PRIMARY KEY,
        historia  text NOT NULL DEFAULT '',
        descricao text NOT NULL DEFAULT '',
        camada    text NOT NULL DEFAULT ''
      );
    `).catch((e) => { basePronta = null; throw e; });
  }
  return basePronta;
}

function sqlTabelas(s) {
  return `
    CREATE SCHEMA IF NOT EXISTS ${s};
    CREATE TABLE IF NOT EXISTS ${s}.usuarios (
      id         serial PRIMARY KEY,
      nome       text NOT NULL,
      email      text NOT NULL,
      senha_hash text NOT NULL,
      perfil     text NOT NULL DEFAULT 'aluno',
      criado_em  timestamptz NOT NULL DEFAULT now()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email ON ${s}.usuarios (email);
    CREATE TABLE IF NOT EXISTS ${s}.cursos (
      id        serial PRIMARY KEY,
      titulo    text NOT NULL,
      descricao text NOT NULL DEFAULT '',
      data      text NOT NULL,
      inicio    text NOT NULL,
      fim       text NOT NULL,
      vagas     integer NOT NULL,
      local     text NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS ${s}.inscricoes (
      id         serial PRIMARY KEY,
      usuario_id integer NOT NULL REFERENCES ${s}.usuarios(id),
      curso_id   integer NOT NULL REFERENCES ${s}.cursos(id),
      criada_em  timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS inscricoes_curso ON ${s}.inscricoes (curso_id);
    CREATE INDEX IF NOT EXISTS inscricoes_usuario ON ${s}.inscricoes (usuario_id);
    CREATE TABLE IF NOT EXISTS ${s}.sessoes (
      token_hash text PRIMARY KEY,
      usuario_id integer NOT NULL REFERENCES ${s}.usuarios(id) ON DELETE CASCADE,
      criada_em  timestamptz NOT NULL DEFAULT now()
    );
  `;
}

// ---------- dados iniciais ----------

const USUARIOS_INICIAIS = [
  { nome: 'Admin Inscrevi', email: 'admin@inscrevi.dev', senha: 'Admin@123', perfil: 'admin' },
  { nome: 'Maria Souza', email: 'maria@inscrevi.dev', senha: 'Senha@123', perfil: 'aluno' },
  { nome: 'João Pereira', email: 'joao@inscrevi.dev', senha: 'Senha@123', perfil: 'aluno' },
];

const CURSOS_INICIAIS = [
  ['A Sprint de um QA — Dia 1', 'Fundamentos, análise de requisitos, testes manuais e gestão de defeitos.', '2026-10-06', '19:00', '22:00', 42, 'Laboratório 003'],
  ['Git para quem testa', 'Branches, commits e pull requests no dia a dia de QA.', '2026-10-06', '20:00', '21:00', 30, 'Laboratório 005'],
  ['A Sprint de um QA — Dia 2', 'APIs com Postman, automação com Playwright e Cypress, IA e CI/CD.', '2026-10-07', '19:00', '22:00', 42, 'Laboratório 003'],
  ['Oficina de acessibilidade web', 'Leitores de tela, contraste e navegação por teclado na prática.', '2026-10-07', '14:00', '17:00', 2, 'Sala 112'],
  ['Testes de performance com K6', 'Primeiros scripts de carga e leitura de métricas.', '2026-10-08', '19:00', '21:00', 25, 'Laboratório 003'],
  ['Palestra: carreira em QA', 'Bate-papo sobre mercado, certificações e primeiros passos.', '2026-10-08', '10:00', '11:00', 1, 'Auditório'],
];

// [usuário, curso] pelos IDs acima: João no Dia 1, Maria na palestra
const INSCRICOES_INICIAIS = [[3, 1], [2, 6]];

let hashesIniciais;

function hashesDosUsuariosIniciais() {
  if (!hashesIniciais) hashesIniciais = Promise.all(USUARIOS_INICIAIS.map((u) => hashSenha(u.senha)));
  return hashesIniciais;
}

function marcadores(linhas, colunas) {
  return Array.from({ length: linhas }, (_, l) =>
    `(${Array.from({ length: colunas }, (_, c) => `$${l * colunas + c + 1}`).join(', ')})`).join(', ');
}

// Apaga tudo do ambiente e recria os dados iniciais, numa transação só.
async function semear(slug) {
  const s = esquemaDe(slug);
  const hashes = await hashesDosUsuariosIniciais();
  await transacao(async (q) => {
    await q(`TRUNCATE ${s}.sessoes, ${s}.inscricoes, ${s}.cursos, ${s}.usuarios RESTART IDENTITY CASCADE`);
    await q(
      `INSERT INTO ${s}.usuarios (nome, email, senha_hash, perfil) VALUES ${marcadores(USUARIOS_INICIAIS.length, 4)}`,
      USUARIOS_INICIAIS.flatMap((u, i) => [u.nome, u.email, hashes[i], u.perfil]),
    );
    await q(
      `INSERT INTO ${s}.cursos (titulo, descricao, data, inicio, fim, vagas, local) VALUES ${marcadores(CURSOS_INICIAIS.length, 7)}`,
      CURSOS_INICIAIS.flat(),
    );
    await q(
      `INSERT INTO ${s}.inscricoes (usuario_id, curso_id) VALUES ${marcadores(INSCRICOES_INICIAIS.length, 2)}`,
      INSCRICOES_INICIAIS.flat(),
    );
  });
}

// ---------- ambientes ----------

async function buscarAmbiente(slug) {
  if (!slugValido(slug)) return null;
  await garantirBase();
  const [ambiente] = await consultar('SELECT slug, modo FROM painel.ambientes WHERE slug = $1', [slug]);
  return ambiente || null;
}

async function criarAmbiente(slug, modo = 'sprint') {
  const s = esquemaDe(slug);
  await garantirBase();
  const novos = await consultar(
    'INSERT INTO painel.ambientes (slug, modo) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING RETURNING slug',
    [slug, modo],
  );
  await executar(sqlTabelas(s));
  if (novos.length > 0) await semear(slug);
  return novos.length > 0;
}

async function excluirAmbiente(slug) {
  const s = esquemaDe(slug);
  await executar(`DROP SCHEMA IF EXISTS ${s} CASCADE`);
  await consultar('DELETE FROM painel.ambientes WHERE slug = $1', [slug]);
}

async function registrarOcorrencia(slug, item) {
  await consultar(
    `INSERT INTO painel.ocorrencias (ambiente, item) VALUES ($1, $2)
     ON CONFLICT (ambiente, item) DO UPDATE SET vezes = painel.ocorrencias.vezes + 1, ultima = now()`,
    [slug, item],
  );
}

module.exports = {
  hospedado: Boolean(URL_BANCO),
  consultar,
  transacao,
  hashSenha,
  conferirSenha,
  hashToken,
  slugValido,
  esquemaDe,
  garantirBase,
  semear,
  buscarAmbiente,
  criarAmbiente,
  excluirAmbiente,
  registrarOcorrencia,
};
