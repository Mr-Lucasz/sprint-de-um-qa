# 03 · Casos de teste e plano de teste

[Trilha](../../README.md#a-trilha) › [Dia 1](../README.md) › [Desafio](DESAFIO.md)

Base: CTFL v4.0.1, seções **1.4.3** (testware), **2.1.3** (BDD), **4.2** e **5.2**.

Os casos de teste deste repositório seguem a abordagem ágil de **Behavior-Driven
Development (BDD)**. O caso é um exemplo concreto do comportamento esperado,
escrito com a estrutura do Gherkin:

- **Dado (Given):** estado inicial e contexto, com dados concretos.
- **Quando (When):** uma ação ou evento do usuário.
- **Então (Then):** resultado observável e verificável.

BDD não é apenas trocar o nome dos campos. O cenário deve ser compreensível
para negócio, desenvolvimento e teste, e servir como critério de aceite e como
base para uma execução manual ou automatizada.

## O formato

Os casos ficam num CSV separado por ponto e vírgula, que abre no Excel, no
Google Planilhas ou no próprio VS Code:

| Coluna | O que vai nela |
|---|---|
| `id` | Identificador do caso (`CT-01`) |
| `historia` | A história testada |
| `regra` | A regra de negócio coberta: é a rastreabilidade |
| `tecnica` | A técnica usada (valor limite, particionamento, tabela de decisão, transição de estado) |
| `cenario` | Um título que diz a regra conferida |
| `dado`, `quando`, `entao` | O cenário BDD |
| `dados` | A massa de teste usada |
| `resultado_obtido`, `status` | Preenchidos só depois da execução |

## Exemplo resolvido · os casos da SD01 no Sauce Demo

A história é a [SD01 · Finalizar compra](../02-requisitos/exemplo-saucedemo.md),
na versão refinada. Os oito casos estão em
[exemplo-saucedemo.csv](exemplo-saucedemo.csv). Como eles nasceram:

| Regra da SD01 | Técnica | Casos | Raciocínio |
|---|---|---|---|
| 1 · Campos obrigatórios | Tabela de decisão | CT-01 a CT-03 | Uma coluna da tabela por campo vazio |
| 2 · Subtotal, imposto e total | Particionamento e valor limite | CT-04, CT-05 | Um produto (o caso comum) e os seis (o máximo que a loja permite) |
| 3 · Carrinho vazio | Valor limite | CT-06 | O limite inferior: zero itens |
| 4 · Pedido concluído | Transição de estado | CT-07, CT-08 | Resumo → concluído e resumo → cancelado |

Um deles, por extenso:

```gherkin
Cenário: Calcular o resumo de um produto
  Dado que estou logado como "standard_user" e tenho apenas o "Sauce Labs Backpack" no carrinho
  Quando informo os dados de entrega e clico em "Continue"
  Então vejo "Item total: $29.99", "Tax: $2.40" e "Total: $32.39"
```

### Um caso ruim e o mesmo caso consertado

| | Ruim | Bom |
|---|---|---|
| Título | Testar checkout | Recusar checkout sem First Name |
| Dado | que estou no site | que estou logado como "standard_user", tenho o "Sauce Labs Backpack" no carrinho e estou em "Checkout: Your Information" |
| Quando | preencho o formulário errado e clico em continuar e depois volto | clico em "Continue" com o First Name vazio |
| Então | o sistema valida corretamente | continuo na mesma tela e vejo "Error: First Name is required" |

O teste do caso ruim: entregue a outra pessoa e veja se ela executa sem te
perguntar nada. "Formulário errado" como? "Valida corretamente" como?

## Plano de teste

Os casos dizem **o que verificar**. O plano registra **como, onde, com quais
dados, riscos e critérios de saída** a validação será conduzida. O template e a
explicação de cada seção estão em [plano-de-teste.md](plano-de-teste.md).

O plano da SD01, preenchido e comentado, está em
[exemplo-plano-saucedemo.md](exemplo-plano-saucedemo.md). Repare que ele cabe
numa tela: um plano de teste é uma decisão baseada em risco, não uma lista de
todos os testes possíveis.

## Agora é com você

No [desafio desta fase](DESAFIO.md) você escreve os cenários e o plano da sua
história do Inscrevi.
