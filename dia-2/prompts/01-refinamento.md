# 1 · Refinamento de história

Para revisar uma história antes de escrever os testes. Material de apoio:
[dia-1/02-requisitos](../../dia-1/02-requisitos/).

**O que colar:** a sua história inteira do [backlog](../../sprint/backlog.md),
da narrativa aos critérios de aceite.

## Prompt

```text
Você é um QA experiente participando do refinamento de uma história, no papel
de "amigo do teste" da conversa dos três amigos.

Revise a história abaixo e avalie cada letra do INVEST com nota de 0 a 2
(0 = não atende, 1 = atende em parte, 2 = atende):
I - Independente: dá para entregar e testar sem esperar outra história?
N - Negociável: diz o que resolver e deixa o como em aberto?
V - Valiosa: fica claro quem ganha o quê?
E - Estimável: o time sabe o suficiente para dimensionar?
S - Pequena: é uma coisa só e cabe numa Sprint?
T - Testável: dá para escrever um caso de teste com resultado esperado claro?

Confira também o Gherkin dos critérios de aceite: o Dado traz o estado de
partida com dados concretos, o Quando é uma ação só e o Então é um resultado
que dá para observar. E compare a narrativa, a solução e os cenários entre si:
contam a mesma coisa? Os números batem?

Limites:
- Não invente regras de negócio. O que não estiver escrito vira pergunta para
  o PO.
- Para cada problema, cite entre aspas o trecho da história.
- Se a história estiver boa em algum critério, diga que está. Não force
  problema onde não há.

Responda neste formato:
1. Tabela: Letra | Nota | Justificativa. Depois o total, de 0 a 12.
2. Problemas encontrados: letra do INVEST · trecho · por que é problema.
3. O que falta: cenários de erro, valores limite, quem pode fazer a ação.
4. Perguntas objetivas para o PO, uma por linha.
5. Um cenário reescrito em Gherkin (# language: pt), corrigindo o problema
   mais grave.
6. Veredito em uma linha: pronta, pronta com ressalvas ou não entra na Sprint.

<historia>
<<cole aqui a sua história>>
</historia>
```

## Confira antes de usar

- [ ] Cada problema aponta um trecho que existe mesmo na história?
- [ ] A ambiguidade é real, ou a regra está escrita em outra parte da história?
- [ ] As perguntas para o PO são objetivas (dá para responder com uma regra)?
- [ ] O cenário reescrito usa só regras que estão no backlog?

## Para continuar a conversa

```text
Compare esta história com a que vou colar agora, do mesmo épico. Há regras que
se contradizem ou que dependem uma da outra?

<<cole a outra história>>
```

```text
Vou descrever o protótipo da tela desta história. Compare com o texto: o que a
tela mostra que a história não pede, e o que a história pede que a tela não
mostra?

<<descreva a tela ou anexe o print>>
```

```text
Para cada pergunta ao PO, diga qual teste eu não consigo escrever enquanto ela
não for respondida.
```
