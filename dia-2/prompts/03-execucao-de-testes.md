# 3 · Execução de testes

Para preparar a execução manual, ter ideias na sessão exploratória e decidir o
status de um caso. Roteiro da aula:
[01-execucao-e-defeitos](../01-execucao-e-defeitos/).

Uma IA de chat não vê a sua tela: quem executa é você. Ela ajuda antes
(roteiro e massa) e depois (interpretar o que você observou).

## Prompt A · Roteiro de execução

**O que colar:** a sua história e os seus casos de teste.

```text
Você é um QA experiente me ajudando a preparar a execução manual dos casos de
teste abaixo, na interface do Inscrevi.

Monte um roteiro de execução:
1. Ordene os casos pelo risco, do que mais prejudica a pessoa usuária ao que
   menos prejudica, e explique a ordem em uma frase por caso.
2. Agrupe os casos que compartilham a mesma pré-condição, para eu montá-la uma
   vez só.
3. Para cada caso, diga: o que preparar antes, como conferir que a
   pré-condição vale no momento do teste (o ambiente é compartilhado) e qual
   evidência guardar (print, e na aba Network o método, a rota, o status e o
   corpo da resposta).
4. Liste a massa de dados que preciso criar: contas e minicursos, com dados de
   exemplo que não colidam com os de outras pessoas.

Limites: não altere o resultado esperado dos meus casos e não acrescente
regras que não estão na história. Se um caso estiver ambíguo demais para
executar, diga qual e por quê.

<historia>
<<cole aqui a sua história>>
</historia>

<casos>
<<cole aqui os seus casos de teste>>
</casos>
```

## Prompt B · Ideias para a sessão exploratória

**O que colar:** a sua história e o charter dela, da
[tabela do dia 1](../../dia-1/04-execucao-de-testes/02-funcional/#charters).

```text
Vou fazer uma sessão de teste exploratório de <<10>> minutos com o charter
abaixo. Liste até 15 ideias de teste que vão além dos casos roteirizados,
usando suposição de erro: pense nos enganos que quem programou poderia ter
cometido.

Considere: valores nas bordas e logo depois delas; campos vazios, só com
espaços, com acentos e emojis; a mesma ação duas vezes seguidas; o botão
Voltar e o endereço digitado à mão; a mesma operação com outra conta ou sem
login; e a mesma operação feita direto na API.

Para cada ideia: o que fazer, o que observar e qual regra da história ela põe à
prova. Ordene da mais promissora para a menos.

<charter>
<<cole aqui o charter>>
</charter>

<historia>
<<cole aqui a sua história>>
</historia>
```

## Prompt C · Passou, falhou ou bloqueado?

**O que colar:** o caso de teste e o que você observou, sem interpretar.

```text
Executei o caso de teste abaixo e anotei o que aconteceu. Me ajude a decidir o
status, sem alterar os fatos que descrevi.

- Passou: o obtido é igual ao esperado.
- Falhou: o obtido é diferente do esperado.
- Bloqueado: não foi possível executar (pré-condição impossível, ambiente fora
  do ar, outro defeito no caminho).

Responda:
1. O status e a justificativa, comparando o esperado com o obtido.
2. Isso parece falha do produto, do ambiente compartilhado ou do meu caso de
   teste? O que eu devo conferir para ter certeza?
3. O que falta na minha anotação para outra pessoa conseguir reproduzir.

<caso>
<<cole o caso de teste>>
</caso>

<observado>
<<o que você fez, com os dados usados, e o que viu: mensagem na tela, status
HTTP, corpo da resposta>>
</observado>
```

## Confira antes de usar

- [ ] A ordem de execução reflete o risco da **sua** história?
- [ ] As ideias exploratórias testam regras que existem no backlog?
- [ ] O status foi decidido pelo que você viu, e não pelo que a IA supôs?
- [ ] Você conferiu a pré-condição antes de marcar **Falhou**?

## Para continuar a conversa

```text
Resuma a minha execução em uma tabela: total de casos, quantos passaram,
falharam e ficaram bloqueados, e a lista dos que falharam com o motivo.

<<cole o CSV com resultado_obtido e status preenchidos>>
```
