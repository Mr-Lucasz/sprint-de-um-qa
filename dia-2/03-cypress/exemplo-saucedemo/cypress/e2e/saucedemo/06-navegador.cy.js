// O que o Cypress enxerga além dos elementos: endereço, histórico, tamanho da
// tela, cookies, armazenamento local, janela e capturas de tela.
// No scaffold do Cypress, equivale a location.cy.js, navigation.cy.js,
// viewport.cy.js, cookies.cy.js, storage.cy.js, window.cy.js e misc.cy.js.
describe('Sauce Demo · Navegador', () => {
  beforeEach(() => {
    cy.loginSauce();
  });

  it('cy.url e cy.location leem o endereço', () => {
    cy.url().should('eq', 'https://www.saucedemo.com/inventory.html');
    cy.location('pathname').should('eq', '/inventory.html');
    cy.location('hostname').should('eq', 'www.saucedemo.com');
  });

  it('cy.go volta e avança no histórico e cy.reload recarrega', () => {
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.location('pathname').should('eq', '/cart.html');

    cy.go('back');
    cy.location('pathname').should('eq', '/inventory.html');

    cy.go('forward');
    cy.location('pathname').should('eq', '/cart.html');

    cy.reload();
    cy.get('[data-test="title"]').should('have.text', 'Your Cart');
  });

  it('cy.title e cy.document leem dados da página', () => {
    cy.title().should('eq', 'Swag Labs');
    cy.document().its('charset').should('eq', 'UTF-8');
  });

  it('cy.viewport simula outros tamanhos de tela', () => {
    cy.viewport('iphone-x');
    cy.get('[data-test="inventory-list"]').should('be.visible');

    cy.viewport(1280, 720);
    cy.get('[data-test="inventory-list"]').should('be.visible');
  });

  it('cy.getCookie mostra o cookie criado pelo login', () => {
    cy.getCookie('session-username').should('have.property', 'value', 'standard_user');

    cy.clearCookies();
    cy.getCookie('session-username').should('be.null');
  });

  it('o carrinho fica guardado no localStorage', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1');

    // cy.window devolve a janela da aplicação: dá para ler o que ela guardou
    cy.window().its('localStorage').invoke('getItem', 'cart-contents').should('eq', '[4]');

    cy.clearLocalStorage();
    cy.reload();
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist');
  });

  it('cy.screenshot guarda uma imagem como evidência', () => {
    // As imagens vão para cypress/screenshots (ignorada pelo Git)
    // capture: 'viewport' fotografa só a parte visível, sem rolar a página
    cy.screenshot('lista-de-produtos', { capture: 'viewport' });
  });

  it('cy.wrap traz um valor comum para dentro da cadeia do Cypress', () => {
    const produto = { nome: 'Sauce Labs Backpack', preco: 29.99 };

    cy.wrap(produto).its('preco').should('be.greaterThan', 20);
    cy.wrap(['a', 'b', 'c']).should('have.length', 3).and('include', 'b');
  });
});
