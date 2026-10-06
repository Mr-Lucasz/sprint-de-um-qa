// Gera massa de teste para o cadastro (US01) combinando Faker com as partições
// de equivalência e os valores limite definidos no backlog.
//
// Uso:  npm run massa            -> imprime no terminal
//       npm run massa -- 20      -> 20 usuários válidos + casos de borda
//
// Exercício: peça a uma IA para propor casos de borda que ainda NÃO estão aqui,
// revise criticamente cada sugestão e adicione as que fizerem sentido.
const { fakerPT_BR: faker } = require('@faker-js/faker');

const quantidade = Number(process.argv[2] || 5);
faker.seed(2026); // semente fixa: a mesma massa a cada execução (reprodutibilidade)

const validos = Array.from({ length: quantidade }, () => ({
  particao: 'válido',
  nome: faker.person.fullName(),
  email: faker.internet.email({ provider: 'teste.dev' }).toLowerCase(),
  senha: faker.internet.password({ length: faker.number.int({ min: 8, max: 64 }) }),
  esperado: 201,
}));

const bordas = [
  { particao: 'senha no limite inferior - 1', senha: 'a'.repeat(7), esperado: 400 },
  { particao: 'senha no limite inferior', senha: 'a'.repeat(8), esperado: 201 },
  { particao: 'senha no limite superior', senha: 'a'.repeat(64), esperado: 201 },
  { particao: 'senha no limite superior + 1', senha: 'a'.repeat(65), esperado: 400 },
  { particao: 'nome com 2 caracteres', nome: 'Al', esperado: 400 },
  { particao: 'nome só com espaços', nome: '     ', esperado: 400 },
  { particao: 'e-mail sem @', email: 'ana.teste.dev', esperado: 400 },
  { particao: 'e-mail sem domínio', email: 'ana@', esperado: 400 },
  { particao: 'e-mail sem extensão', email: 'ana@empresa', esperado: 400 },
].map((caso) => ({
  nome: faker.person.fullName(),
  email: faker.internet.email({ provider: 'teste.dev' }).toLowerCase(),
  senha: 'Senha@1234',
  ...caso,
}));

console.log(JSON.stringify([...validos, ...bordas], null, 2));
