# 02 · Análise de requisitos e técnicas de teste

Base: CTFL v4.0.1, seções **3.2** (revisões), **4.2** (técnicas caixa-preta) e **4.5** (abordagens colaborativas).

## Testar começa antes do código

Revisar uma história é **teste estático** (CTFL 3.1). Um requisito ambíguo vira defeito no código; uma pergunta no refinamento é o defeito mais barato que existe.

Uma boa história segue o **INVEST**: Independente, Negociável, Valiosa, Estimável, Pequena (Small) e Testável. Critérios de aceite podem ser escritos como **regras** (lista) ou como **cenários** (Dado/Quando/Então) (CTFL 4.5.2).

---

## Exercício 1 · Refinando a US07 (20 min, em grupos de 3 ou 4)

O PO trouxe esta história para o refinamento. Vocês são o "amigo do teste" na conversa dos três amigos.

> **US07 · Lista de espera (rascunho)**
>
> **Como** estudante
> **Quero** entrar numa lista de espera quando o curso estiver lotado
> **Para** não perder a chance de participar
>
> **Critérios de aceite**
> 1. Quando o curso estiver cheio, aparece o botão "Entrar na lista de espera".
> 2. Quando alguém cancelar, a próxima pessoa da fila é inscrita automaticamente.
> 3. O aluno é avisado rapidamente quando conseguir a vaga.
> 4. A lista de espera tem um limite razoável de pessoas.
> 5. O sistema não deve deixar a pessoa entrar duas vezes.

**Tarefas**

1. Liste **todas as perguntas** que vocês fariam ao PO. Procure ambiguidades, palavras vagas, regras que faltam e conflitos com as histórias US04 a US06.
2. Reescreva os critérios que puderem tornando-os **testáveis**.
3. Escreva **2 cenários em Gherkin** para a regra 2.

**Dicas para caçar ambiguidade:** palavras como *rapidamente*, *razoável*, *automaticamente*; o que acontece com conflito de horário; quem é "a próxima pessoa"; como a pessoa é avisada; o que "duas vezes" significa (duas vezes na fila? na fila e inscrita?).

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

Escolha **uma** das histórias US01, US04 ou US06 e, em [../03-casos-de-teste/casos-de-teste.csv](../03-casos-de-teste/casos-de-teste.csv), escreva pelo menos **5 casos de teste**, indicando a técnica usada em cada um.
