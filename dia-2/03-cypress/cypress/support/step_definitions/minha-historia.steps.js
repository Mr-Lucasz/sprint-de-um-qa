// Passos do modelo minha-historia.feature. Dado, Quando e Então do Gherkin
// viram Given, When e Then no código, e o texto precisa ser igual ao da feature.
import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('que abro o Inscrevi', () => {
  cy.visit('/');
});

Then('vejo a versão no rodapé', () => {
  cy.getByTestId('rodape-versao').should('be.visible');
});
