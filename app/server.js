const path = require('node:path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const rotas = require('./src/rotas');
const config = require('./src/config');
const openapi = require('./openapi.json');

const app = express();

app.use(express.json());

// Configuração do front, gerada a partir do modo do servidor.
app.get('/config.js', (req, res) => {
  const front = {
    atualizaVagasAoCancelar: !config.ativo('F09'),
    mostraMensagemDaApi: !config.ativo('F10'),
  };
  res.type('application/javascript').send(`window.INSCREVI_CONFIG = ${JSON.stringify(front)};`);
});

app.use('/api', rotas);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: 'Inscrevi API' }));
app.get('/openapi.json', (req, res) => res.json(openapi));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas de API inexistentes
app.use('/api', (req, res) => res.status(404).json({ mensagem: 'Rota não encontrada.' }));

// JSON malformado e erros inesperados
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensagem: 'O corpo da requisição não é um JSON válido.' });
  }
  console.error(err);
  res.status(500).json({ mensagem: 'Erro interno no servidor.' });
});

app.listen(config.porta, '0.0.0.0', () => {
  console.log(`Inscrevi rodando em http://localhost:${config.porta}`);
  console.log(`Documentação da API: http://localhost:${config.porta}/docs`);
  console.log(`Modo: ${config.modo}`);
});
