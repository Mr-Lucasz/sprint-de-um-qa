// US02 — Login (mesmo cenário de dia-2/03-playwright/tests/e2e/login.spec.ts, para comparar)
describe('US02 · Login', () => {
  beforeEach(() => {
    cy.visit('/#/entrar');
  });

  it('entra com credenciais válidas', () => {
    cy.getByTestId('campo-email').type('maria@inscrevi.dev');
    cy.getByTestId('campo-senha').type('Senha@123', { log: false });
    cy.getByTestId('botao-entrar').click();

    cy.contains('h1', 'Programação').should('be.visible');
    cy.getByTestId('usuario-logado').should('have.text', 'Olá, Maria');
  });

  it('mostra mensagem clara com senha incorreta', () => {
    cy.getByTestId('campo-email').type('maria@inscrevi.dev');
    cy.getByTestId('campo-senha').type('senha-errada', { log: false });
    cy.getByTestId('botao-entrar').click();

    cy.getByTestId('erro-formulario').should('have.text', 'E-mail ou senha incorretos.');
    cy.location('hash').should('eq', '#/entrar');
  });
});
