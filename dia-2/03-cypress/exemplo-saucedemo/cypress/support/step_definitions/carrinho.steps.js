// só o Given é necessário neste arquivo
import { Given } from '@badeball/cypress-cucumber-preprocessor';

// O login aqui é só pré-condição, então usa o comando customizado.
// Os outros passos desta feature já existem em compra.steps.js.
Given('que estou logado no Sauce Demo', () => {
  // o comando criado no commands.js
  cy.loginSauce();
});
