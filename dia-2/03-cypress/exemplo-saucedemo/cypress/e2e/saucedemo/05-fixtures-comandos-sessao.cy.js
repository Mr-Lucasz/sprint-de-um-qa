// Organização: dados em fixtures, apelidos, comandos customizados e sessão.
// No scaffold do Cypress, equivale a files.cy.js, aliasing.cy.js e ao support/commands.js.
describe('Sauce Demo · Fixtures, apelidos e comandos', () => {
  it('cy.fixture lê os dados de cypress/fixtures', () => {
    // Os dados saem do teste e vão para um arquivo JSON, fácil de trocar
    cy.fixture('sauce').then(({ bloqueado }) => {
      cy.loginSauce(bloqueado.usuario, bloqueado.senha);
    });

    cy.get('[data-test="error"]').should('contain', 'locked out');
  });

  it('as dá um apelido para reutilizar com @', () => {
    cy.loginSauce();
    cy.fixture('sauce').as('dados');
    cy.get('[data-test="inventory-item"]').first().as('primeiroProduto');

    cy.get('@primeiroProduto').find('button').click();
    cy.get('@primeiroProduto').find('button').should('have.text', 'Remove');

    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="checkout"]').click();

    cy.get('@dados').then(({ cliente }) => {
      cy.get('[data-test="firstName"]').type(cliente.nome);
      cy.get('[data-test="lastName"]').type(cliente.sobrenome);
      cy.get('[data-test="postalCode"]').type(cliente.cep);
    });
    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="total-label"]').should('contain', '$32.39');
  });

  it('comando customizado esconde os passos que se repetem', () => {
    // cy.loginSauce está em cypress/support/commands.js
    cy.loginSauce();

    cy.get('[data-test="title"]').should('have.text', 'Products');
  });

  context('cy.session guarda o login entre os testes', () => {
    beforeEach(() => {
      // Na primeira vez o bloco roda e a sessão é guardada. Nas seguintes, o
      // Cypress restaura cookies e localStorage sem passar pela tela de login.
      cy.session('standard_user', () => {
        cy.loginSauce();
        cy.url().should('include', '/inventory.html');
      });
      // failOnStatusCode: o Sauce Demo é um app de página única e responde 404
      // quando uma rota interna é aberta direto pelo endereço
      cy.visit('https://www.saucedemo.com/inventory.html', { failOnStatusCode: false });
    });

    it('abre a lista de produtos já logado', () => {
      cy.get('[data-test="inventory-item"]').should('have.length', 6);
    });

    it('abre o carrinho já logado, sem repetir o login', () => {
      cy.get('[data-test="shopping-cart-link"]').click();

      cy.get('[data-test="title"]').should('have.text', 'Your Cart');
    });
  });
});
