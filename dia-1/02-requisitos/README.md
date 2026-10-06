# 02 · Análise de requisitos e técnicas de teste

Base: CTFL v4.0.1, seções **3.2** (revisões), **4.2** (técnicas caixa-preta) e **4.5** (abordagens colaborativas).

## Testar começa antes do código

Revisar uma história é **teste estático** (CTFL 3.1). Um requisito ambíguo vira defeito no código; uma pergunta no refinamento é o defeito mais barato que existe.

Critérios de aceite podem ser escritos como **regras** (lista) ou como **cenários** (Dado/Quando/Então) (CTFL 4.5.2). No backlog do Inscrevi eles estão em cenários Gherkin.

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

## Exercício 1 · QA de plantão no refinamento (25 min, em duplas)

O PO trouxe 16 histórias para o refinamento. **Nenhuma está pronta**: todas chegaram como rascunho e têm problemas. Vocês são o "amigo do teste" na conversa dos três amigos, e a história da sua dupla só entra na Sprint depois que passar por vocês.

As histórias estão no [backlog](../../sprint/backlog.md) e no [quadro da Sprint](https://github.com/users/Mr-Lucasz/projects/4), na coluna **Em refinamento**, agrupadas por épico.

**Tarefas**

1. Leiam a história da dupla inteira: narrativa de negócio, problemática, solução, história e critérios de aceite.
2. Preencham a **ficha INVEST** abaixo, dando uma nota de 0 a 2 para cada letra.
3. Listem **todos os problemas** que encontrarem e as **perguntas para o PO**. Para cada problema, indiquem a letra do INVEST e o trecho da história.
4. Reescrevam **um cenário** corrigido em Gherkin.
5. Publiquem a ficha como **comentário na issue** da história.

**Dicas para caçar problemas:** palavras vagas (*rapidamente*, *razoável*, *adequadamente*, *automaticamente*); números que mudam entre a solução e os cenários; o que acontece quando dá errado; quem pode fazer a ação; conflito com as regras de outra história.

### Ficha INVEST

```
História:                                Dupla:

Nota: 0 = não atende · 1 = atende em parte · 2 = atende

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
2.
3.

Perguntas para o PO:
-

Cenário reescrito:
```

**Socialização (10 min):** algumas duplas apresentam o que encontraram. Ao final, o PO publica a versão fechada no refinamento, que passa a ser a referência para os casos de teste do resto do curso.

---

## Técnicas de teste caixa-preta (CTFL 4.2)

### Particionamento de equivalência (4.2.1)

Divida as entradas em grupos que o sistema deve tratar **da mesma forma**. Testar um valor de cada partição cobre o grupo.

Senha (US01, de 8 a 64 caracteres):

| Partição | Exemplo | Esperado |
|---|---|---|
| Curta demais (0 a 7) | `abc` | Recusar |
| Válida (8 a 64) | `Senha@1234` | Aceitar |
| Longa demais (65 ou mais) | 70 caracteres | Recusar |

### Análise de valor limite (4.2.2)

Defeitos se escondem nas **bordas** das partições. Na análise de 2 valores, testamos o limite e o vizinho da partição ao lado; na de 3 valores, o limite e os dois vizinhos.

Senha com 2 valores: **7, 8, 64 e 65**.
Vagas de um curso com 2 vagas: a **2ª** inscrição é aceita, a **3ª** é recusada.

### Tabela de decisão (4.2.3)

Útil quando várias condições se combinam. Regras de inscrição (US04):

| Condição | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|
| Está logado? | N | S | S | S | S |
| Já inscrito no curso? | – | S | N | N | N |
| Curso tem vaga? | – | – | N | S | S |
| Conflito de horário? | – | – | – | S | N |
| **Resultado** | **401** | **409 duplicada** | **409 sem vagas** | **409 conflito** | **201** |

### Transição de estado (4.2.4)

Uma vaga passa por estados: **livre → ocupada → livre** (após cancelamento). Cada transição é um caso de teste, inclusive as **inválidas**, como cancelar algo que já foi cancelado.

---

## Exercício 2 · Aplicando as técnicas (15 min)

Com a versão **refinada** do backlog em mãos, escolha **uma** das histórias US01, US04 ou US06 e, em [../03-casos-de-teste/casos-de-teste.csv](../03-casos-de-teste/casos-de-teste.csv), escreva pelo menos **5 casos de teste**, indicando a técnica usada em cada um.
