// Os casos de teste da SD01 (dia-1/03-casos-de-teste/exemplo-saucedemo.csv)
// virando automação. O nome de cada it traz o id do caso e a regra conferida.
describe('Sauce Demo · SD01 Finalizar compra', () => {
  beforeEach(() => {
    // O login é pré-condição de todos os casos
    cy.loginSauce();
  });

  // Leva do carrinho até a tela de dados de entrega
  const iniciarCheckout = () => {
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="checkout"]').click();
  };

  it('CT-01 · recusa o checkout sem First Name', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    iniciarCheckout();

    cy.get('[data-test="lastName"]').type('Lima');
    cy.get('[data-test="postalCode"]').type('89219-710');
    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="error"]').should('have.text', 'Error: First Name is required');
    cy.url().should('include', '/checkout-step-one.html');
  });

  it('CT-04 · mostra subtotal, imposto de 8% e total de um produto', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    iniciarCheckout();

    cy.get('[data-test="firstName"]').type('Ana');
    cy.get('[data-test="lastName"]').type('Lima');
    cy.get('[data-test="postalCode"]').type('89219-710');
    cy.get('[data-test="continue"]').click();

    // O esperado foi calculado a partir da regra 2, antes de olhar a tela
    cy.get('[data-test="subtotal-label"]').should('have.text', 'Item total: $29.99');
    cy.get('[data-test="tax-label"]').should('have.text', 'Tax: $2.40');
    cy.get('[data-test="total-label"]').should('have.text', 'Total: $32.39');
  });

  it('CT-07 · conclui o pedido e esvazia o carrinho', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    iniciarCheckout();

    cy.get('[data-test="firstName"]').type('Ana');
    cy.get('[data-test="lastName"]').type('Lima');
    cy.get('[data-test="postalCode"]').type('89219-710');
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="finish"]').click();

    cy.get('[data-test="complete-header"]').should('have.text', 'Thank you for your order!');
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });

  // ESTE TESTE FICA VERMELHO DE PROPÓSITO.
  // Ele descreve o comportamento esperado pela regra 3 da SD01, e a loja não a
  // respeita: é o defeito relatado em dia-1/05-defeitos. O teste só fica verde
  // quando o defeito for corrigido. Não ajuste a asserção para ele passar.
  it('CT-06 · não inicia o checkout com o carrinho vazio', () => {
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
    iniciarCheckout();

    cy.url().should('not.include', '/checkout-step-one.html');
  });
});
