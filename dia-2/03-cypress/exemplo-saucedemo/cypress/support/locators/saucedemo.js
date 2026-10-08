// Todos os seletores do Sauce Demo num lugar só. Se a tela mudar, o conserto é
// aqui, e não em cada teste.

// export deixa outros arquivos importarem este objeto
export const login = {
  // campo do usuário
  usuario: '[data-test="username"]',
  // campo da senha
  senha: '[data-test="password"]',
  // botão de entrar
  botaoEntrar: '[data-test="login-button"]',
  // caixa de mensagem de erro
  erro: '[data-test="error"]',
};

// seletores da página de produtos
export const produtos = {
  // título da página ("Products")
  titulo: '[data-test="title"]',
  // cartão de um produto
  item: '[data-test="inventory-item"]',
  // nome do produto dentro do cartão
  nomeDoItem: '[data-test="inventory-item-name"]',
  // número em cima do ícone do carrinho
  contadorDoCarrinho: '[data-test="shopping-cart-badge"]',
};
