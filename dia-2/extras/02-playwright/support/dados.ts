import { fakerPT_BR as faker } from '@faker-js/faker';

// Massa de teste gerada com Faker (https://fakerjs.dev).
// O sufixo aleatório evita colisão de e-mail entre testes que rodam em paralelo.
export function novoUsuario(sobrescrever: Partial<{ nome: string; email: string; senha: string }> = {}) {
  return {
    nome: faker.person.fullName(),
    email: `${faker.string.alphanumeric(10).toLowerCase()}@teste.dev`,
    senha: faker.internet.password({ length: 12 }),
    ...sobrescrever,
  };
}

// Data futura aleatória para que cursos criados pelos testes não conflitem entre si
export function dataFutura() {
  return faker.date.future({ years: 3 }).toISOString().slice(0, 10);
}

export const ADMIN = { email: 'admin@inscrevi.dev', senha: 'Admin@123' };
export const MARIA = { email: 'maria@inscrevi.dev', senha: 'Senha@123', nome: 'Maria Souza' };
