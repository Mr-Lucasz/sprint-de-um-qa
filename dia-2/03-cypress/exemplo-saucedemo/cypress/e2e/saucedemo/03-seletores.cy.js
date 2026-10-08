// Formas de encontrar elementos: consulta (querying) e travessia (traversal).
// No scaffold do Cypress, equivale a querying.cy.js e traversal.cy.js.
describe('Sauce Demo · Encontrando elementos', () => {
  beforeEach(() => {
    cy.loginSauce();
  });

  it('cy.get aceita qualquer seletor CSS', () => {
    cy.get('#react-burger-menu-btn').should('exist'); // por id
    cy.get('.inventory_item').should('have.length', 6); // por classe
    cy.get('[data-test="inventory-list"]').should('be.visible'); // por atributo (o mais estável)
    cy.get('button[data-test^="add-to-cart"]').should('have.length', 6); // atributo que começa com
  });

  it('cy.contains encontra pelo texto', () => {
    cy.contains('Sauce Labs Backpack').should('be.visible');
    // Com seletor + texto: o elemento desse tipo que contém o texto
    cy.contains('[data-test="inventory-item-name"]', 'Bike Light').should('be.visible');
    // Com expressão regular, ignorando maiúsculas
    cy.contains(/sauce labs onesie/i).should('be.visible');
  });

  it('first, last e eq escolhem pela posição', () => {
    cy.get('[data-test="inventory-item-name"]').first().should('have.text', 'Sauce Labs Backpack');
    cy.get('[data-test="inventory-item-name"]').last().should('contain', 'Test.allTheThings()');
    cy.get('[data-test="inventory-item-name"]').eq(1).should('have.text', 'Sauce Labs Bike Light');
  });

  it('find e within procuram dentro de um elemento', () => {
    // find: desce a partir do elemento encontrado
    cy.get('[data-test="inventory-item"]').first().find('[data-test="inventory-item-price"]').should('have.text', '$29.99');

    // within: todos os comandos do bloco ficam restritos àquele elemento
    cy.get('[data-test="inventory-item"]').eq(1).within(() => {
      cy.get('[data-test="inventory-item-name"]').should('have.text', 'Sauce Labs Bike Light');
      cy.get('button').click();
      cy.get('button').should('have.text', 'Remove');
    });
  });

  it('parents e closest sobem a partir de um elemento', () => {
    // Parte do nome do produto, sobe até o cartão e clica no botão dele
    cy.contains('[data-test="inventory-item-name"]', 'Sauce Labs Onesie')
      .parents('[data-test="inventory-item"]')
      .find('button')
      .click();

    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1');
    cy.get('[data-test="remove-sauce-labs-onesie"]').closest('[data-test="inventory-item"]').should('contain', '$7.99');
  });

  it('filter e not refinam uma lista', () => {
    cy.get('[data-test="inventory-item-name"]').filter(':contains("T-Shirt")').should('have.length', 2);
    cy.get('[data-test="inventory-item-name"]').not(':contains("Sauce Labs")').should('have.length', 1);
  });

  it('each percorre todos os elementos', () => {
    cy.get('[data-test="inventory-item-price"]').each(($preco) => {
      // $preco é um elemento jQuery: .text() devolve o texto dele
      expect($preco.text()).to.match(/^\$\d+\.\d{2}$/);
    });
  });
});
