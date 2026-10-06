// Jornada de inscrição com cy.intercept para esperar a API sem cy.wait(número)
// https://docs.cypress.io/api/commands/intercept
describe('Jornada de inscrição', () => {
  beforeEach(() => {
    cy.loginPelaApi();
  });

  it('inscreve-se e o contador de vagas diminui', () => {
    cy.criarCurso({ vagas: 3 }).then((curso) => {
      cy.intercept('POST', '/api/inscricoes').as('inscrever');
      cy.visit('/#/cursos');

      cy.getByTestId(`vagas-${curso.id}`).should('have.text', '3 de 3 vagas disponíveis');
      cy.getByTestId(`botao-inscrever-${curso.id}`).click();

      // A especificação da API (US04) diz que a criação retorna 201
      cy.wait('@inscrever').its('response.statusCode').should('eq', 201);
      cy.getByTestId(`vagas-${curso.id}`).should('have.text', '2 de 3 vagas disponíveis');
      cy.getByTestId(`inscrito-${curso.id}`).should('be.visible');
    });
  });
});
