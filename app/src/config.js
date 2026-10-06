// Configuração do app "Inscrevi".
//
// Modos (via argumento de linha de comando, funciona em Windows, Linux e macOS):
//   node app/server.js                 -> modo "sprint" (comportamento padrão do curso)
//   node app/server.js --modo=estavel  -> modo "estavel" (versão de referência)
//   node app/server.js --modo=F01,F04  -> liga apenas os itens listados
//   node app/server.js --porta=4000    -> muda a porta (padrão 3000)
//
// Também aceita variáveis de ambiente: MODO e PORT.
//
// Banco de dados: sem DATABASE_URL o app usa um Postgres embutido em memória e
// atende em http://localhost:3000. Com DATABASE_URL ele conecta no Postgres
// informado e cada ambiente de teste fica em /t/<ambiente>/, com o seu próprio modo.

const { version } = require('../../package.json');

function lerArg(nome) {
  const prefixo = `--${nome}=`;
  const arg = process.argv.find((a) => a.startsWith(prefixo));
  return arg ? arg.slice(prefixo.length) : undefined;
}

const modo = (lerArg('modo') || process.env.MODO || 'sprint').trim();
const porta = Number(lerArg('porta') || process.env.PORT || 3000);

const TODOS = [
  'F01', 'F02', 'F03', 'F04', 'F05', 'F06', 'F07', 'F08', 'F09', 'F10', 'F11',
  'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22',
];

function itensDoModo(texto) {
  const valor = String(texto || '').trim();
  if (valor === 'sprint') return new Set(TODOS);
  if (valor === 'estavel' || valor === '') return new Set();
  return new Set(valor.split(',').map((s) => s.trim().toUpperCase()).filter((s) => TODOS.includes(s)));
}

// Forma canônica de um conjunto de itens: "sprint", "estavel" ou "F01,F04"
function modoDosItens(itens) {
  const lista = TODOS.filter((id) => itens.has(id));
  if (lista.length === TODOS.length) return 'sprint';
  if (lista.length === 0) return 'estavel';
  return lista.join(',');
}

function versaoDoModo(texto) {
  return itensDoModo(texto).size > 0 ? `${version}-sprint` : version;
}

module.exports = { modo, porta, TODOS, itensDoModo, modoDosItens, versaoDoModo };
