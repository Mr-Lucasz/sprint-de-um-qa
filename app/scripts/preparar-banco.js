// Cria (ou completa) os ambientes de teste no banco apontado por DATABASE_URL.
//
//   npm run banco:preparar            -> dupla-01 a dupla-20 e o ambiente "instrutor"
//   npm run banco:preparar -- 12      -> dupla-01 a dupla-12 e o ambiente "instrutor"
//
// Ambientes que já existem são mantidos como estão.
const banco = require('../src/banco');

async function principal() {
  if (!banco.hospedado) throw new Error('Defina DATABASE_URL (veja .env.example).');
  const quantidade = Number(process.argv[2]) || 20;
  const nomes = Array.from({ length: quantidade }, (_, i) => `dupla-${String(i + 1).padStart(2, '0')}`);

  for (const nome of nomes) {
    const criado = await banco.criarAmbiente(nome, 'sprint');
    console.log(`${nome}: ${criado ? 'criado' : 'já existia'}`);
  }
  const criado = await banco.criarAmbiente('instrutor', 'estavel');
  console.log(`instrutor: ${criado ? 'criado' : 'já existia'}`);
}

principal().then(() => process.exit(0), (e) => { console.error(e.message); process.exit(1); });
