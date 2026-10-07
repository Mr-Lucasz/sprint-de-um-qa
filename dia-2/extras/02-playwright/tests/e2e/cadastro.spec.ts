import { test, expect } from '@playwright/test';
import { novoUsuario } from '../../support/dados';

// US01 — Cadastro pela interface

test.describe('US01 · Cadastro pela interface', () => {
  test('cria a conta e leva para a tela de login', async ({ page }) => {
    const dados = novoUsuario();
    await page.goto('/#/criar-conta');

    await page.getByLabel('Nome completo').fill(dados.nome);
    await page.getByLabel('E-mail').fill(dados.email);
    await page.getByLabel('Senha').fill(dados.senha);
    await page.getByRole('button', { name: 'Criar conta' }).click();

    await expect(page.getByTestId('mensagem')).toHaveText('Conta criada. Agora é só entrar.');
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });

  test('explica o motivo quando a senha é curta demais', async ({ page }) => {
    const dados = novoUsuario({ senha: '123' });
    await page.goto('/#/criar-conta');

    await page.getByLabel('Nome completo').fill(dados.nome);
    await page.getByLabel('E-mail').fill(dados.email);
    await page.getByLabel('Senha').fill(dados.senha);
    await page.getByRole('button', { name: 'Criar conta' }).click();

    // Critério de aceite: a mensagem precisa dizer o que corrigir
    await expect(page.getByRole('alert')).toHaveText('A senha deve ter entre 8 e 64 caracteres.');
  });
});
