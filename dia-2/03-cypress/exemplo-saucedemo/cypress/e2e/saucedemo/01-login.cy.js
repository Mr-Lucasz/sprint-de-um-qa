// Primeiro contato com o Cypress, num site público feito para praticar automação.
// Este arquivo é o resultado do live coding: tente escrever junto antes de olhar.
//
// Os três passos de quase todo teste de interface:
//   1. cy.visit   abre a página
//   2. cy.get     encontra um elemento (e .type / .click interagem com ele)
//   3. .should    confere o resultado
const URL = 'https://www.saucedemo.com';

describe('Sauce Demo · Login', () => {
  // Roda antes de cada it: todo teste começa do mesmo ponto, sem depender do anterior
  beforeEach(() => {
    cy.visit(URL);
  });

  it('entra com usuário e senha válidos', () => {
    // O Sauce Demo marca os elementos com data-test, feito para a automação
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();

    // Sem asserção não há teste: aqui conferimos a URL e o título da página
    cy.url().should('include', '/inventory.html');
    cy.get('[data-test="title"]').should('have.text', 'Products');
  });

  it('recusa a senha incorreta com uma mensagem', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('senha-errada');
    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Username and password do not match');
    cy.url().should('not.include', '/inventory.html');
  });

  it('avisa quando o usuário está bloqueado', () => {
    cy.get('[data-test="username"]').type('locked_out_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]').should('contain', 'this user has been locked out');
  });

  it('exige o usuário antes de enviar', () => {
    cy.get('[data-test="login-button"]').click();

    cy.get('[data-test="error"]').should('contain', 'Username is required');
  });
});
