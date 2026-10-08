// Page Object da tela de login: guarda O QUE dá para fazer nela.
// O teste diz o que quer (entrar); a página sabe como (campos e botão).

// traz os seletores da tela de login
import { login } from '../locators/saucedemo';

// uma classe por tela
class LoginPage {
  // abre a tela de login ('/' é completado com o baseUrl)
  visitar() {
    cy.visit('/');
  }

  // faz o login completo com os dados recebidos
  entrar(usuario, senha) {
    // usa o seletor pelo nome, sem repetir o texto do seletor
    cy.get(login.usuario).type(usuario);
    // log: false esconde a senha do relatório do Cypress
    cy.get(login.senha).type(senha, { log: false });
    cy.get(login.botaoEntrar).click();
  }

  // devolve o elemento do erro; quem chama decide o que conferir
  erro() {
    return cy.get(login.erro);
  }
}

// exporta um objeto pronto para usar: LoginPage.entrar(...)
export default new LoginPage();
