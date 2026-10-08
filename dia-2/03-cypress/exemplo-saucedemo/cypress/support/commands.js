// Comandos customizados: ações que vários testes usam como pré-condição.

// o comando reaproveita a página de login
import LoginPage from './pages/LoginPage';

// Cypress.Commands.add cria um comando novo: cy.loginSauce()
// os valores depois do = são usados quando nada é informado
Cypress.Commands.add('loginSauce', (usuario = 'standard_user', senha = 'secret_sauce') => {
  // abre a tela de login
  LoginPage.visitar();
  // e entra
  LoginPage.entrar(usuario, senha);
});

// Entra no Inscrevi PELA API e devolve o token, para usar em rotas protegidas.
Cypress.Commands.add('tokenDoInscrevi', (email = 'maria@inscrevi.dev', senha = 'Senha@123') => {
  // endereço completo, porque o baseUrl deste projeto é o Sauce Demo
  // cy.request chama a API direto; .its('body.token') pega só o token da resposta
  return cy.request('POST', 'https://inscrevi.vercel.app/api/login', { email, senha }).its('body.token');
});
