# language: pt
Funcionalidade: Carrinho do Sauce Demo

  # Contexto: roda antes de cada cenário deste arquivo (é o "beforeEach")
  Contexto:
    # aqui o login é só pré-condição, então um passo curto resolve
    Dado que estou logado no Sauce Demo

  Cenário: Adicionar dois produtos
    # este passo já existe em compra.steps.js: é reaproveitado
    Quando adiciono o produto "Sauce Labs Backpack" ao carrinho
    E adiciono o produto "Sauce Labs Bike Light" ao carrinho
    # "itens" casa com o mesmo passo de "item", por causa do item/itens
    Então o carrinho mostra 2 itens
