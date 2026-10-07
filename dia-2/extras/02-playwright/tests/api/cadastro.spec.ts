import { test, expect } from '@playwright/test';
import { novoUsuario } from '../../support/dados';

// US01 — Cadastro de usuário (ver sprint/backlog.md)
// Testes de API com Playwright: https://playwright.dev/docs/api-testing

test.describe('US01 · Cadastro de usuário', () => {
  test('cadastra com dados válidos e não devolve a senha', async ({ request }) => {
    const dados = novoUsuario();

    const resposta = await request.post('/api/usuarios', { data: dados });

    expect(resposta.status()).toBe(201);
    const corpo = await resposta.json();
    expect(corpo).toMatchObject({ nome: dados.nome, email: dados.email, perfil: 'aluno' });
    expect(corpo.id).toEqual(expect.any(Number));
    expect(corpo).not.toHaveProperty('senha');
    expect(corpo).not.toHaveProperty('senhaHash');
  });

  test('recusa e-mail já cadastrado', async ({ request }) => {
    const dados = novoUsuario();
    await request.post('/api/usuarios', { data: dados });

    const resposta = await request.post('/api/usuarios', { data: { ...dados, email: dados.email.toUpperCase() } });

    expect(resposta.status()).toBe(409);
    expect(await resposta.json()).toEqual({ mensagem: 'Este e-mail já está cadastrado.' });
  });

  // Análise de valor limite (CTFL 4.0, seção 4.2.2): senha deve ter de 8 a 64 caracteres.
  // Testes parametrizados: https://playwright.dev/docs/test-parameterize
  const limitesSenha = [
    { tamanho: 7, esperado: 400 },
    { tamanho: 8, esperado: 201 },
    { tamanho: 64, esperado: 201 },
    { tamanho: 65, esperado: 400 },
  ];
  for (const { tamanho, esperado } of limitesSenha) {
    test(`senha com ${tamanho} caracteres retorna ${esperado}`, async ({ request }) => {
      const resposta = await request.post('/api/usuarios', {
        data: novoUsuario({ senha: 'a'.repeat(tamanho) }),
      });
      expect(resposta.status()).toBe(esperado);
    });
  }

  // Particionamento de equivalência (CTFL 4.0, seção 4.2.1): partições inválidas de e-mail
  const emailsInvalidos = ['ana', 'ana@', 'ana@empresa', 'ana silva@teste.dev', '@teste.dev'];
  for (const email of emailsInvalidos) {
    test(`recusa e-mail inválido "${email}"`, async ({ request }) => {
      const resposta = await request.post('/api/usuarios', { data: novoUsuario({ email }) });
      expect(resposta.status()).toBe(400);
      expect((await resposta.json()).mensagem).toContain('e-mail válido');
    });
  }
});
