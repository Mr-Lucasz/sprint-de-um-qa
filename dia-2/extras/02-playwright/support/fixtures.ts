import { test as base, expect } from '@playwright/test';
import { criarUsuarioLogado } from './api';
import { ProgramacaoPage } from '../pages/ProgramacaoPage';
import { MinhasInscricoesPage } from '../pages/MinhasInscricoesPage';

// Fixtures customizadas: https://playwright.dev/docs/test-fixtures
// - usuarioLogado: cria um usuário novo pela API e injeta a sessão no navegador,
//   pulando a tela de login (ela já é testada em login.spec.ts).
// - programacao / minhasInscricoes: Page Objects prontos para uso.

type Fixtures = {
  usuarioLogado: Awaited<ReturnType<typeof criarUsuarioLogado>>;
  programacao: ProgramacaoPage;
  minhasInscricoes: MinhasInscricoesPage;
};

export const test = base.extend<Fixtures>({
  usuarioLogado: async ({ page, request }, use) => {
    const usuario = await criarUsuarioLogado(request);
    await page.addInitScript(({ token, usuario }) => {
      localStorage.setItem('inscrevi.token', token);
      localStorage.setItem('inscrevi.usuario', JSON.stringify(usuario));
    }, { token: usuario.token, usuario: usuario.usuario });
    await use(usuario);
  },
  programacao: async ({ page }, use) => {
    await use(new ProgramacaoPage(page));
  },
  minhasInscricoes: async ({ page }, use) => {
    await use(new MinhasInscricoesPage(page));
  },
});

export { expect };
