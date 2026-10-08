// Ações sobre elementos e as formas de conferir o resultado.
// No scaffold do Cypress, equivale a actions.cy.js, assertions.cy.js e connectors.cy.js.
describe('Sauce Demo · Ações e asserções', () => {
  context('na tela de login', () => {
    beforeEach(() => {
      cy.visit('https://www.saucedemo.com');
    });

    it('type digita, clear apaga e have.value confere o campo', () => {
      cy.get('[data-test="username"]').type('usuario_errado').should('have.value', 'usuario_errado');
      cy.get('[data-test="username"]').clear().should('have.value', '');
    });

    it('type aceita teclas especiais como {enter}', () => {
      cy.get('[data-test="username"]').type('standard_user');
      // {enter} envia o formulário sem clicar no botão
      cy.get('[data-test="password"]').type('secret_sauce{enter}');

      cy.url().should('include', '/inventory.html');
    });

    it('should encadeia várias asserções com and', () => {
      cy.get('[data-test="login-button"]')
        .should('be.visible')
        .and('be.enabled')
        .and('have.value', 'Login')
        .and('have.attr', 'type', 'submit');

      cy.get('[data-test="username"]').should('have.attr', 'placeholder', 'Username');
    });

    it('focus e blur movem o foco entre os campos', () => {
      cy.get('[data-test="username"]').focus().should('have.focus');
      cy.get('[data-test="username"]').blur().should('not.have.focus');
    });
  });

  context('na lista de produtos', () => {
    beforeEach(() => {
      cy.loginSauce();
    });

    it('select escolhe uma opção de uma lista', () => {
      cy.get('[data-test="product-sort-container"]').select('Price (low to high)');

      cy.get('[data-test="inventory-item-price"]').first().should('have.text', '$7.99');
      cy.get('[data-test="inventory-item-price"]').last().should('have.text', '$49.99');
    });

    it('then entrega o elemento para conferir com expect', () => {
      cy.get('[data-test="product-sort-container"]').select('Name (Z to A)');

      cy.get('[data-test="inventory-item-name"]').then(($nomes) => {
        // Dentro do then o código é JavaScript comum
        const nomes = [...$nomes].map((el) => el.innerText);
        const ordenados = [...nomes].sort().reverse();

        expect(nomes).to.deep.equal(ordenados);
      });
    });

    it('invoke chama uma função do elemento e its lê uma propriedade', () => {
      cy.get('[data-test="inventory-item-price"]').first().invoke('text').should('match', /^\$\d+\.\d{2}$/);
      cy.get('[data-test="inventory-item"]').its('length').should('eq', 6);
    });

    it('should com função permite uma regra própria', () => {
      // A função é repetida até passar, como qualquer should
      cy.get('[data-test="inventory-item-price"]').should(($precos) => {
        const valores = [...$precos].map((el) => Number(el.innerText.replace('$', '')));

        expect(Math.min(...valores)).to.equal(7.99);
        expect(Math.max(...valores)).to.equal(49.99);
      });
    });

    it('confere a classe e a ausência de um elemento', () => {
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('have.class', 'btn_primary');
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();

      cy.get('[data-test="remove-sauce-labs-backpack"]').should('have.class', 'btn_secondary');
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('not.exist');
    });

    it('click abre o menu lateral e o link fica visível', () => {
      cy.get('[data-test="logout-sidebar-link"]').should('not.be.visible');
      cy.get('#react-burger-menu-btn').click();

      cy.get('[data-test="logout-sidebar-link"]').should('be.visible').click();
      cy.get('[data-test="login-button"]').should('be.visible');
    });
  });
});
