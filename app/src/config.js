// Configuração do app "Inscrevi".
//
// Modos (via argumento de linha de comando, funciona em Windows, Linux e macOS):
//   node app/server.js                 -> modo "sprint" (comportamento padrão do curso)
//   node app/server.js --modo=estavel  -> modo "estavel" (versão de referência)
//   node app/server.js --modo=F01,F04  -> liga apenas os itens listados
//   node app/server.js --porta=4000    -> muda a porta (padrão 3000)
//
// Também aceita variáveis de ambiente: MODO e PORT.

function lerArg(nome) {
  const prefixo = `--${nome}=`;
  const arg = process.argv.find((a) => a.startsWith(prefixo));
  return arg ? arg.slice(prefixo.length) : undefined;
}

const modo = (lerArg('modo') || process.env.MODO || 'sprint').trim();
const porta = Number(lerArg('porta') || process.env.PORT || 3000);

const TODOS = ['F01', 'F02', 'F03', 'F04', 'F05', 'F06', 'F07', 'F08', 'F09', 'F10'];

let ativos;
if (modo === 'sprint') ativos = new Set(TODOS);
else if (modo === 'estavel') ativos = new Set();
else ativos = new Set(modo.split(',').map((s) => s.trim().toUpperCase()));

function ativo(id) {
  return ativos.has(id);
}

module.exports = { modo, porta, ativo, ativos: [...ativos] };
