// Page Object da lista de produtos

// traz os seletores da página de produtos
import { produtos } from '../locators/saucedemo';

class ProdutosPage {
  // devolve o título para o teste conferir
  titulo() {
    return cy.get(produtos.titulo);
  }

  // adiciona ao carrinho o produto com esse nome
  adicionarAoCarrinho(nome) {
    // acha o nome, sobe até o cartão, desce até o botão e clica
    cy.contains(produtos.nomeDoItem, nome).parents(produtos.item).find('button').click();
  }

  // devolve o contador do carrinho para o teste conferir
  contadorDoCarrinho() {
    return cy.get(produtos.contadorDoCarrinho);
  }
}

export default new ProdutosPage();
