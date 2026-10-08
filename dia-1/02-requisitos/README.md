# 02 · Análise de requisitos e técnicas de teste

[Trilha](../../README.md#a-trilha) › [Dia 1](../README.md) › [Desafio](DESAFIO.md)

Base: CTFL v4.0.1, seções **3.2** (revisões), **4.2** (técnicas caixa-preta) e **4.5** (abordagens colaborativas).

## Testar começa antes do código

Revisar uma história é **teste estático** (CTFL 3.1). Um requisito ambíguo vira defeito no código; uma pergunta no refinamento é o defeito mais barato que existe.

Critérios de aceite podem ser escritos como **regras** (lista) ou como **cenários** (Dado/Quando/Então) (CTFL 4.5.2). Nos exemplos e no backlog deste repositório eles estão em cenários Gherkin.

## INVEST: a régua do refinamento

Uma história está pronta para entrar na Sprint quando passa nos seis critérios:

| Letra | Critério | Pergunta que o QA faz | Sinais de problema |
|---|---|---|---|
| **I** | Independente | Dá para entregar e testar esta história sem esperar outra? | Cita funcionalidade de outra história; depende de algo que não existe |
| **N** | Negociável | A história diz **o que** resolver e deixa o **como** em aberto? | Cor de botão, nome de tabela, biblioteca, tamanho em pixels |
| **V** | Valiosa | Quem ganha o quê com isso? | "Para" que só interessa ao sistema; persona que não é quem usa |
| **E** | Estimável | O time sabe o suficiente para dimensionar? | Regra faltando; "nome válido" sem dizer o que é válido; cenário negativo ausente |
| **S** | Pequena (Small) | Cabe numa Sprint? É uma coisa só? | "E também...", várias funcionalidades na mesma história |
| **T** | Testável | Consigo escrever um caso de teste com resultado esperado claro? | "Rapidamente", "adequadamente", "razoável"; cenário que contradiz a regra; `Então` sem resultado observável |

Além do INVEST, confira o **Gherkin**: o `Dado` descreve o estado de partida com dados concretos, o `Quando` é uma ação só, e o `Então` é algo que dá para observar. E compare as partes da história entre si: a narrativa, a solução e os cenários contam a mesma coisa?

---

## Exemplo resolvido · refinando uma história do Sauce Demo

O [Sauce Demo](https://www.saucedemo.com) não tem backlog público, então as
lições usam uma história escrita para ele: a **SD01 · Finalizar compra**. O
rascunho, a ficha preenchida e a versão refinada estão em
[exemplo-saucedemo.md](exemplo-saucedemo.md).

Leia o rascunho com a loja aberta ao lado (`standard_user` / `secret_sauce`) e
tente achar os problemas antes de olhar a ficha. O raciocínio, trecho a trecho:

| Trecho do rascunho | Letra | Por que é problema | Pergunta para o PO |
|---|---|---|---|
| "finalizo a compra **rapidamente**" | T | Não dá para medir "rapidamente" | Existe um tempo máximo? Se não, tirar a palavra |
| "o pedido deve ser processado **adequadamente**" | T | O `Então` não diz o que a pessoa vê | Qual mensagem e qual tela confirmam o pedido? |
| "informo um **nome válido**" | E | Não há regra para o que é válido, nem cenário para campo vazio | Quais campos são obrigatórios? Qual a mensagem de cada um? |
| "o botão Continue deve ser **verde com 16px**" | N | Detalhe de implementação visual dentro do critério de aceite | Isso é regra de negócio ou cabe ao design? |
| "vejo o total **com o imposto**" | E | Não diz de quanto é o imposto nem como arredonda | Qual a alíquota? Como arredonda? |
| "**E também** quero ordenar os produtos por preço" | S, I | Outra funcionalidade, de outra tela, na mesma história | Podemos separar em outra história? |
| Nenhum cenário com o carrinho vazio | E | Falta o cenário negativo mais óbvio | Dá para iniciar o checkout sem nenhum item? |
| "**Quando** adiciono produtos **e** finalizo a compra" | Gherkin | Duas ações num `Quando` só | Separar: adicionar é pré-condição (`Dado`) |

Um cenário reescrito fica assim:

```gherkin
Cenário: Campo obrigatório vazio no checkout
  Dado que estou logado e tenho o produto "Sauce Labs Backpack" no carrinho
  E estou na tela "Checkout: Your Information"
  Quando clico em "Continue" sem preencher o campo "First Name"
  Então continuo na mesma tela
  E vejo a mensagem "Error: First Name is required"
```

Repare no que mudou: o `Dado` tem dados concretos, o `Quando` é uma ação só e o
`Então` é algo que qualquer pessoa confere olhando para a tela.

---

## Técnicas de teste caixa-preta (CTFL 4.2)

Com a história refinada, as técnicas ajudam a escolher **poucos testes que
cobrem muito**. Os exemplos usam o Sauce Demo e a SD01.

### Particionamento de equivalência (4.2.1)

Divida as entradas em grupos que o sistema deve tratar **da mesma forma**. Testar um valor de cada partição cobre o grupo.

Usuário na tela de login:

| Partição | Exemplo | Esperado |
|---|---|---|
| Conta ativa | `standard_user` | Entra e vê a lista de produtos |
| Conta bloqueada | `locked_out_user` | Recusa: "Sorry, this user has been locked out." |
| Conta inexistente | `fulano` | Recusa: "Username and password do not match any user in this service" |
| Campo vazio | (nada) | Recusa: "Username is required" |

Quatro testes cobrem o login. Testar dez contas inexistentes diferentes não
acrescenta nada: elas estão na mesma partição.

### Análise de valor limite (4.2.2)

Defeitos se escondem nas **bordas** das partições. Na análise de 2 valores, testamos o limite e o vizinho da partição ao lado; na de 3 valores, o limite e os dois vizinhos.

Itens no carrinho (a loja tem 6 produtos, um de cada):

| Partição | Valores | Limites a testar | Esperado |
|---|---|---|---|
| Carrinho vazio | 0 | **0** | Sem contador no ícone; checkout não inicia (SD01, regra 3) |
| Carrinho com itens | 1 a 6 | **1** e **6** | Contador mostra a quantidade; checkout disponível |

O imposto da SD01 (8% do subtotal, com 2 casas) também tem bordas: escolha
produtos cujo imposto caia perto de meio centavo e confira o arredondamento. Um
produto de $29.99 dá $2.3992, que vira **$2.40**.

### Tabela de decisão (4.2.3)

Útil quando várias condições se combinam. Checkout da SD01:

| Condição | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|
| Carrinho tem item? | N | S | S | S | S |
| First Name preenchido? | – | N | S | S | S |
| Last Name preenchido? | – | – | N | S | S |
| Postal Code preenchido? | – | – | – | N | S |
| **Resultado** | **Checkout não inicia** | **First Name is required** | **Last Name is required** | **Postal Code is required** | **Segue para o resumo** |

Cada coluna vira um caso de teste. O traço quer dizer "tanto faz": a decisão já
foi tomada por uma condição anterior.

### Transição de estado (4.2.4)

O botão de um produto tem dois estados: **Add to cart ⇄ Remove**. O pedido
passa por **carrinho → dados → resumo → concluído**. Cada transição é um caso
de teste, inclusive as **inválidas**: abrir o endereço do resumo direto, sem
passar pelos dados, ou voltar com o botão do navegador depois de concluir.

---

## Agora é com você

No [desafio desta fase](DESAFIO.md) você faz o papel de QA no refinamento de
uma história do Inscrevi. As técnicas voltam na fase seguinte,
[03 · Casos de teste e plano de teste](../03-casos-de-teste/).
