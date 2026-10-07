import { Locator, Page } from '@playwright/test';

// Page Object Model: https://playwright.dev/docs/pom
export class ProgramacaoPage {
  readonly titulo: Locator;
  readonly mensagem: Locator;

  constructor(private readonly page: Page) {
    this.titulo = page.getByRole('heading', { name: 'Programação' });
    this.mensagem = page.getByTestId('mensagem');
  }

  // Primeira visita: carrega a página. Depois: navega pelo menu, como a pessoa usuária faria.
  async abrir() {
    if (this.page.url().startsWith('http')) {
      await this.page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Programação' }).click();
    } else {
      await this.page.goto('/#/cursos');
    }
    await this.titulo.waitFor();
  }

  curso(titulo: string): Locator {
    return this.page.getByRole('article', { name: titulo, exact: true });
  }

  vagas(titulo: string): Locator {
    return this.curso(titulo).getByText(/vagas disponíveis/);
  }

  async inscrever(titulo: string) {
    await this.curso(titulo).getByRole('button', { name: `Inscrever-se em ${titulo}` }).click();
  }
}
