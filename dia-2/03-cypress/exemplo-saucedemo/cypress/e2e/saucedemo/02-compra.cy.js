// Uma jornada completa: entrar, pôr um produto no carrinho e finalizar a compra.
// Mostra o encadeamento de comandos e por que o Cypress dispensa esperas fixas.
const URL = 'https://www.saucedemo.com';

describe('Sauce Demo · Compra', () => {
  beforeEach(() => {
    // O login é pré-condição de todos os testes daqui, então fica no beforeEach
    cy.visit(URL);
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
  });

  it('lista os seis produtos da loja', () => {
    cy.get('[data-test="inventory-item"]').should('have.length', 6);
  });

  it('adiciona um produto e o carrinho mostra 1', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // O Cypress repete a asserção até ela passar ou o tempo acabar (4 s por padrão)
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1');
    cy.get('[data-test="remove-sauce-labs-backpack"]').should('be.visible');
  });

  it('remove o produto e o contador do carrinho some', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();

    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });

  it('finaliza a compra de um produto', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-link"]').click();

    // cy.contains procura pelo texto que a pessoa vê na tela
    cy.contains('[data-test="inventory-item-name"]', 'Sauce Labs Backpack').should('be.visible');
    cy.get('[data-test="checkout"]').click();

    cy.get('[data-test="firstName"]').type('Ana');
    cy.get('[data-test="lastName"]').type('Lima');
    cy.get('[data-test="postalCode"]').type('89219-710');
    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="finish"]').click();

    cy.get('[data-test="complete-header"]').should('have.text', 'Thank you for your order!');
  });
});
