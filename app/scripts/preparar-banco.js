// Prepara o banco apontado por DATABASE_URL:
//
//   npm run banco:preparar   -> "turma" (compartilhado, na raiz do site) e "instrutor" (estável)
//
// Ambientes que já existem são mantidos como estão.
const banco = require('../src/banco');

async function principal() {
  if (!banco.hospedado) throw new Error('Defina DATABASE_URL (veja .env.example).');
  for (const [nome, modo] of [[process.env.AMBIENTE_RAIZ || 'turma', 'sprint'], ['instrutor', 'estavel']]) {
    const criado = await banco.criarAmbiente(nome, modo);
    console.log(`${nome}: ${criado ? 'criado' : 'já existia'}`);
  }
}

principal().then(() => process.exit(0), (e) => { console.error(e.message); process.exit(1); });
