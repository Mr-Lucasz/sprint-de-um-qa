# Exemplo · SD01 · Finalizar compra (Sauce Demo)

História escrita para as lições deste repositório. O
[Sauce Demo](https://www.saucedemo.com) é um site público de prática mantido
pela Sauce Labs e não tem backlog oficial: as regras abaixo foram escritas a
partir do comportamento da loja, para servir de exemplo.

Contas (a senha de todas é `secret_sauce`): `standard_user` entra normalmente,
`locked_out_user` está bloqueada e `problem_user` vê uma loja com defeitos.

## 1. O rascunho que chegou do PO

### Narrativa de negócio
A loja vende seis produtos e hoje a pessoa consegue colocá-los no carrinho, mas
não consegue concluir o pedido.

### Solução proposta
A partir do carrinho, a pessoa informa os dados de entrega, confere um resumo
com o imposto e confirma o pedido.

### História
**Como** cliente
**Quero** finalizar a compra do que está no meu carrinho
**Para** receber os produtos

### Critérios de aceite
```gherkin
# language: pt
Cenário: Compra com sucesso
  Dado que estou logado
  Quando adiciono produtos e finalizo a compra rapidamente
  Então o pedido deve ser processado adequadamente

Cenário: Dados de entrega
  Quando informo um nome válido e o CEP
  Então sigo para o resumo
  E o botão Continue deve ser verde com 16px

Cenário: Resumo do pedido
  Então vejo o total com o imposto
```

E também quero poder ordenar os produtos por preço.

## 2. A ficha INVEST preenchida

```
História: SD01 · Finalizar compra            Nome: (exemplo)

Nota: 0 = não atende · 1 = atende em parte · 2 = atende

| Letra | Nota | Justificativa |
|-------|------|---------------|
| I     | 1    | O checkout se sustenta sozinho, mas a ordenação por preço é de outra tela |
| N     | 1    | "Verde com 16px" fixa o como dentro do critério de aceite |
| V     | 2    | Sem concluir o pedido a loja não vende: o valor é claro |
| E     | 0    | Faltam as regras de campos obrigatórios, do imposto e do carrinho vazio |
| S     | 1    | Checkout e ordenação são duas funcionalidades |
| T     | 0    | "Rapidamente" e "adequadamente" não são verificáveis; um cenário não tem Quando |
Total: 5 / 12

Problemas encontrados (letra do INVEST · trecho · por que é problema):
1. T · "finalizo a compra rapidamente" · não há como medir
2. T · "processado adequadamente" · o Então não descreve nada observável
3. E · "nome válido" · não existe regra de validade nem cenário de campo vazio
4. N · "verde com 16px" · detalhe visual não é critério de aceite de negócio
5. E · "total com o imposto" · alíquota e arredondamento não definidos
6. S/I · "E também quero ordenar" · outra funcionalidade na mesma história
7. E · (ausente) · nenhum cenário trata o carrinho vazio
8. Gherkin · "Quando adiciono produtos e finalizo" · duas ações no mesmo passo;
   o cenário "Resumo do pedido" não tem Dado nem Quando

Perguntas para o PO:
- Quais campos da entrega são obrigatórios e qual a mensagem de cada um?
- De quanto é o imposto e como ele é arredondado?
- Dá para iniciar o checkout com o carrinho vazio?
- O que a pessoa vê quando o pedido é concluído? O carrinho esvazia?
- A ordenação por preço pode virar outra história?

Cenário reescrito:
  Cenário: Campo obrigatório vazio no checkout
    Dado que estou logado e tenho o produto "Sauce Labs Backpack" no carrinho
    E estou na tela "Checkout: Your Information"
    Quando clico em "Continue" sem preencher o campo "First Name"
    Então continuo na mesma tela
    E vejo a mensagem "Error: First Name is required"
```

## 3. A versão refinada

Esta é a referência para os casos de teste, o plano, a execução e o relato de
defeito das próximas lições.

### História
**Como** cliente logado
**Quero** finalizar a compra do que está no meu carrinho
**Para** receber os produtos

### Critérios de aceite
```gherkin
# language: pt
Regra 1: First Name, Last Name e Postal Code são obrigatórios

  Esquema do Cenário: Campo obrigatório vazio
    Dado que tenho o produto "Sauce Labs Backpack" no carrinho
    E estou na tela "Checkout: Your Information"
    Quando clico em "Continue" sem preencher o campo "<campo>"
    Então continuo na mesma tela
    E vejo a mensagem "Error: <campo> is required"

    Exemplos:
      | campo       |
      | First Name  |
      | Last Name   |
      | Postal Code |

Regra 2: O resumo mostra o subtotal, o imposto de 8% e o total

  Cenário: Resumo de um produto
    Dado que tenho apenas o produto "Sauce Labs Backpack" ($29.99) no carrinho
    Quando informo os dados de entrega e clico em "Continue"
    Então vejo "Item total: $29.99"
    E vejo "Tax: $2.40"
    E vejo "Total: $32.39"

Regra 3: Só é possível iniciar o checkout com pelo menos um item no carrinho

  Cenário: Carrinho vazio
    Dado que meu carrinho está vazio
    Quando abro o carrinho
    Então não consigo iniciar o checkout

Regra 4: Ao concluir, o pedido é confirmado e o carrinho fica vazio

  Cenário: Pedido concluído
    Dado que estou no resumo de um pedido com um produto
    Quando clico em "Finish"
    Então vejo a mensagem "Thank you for your order!"
    E o ícone do carrinho não mostra contador
```

### Fora de escopo
Pagamento, cálculo de frete, validação do formato do Postal Code e ordenação
dos produtos (vira a SD02).
