// Modelo para automatizar os cenários que você planejou no dia 1.
// Copie este arquivo com o nome da sua história (ex.: us06-cancelamento.cy.js)
// e escreva um it para cada cenário do seu arquivo de casos de teste:
//
//   Dado    → preparação (beforeEach, cy.visit, cy.loginPelaApi, cy.criarCurso)
//   Quando  → ação pela tela (cy.getByTestId(...).type / .click)
//   Então   → asserção (.should)
describe('USxx · Nome da sua história', () => {
  // Este teste só confere se o Cypress alcança o Inscrevi. Apague quando o seu
  // primeiro cenário estiver rodando.
  it('abre o Inscrevi', () => {
    cy.visit('/');

    cy.getByTestId('rodape-versao').should('be.visible');
  });

  // Tire o .skip e troque pelo seu cenário
  it.skip('cenário do seu caso de teste', () => {
    // Dado ...

    // Quando ...

    // Então ...
  });
});
