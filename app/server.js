const path = require('node:path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const rotas = require('./src/rotas');
const painel = require('./src/painel');
const banco = require('./src/banco');
const config = require('./src/config');
const openapi = require('./openapi.json');

const AMBIENTE_LOCAL = 'local';
// Com DATABASE_URL, a raiz do site atende este ambiente, compartilhado por todo mundo.
const AMBIENTE_COMPARTILHADO = process.env.AMBIENTE_RAIZ || 'turma';

const app = express();

app.use(express.json());

// ---------- ambiente da requisição ----------

function montarAmbiente(req, slug, modo, base) {
  const itens = config.itensDoModo(modo);
  req.amb = {
    slug,
    base,
    modo,
    s: banco.esquemaDe(slug),
    ativo: (id) => itens.has(id),
    registrar: (item) => banco.registrarOcorrencia(slug, item).catch((e) => console.error(e)),
  };
}

// Sem DATABASE_URL: um ambiente só, na raiz, com o modo da linha de comando.
function ambienteLocal(req, res, next) {
  montarAmbiente(req, AMBIENTE_LOCAL, config.modo, '');
  next();
}

// Com DATABASE_URL: a raiz é o ambiente compartilhado, com o modo gravado no banco.
async function ambienteCompartilhado(req, res, next) {
  const ambiente = await banco.buscarAmbiente(AMBIENTE_COMPARTILHADO);
  if (!ambiente) return res.status(503).json({ mensagem: 'Ambiente ainda não preparado.' });
  montarAmbiente(req, ambiente.slug, ambiente.modo, '');
  next();
}

// /t/<ambiente>/...: ambientes extras, cada um com os seus dados e o seu modo.
async function ambienteDaUrl(req, res, next) {
  const ambiente = await banco.buscarAmbiente(req.params.ambiente);
  if (!ambiente) {
    return res.status(404).type('html').send(pagina('Ambiente não encontrado', 'Confira o endereço que você recebeu.'));
  }
  const base = `/t/${ambiente.slug}`;
  if (req.originalUrl.split('?')[0] === base) return res.redirect(`${base}/`);
  montarAmbiente(req, ambiente.slug, ambiente.modo, base);
  next();
}

// ---------- o site de um ambiente (front + API + documentação) ----------

const site = express.Router({ mergeParams: true });

// Configuração do front, gerada a partir do modo do ambiente.
site.get('/config.js', (req, res) => {
  const front = {
    atualizaVagasAoCancelar: !req.amb.ativo('F09'),
    mostraMensagemDaApi: !req.amb.ativo('F10'),
    avisaMinicursoInexistente: !req.amb.ativo('F17'),
    buscaIgnoraAcentos: !req.amb.ativo('F18'),
    mostraLocalNasInscricoes: !req.amb.ativo('F23'),
    mostraPosicaoNaFila: !req.amb.ativo('F24'),
    limpaCabecalhoAoSair: !req.amb.ativo('F25'),
    confirmacaoCitaMinicurso: !req.amb.ativo('F27'),
    mostraEmailNaPresenca: !req.amb.ativo('F28'),
    certificadoSoComPresenca: !req.amb.ativo('F29'),
    ambiente: req.amb.slug,
    versao: config.versaoDoModo(req.amb.modo),
    urlDefeitos: process.env.URL_DEFEITOS || '',
  };
  res.set('Cache-Control', 'no-store');
  res.type('application/javascript').send(`window.INSCREVI_CONFIG = ${JSON.stringify(front)};`);
});

site.use('/api', rotas);
// Rotas de API inexistentes
site.use('/api', (req, res) => res.status(404).json({ mensagem: 'Rota não encontrada.' }));

function documentacao(req) {
  if (!req.amb.base) return banco.hospedado ? { ...openapi, servers: [{ url: '/api' }] } : openapi;
  return { ...openapi, servers: [{ url: `${req.amb.base}/api` }] };
}

site.get('/openapi.json', (req, res) => res.json(documentacao(req)));
site.use('/docs', swaggerUi.serve, (req, res, next) =>
  swaggerUi.setup(documentacao(req), { customSiteTitle: 'Inscrevi API' })(req, res, next));
site.use(express.static(path.join(__dirname, 'public')));

// ---------- montagem ----------

app.use('/instrutor', painel);
app.use('/t/:ambiente', ambienteDaUrl, site);

app.use(banco.hospedado ? ambienteCompartilhado : ambienteLocal, site);

function pagina(titulo, texto) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>${titulo}</title></head>
<body style="font-family: system-ui, sans-serif; margin: 3rem auto; max-width: 32rem; padding: 0 1rem; color: #1d2b36">
<h1>${titulo}</h1><p>${texto}</p></body></html>`;
}

// JSON malformado e erros inesperados
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensagem: 'O corpo da requisição não é um JSON válido.' });
  }
  console.error(err);
  res.status(500).json({ mensagem: 'Erro interno no servidor.' });
});

async function iniciar() {
  if (!banco.hospedado) await banco.criarAmbiente(AMBIENTE_LOCAL, config.modo);
  app.listen(config.porta, '0.0.0.0', () => {
    console.log(`Inscrevi rodando em http://localhost:${config.porta}`);
    console.log(`Documentação da API: http://localhost:${config.porta}/docs`);
    console.log(banco.hospedado ? 'Banco: Postgres (DATABASE_URL)' : `Banco: em memória · Modo: ${config.modo}`);
  });
}

if (require.main === module) {
  iniciar().catch((e) => { console.error(e); process.exit(1); });
}

module.exports = app;
