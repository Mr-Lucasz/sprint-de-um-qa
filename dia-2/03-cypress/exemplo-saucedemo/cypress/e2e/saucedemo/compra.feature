# language: pt
# a linha acima libera as palavras-chave em português (Dado, Quando, Então)

# Funcionalidade: o assunto do arquivo (vira o "describe")
Funcionalidade: Compra no Sauce Demo

  # Cenário: um teste (vira o "it")
  Cenário: Entrar e adicionar um produto ao carrinho
    # Dado: a pré-condição, o estado de partida
    Dado que estou na tela de login do Sauce Demo
    # Quando: a ação. O que está entre aspas vira parâmetro do passo
    Quando entro com o usuário "standard_user" e a senha "secret_sauce"
    # E: repete o tipo do passo anterior (aqui, mais um Quando)
    E adiciono o produto "Sauce Labs Backpack" ao carrinho
    # Então: o resultado esperado, onde ficam as asserções
    Então vejo a lista de produtos
    # o número 1 também vira parâmetro
    E o carrinho mostra 1 item

  # Esquema do Cenário: o mesmo roteiro, executado uma vez por linha da tabela
  # <situacao> no título deixa o nome de cada execução diferente no relatório
  Esquema do Cenário: Recusar o login de <situacao>
    Dado que estou na tela de login do Sauce Demo
    # <usuario> e <senha> são trocados pelos valores da tabela
    Quando entro com o usuário "<usuario>" e a senha "<senha>"
    # <mensagem> também vem da tabela
    Então vejo o erro de login "<mensagem>"

    # Exemplos: a primeira linha dá o nome das colunas; cada linha seguinte é um teste
    Exemplos:
      | situacao          | usuario         | senha        | mensagem                           |
      | senha incorreta   | standard_user   | senha-errada | Username and password do not match |
      | usuário bloqueado | locked_out_user | secret_sauce | this user has been locked out      |
