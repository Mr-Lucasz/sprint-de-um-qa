# Desafio 03 · Cenários e plano de teste da sua história

[Trilha](../../README.md#a-trilha) › [Dia 1](../README.md) › [Lição](README.md)

Lição desta fase: [Casos de teste e plano de teste](README.md).

O refinamento acabou e a sua história do Inscrevi entrou na Sprint. Antes de o
código chegar, você decide o que vai verificar e como.

## Material

- A sua história na versão refinada do [backlog](../../sprint/backlog.md).
  Todas as 16 histórias estão implementadas no sistema e podem ser testadas.
- O modelo [casos-de-teste.csv](casos-de-teste.csv). Os 3 primeiros casos são
  exemplos de formato: apague-os ou continue a numeração.
- O template do [plano de teste](plano-de-teste.md).

## Tarefas (40 min)

### Cenários (25 min)

1. Copie `casos-de-teste.csv` para `minha-sprint/casos-de-teste.csv` e escreva
   **pelo menos 5 cenários** da sua história.
2. Para cada cenário, use uma única ação em `quando` e um resultado observável
   em `entao`.
3. Inclua exemplos positivos, negativos e valores de fronteira quando a regra
   exigir.
4. Indique na coluna `tecnica` a técnica usada em cada cenário (valor limite,
   particionamento, tabela de decisão ou transição de estado, vistas em
   [02 · Requisitos](../02-requisitos/)).
5. Deixe `resultado_obtido` e `status` em branco: a execução é o desafio da
   [fase 04](../04-execucao-de-testes/).

### Plano (15 min)

6. Copie o template para `minha-sprint/plano-de-teste.md` e preencha para a sua
   história:
   - objetivo, escopo e fora de escopo;
   - riscos priorizados;
   - abordagem e tipos de teste;
   - ambiente, dados, dependências e evidências;
   - critérios de entrada e saída.

## O que você entrega

`minha-sprint/casos-de-teste.csv` e `minha-sprint/plano-de-teste.md`.

## Confira antes de seguir

- [ ] Toda regra da história tem pelo menos um cenário?
- [ ] Há pelo menos um cenário negativo e um de valor limite?
- [ ] Cada `entao` cita a mensagem, o status ou o estado exato que a história
      define, sem "corretamente" ou "com sucesso"?
- [ ] Os dados são concretos (qual e-mail, qual curso, quantos caracteres)?
- [ ] O plano diz qual risco você testa primeiro e por quê?
- [ ] O plano diz o que precisa acontecer para a história ser aprovada?

**O teste final:** entregue os cenários a outra pessoa (ou releia amanhã) e
veja se dá para executar sem perguntar nada a quem escreveu. Se não der, o
`Dado`, o `Quando` ou o `Então` precisa de ajuste.

Próxima fase: [04 · Execução de testes](../04-execucao-de-testes/).
