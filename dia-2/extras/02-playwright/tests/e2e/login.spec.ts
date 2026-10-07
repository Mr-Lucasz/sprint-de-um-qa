import { test, expect } from '@playwright/test';
import { MARIA } from '../../support/dados';

// US02 — Login. Locators priorizam o que a pessoa usuária vê:
// https://playwright.dev/docs/locators

test.describe('US02 · Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/entrar');
  });

  test('entra com credenciais válidas', async ({ page }) => {
    await page.getByLabel('E-mail').fill(MARIA.email);
    await page.getByLabel('Senha').fill(MARIA.senha);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByRole('heading', { name: 'Programação' })).toBeVisible();
    await expect(page.getByTestId('usuario-logado')).toHaveText('Olá, Maria');
    await expect(page.getByRole('link', { name: 'Minhas inscrições' })).toBeVisible();
  });

  test('mostra mensagem clara com senha incorreta', async ({ page }) => {
    await page.getByLabel('E-mail').fill(MARIA.email);
    await page.getByLabel('Senha').fill('senha-errada');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByRole('alert')).toHaveText('E-mail ou senha incorretos.');
    await expect(page).toHaveURL(/#\/entrar$/);
  });
});
