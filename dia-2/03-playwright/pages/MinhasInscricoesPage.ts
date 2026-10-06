import { Locator, Page } from '@playwright/test';

export class MinhasInscricoesPage {
  readonly titulo: Locator;
  readonly listaVazia: Locator;

  constructor(private readonly page: Page) {
    this.titulo = page.getByRole('heading', { name: 'Minhas inscrições' });
    this.listaVazia = page.getByTestId('lista-vazia');
  }

  async abrir() {
    await this.page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Minhas inscrições' }).click();
    await this.titulo.waitFor();
  }

  async cancelar(titulo: string) {
    await this.page.getByRole('button', { name: `Cancelar inscrição em ${titulo}` }).click();
  }
}
