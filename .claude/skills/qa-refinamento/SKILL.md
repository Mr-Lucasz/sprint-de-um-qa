---
name: qa-refinamento
description: Revisa uma história de usuário como QA no refinamento, usando INVEST e a qualidade do Gherkin, e devolve a ficha preenchida com problemas, perguntas para o PO e um cenário reescrito. Use quando pedirem para refinar, revisar ou analisar uma história (ex.: "refina a US04", "essa história está pronta para a Sprint?", "acha ambiguidades na US07"), mesmo sem citar INVEST.
---

# Refinamento de história (teste estático)

Revisar uma história é teste estático (CTFL v4.0.1, 3.1 e 4.5). O objetivo é
achar o defeito enquanto ele ainda é uma pergunta.

## Entrada

- A história: um identificador (`US01` a `US16`) ou o texto colado.
- Se for um identificador, leia a seção `## USxx` de `sprint/backlog.md`. Se o
  pedido não disser qual história, pergunte.
- Opcional: descrição ou print do protótipo da tela.

## Como revisar

1. Leia a história inteira: narrativa, problemática, solução, história e
   critérios de aceite. Leia também as histórias do mesmo épico, para achar
   conflito entre regras.
2. Dê nota de 0 a 2 para cada letra do INVEST (0 não atende, 1 em parte,
   2 atende), sempre com o trecho que justifica a nota.

   | Letra | Pergunta | Sinais de problema |
   |---|---|---|
   | I | Dá para entregar e testar sem esperar outra história? | Depende de algo que não existe |
   | N | Diz o que resolver e deixa o como em aberto? | Cor de botão, nome de tabela, biblioteca |
   | V | Quem ganha o quê? | "Para" que só interessa ao sistema |
   | E | O time sabe o suficiente para dimensionar? | Regra faltando, cenário negativo ausente |
   | S | Cabe numa Sprint e é uma coisa só? | "E também...", várias funcionalidades |
   | T | Dá para escrever um caso com resultado esperado claro? | "Rapidamente", "adequado", `Então` sem resultado observável |

3. Confira o Gherkin: o `Dado` traz estado de partida com dados concretos, o
   `Quando` é uma ação só e o `Então` é observável.
4. Compare as partes entre si: narrativa, solução e cenários contam a mesma
   coisa? Os números batem?
5. Procure o que falta: o que acontece quando dá errado, quem pode fazer a
   ação, valores nas bordas, mensagens de erro, status HTTP.
6. Se houver protótipo, compare com o texto: a tela mostra o que a história
   pede e só isso?

## Regras

- Não invente regra de negócio. O que não está escrito vira **pergunta para o
  PO**, nunca suposição apresentada como fato.
- Todo problema cita o trecho da história entre aspas.
- Só aponte o que é problema de verdade. Se a história está boa numa letra,
  diga que está.

## Saída

Use exatamente a ficha de `dia-1/02-requisitos/README.md`:

```
História:

| Letra | Nota | Justificativa |
|-------|------|---------------|
| I     |      |               |
| N     |      |               |
| V     |      |               |
| E     |      |               |
| S     |      |               |
| T     |      |               |
Total:    / 12

Problemas encontrados (letra do INVEST · trecho · por que é problema):
1.

Protótipo (o que a tela mostra · o que a história diz · por que é problema):
1.

Perguntas para o PO:
-

Cenário reescrito:
```

Feche com uma linha de veredito: **pronta**, **pronta com ressalvas** ou
**não entra na Sprint**, e o motivo principal.
