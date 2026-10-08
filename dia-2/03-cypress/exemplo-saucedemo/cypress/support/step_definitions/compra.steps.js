import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
// os passos agora conversam com as páginas, e não mais com os seletores
import LoginPage from '../pages/LoginPage';
import ProdutosPage from '../pages/ProdutosPage';

Given('que estou na tela de login do Sauce Demo', () => {
  // antes: cy.visit(...)
  LoginPage.visitar();
});

When('entro com o usuário {string} e a senha {string}', (usuario, senha) => {
  // antes: três linhas de cy.get; agora uma, que diz o que está sendo feito
  LoginPage.entrar(usuario, senha);
});

When('adiciono o produto {string} ao carrinho', (produto) => {
  // o "como achar o botão" foi morar na página
  ProdutosPage.adicionarAoCarrinho(produto);
});

Then('vejo a lista de produtos', () => {
  // a asserção continua no passo: é o passo que sabe o que é esperado
  cy.url().should('include', '/inventory.html');
  ProdutosPage.titulo().should('have.text', 'Products');
});

Then('o carrinho mostra {int} item/itens', (quantidade) => {
  // a página devolve o elemento; o passo confere o valor
  ProdutosPage.contadorDoCarrinho().should('have.text', String(quantidade));
});

Then('vejo o erro de login {string}', (mensagem) => {
  LoginPage.erro().should('contain', mensagem);
});
