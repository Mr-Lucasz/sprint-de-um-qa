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

## Prática da Parte 1 · QA de plantão no refinamento (30 min, individual)

O PO trouxe 16 histórias para o refinamento. **Nenhuma está pronta**: todas chegaram como rascunho e têm problemas. Você é o "amigo do teste" na conversa dos três amigos, e a sua história só entra na Sprint depois que passar por você.

**Cada pessoa escolhe uma história, e cada história pode ter no máximo duas pessoas.** O trabalho é individual: quem dividir a história com alguém faz a própria ficha e compara os achados no final. A história que você escolher agora acompanha você nas próximas dinâmicas (casos de teste, plano de teste e execução).

As histórias estão no [backlog](../../sprint/backlog.md) e no [quadro da Sprint](https://github.com/users/Mr-Lucasz/projects/4), na coluna **Em refinamento**, agrupadas por épico.

Cada história tem também um **protótipo de tela**, feito pelo time de design a partir do mesmo rascunho: [protótipos do Inscrevi](https://claude.ai/artifact/EppH87VQmyfY2aCtzQXuov). Cada tela leva no título o número da história. Protótipo também é artefato de teste: revisá-lo é teste estático, do mesmo jeito que revisar a história.

**Tarefas**

1. Escolha a sua história no quadro e comente "é minha" na issue, para a turma ver quais já têm duas pessoas.
2. Leia a história inteira: narrativa de negócio, problemática, solução, história e critérios de aceite.
3. Preencha a **ficha INVEST** abaixo, dando uma nota de 0 a 2 para cada letra.
4. Liste **todos os problemas** que encontrar e as **perguntas para o PO**. Para cada problema, indique a letra do INVEST e o trecho da história.
5. Abra o **protótipo** da história e compare com o texto: a tela mostra o que a história pede? Mostra algo que a história não pede? Os números, nomes e mensagens batem entre si?
6. Reescreva **um cenário** corrigido em Gherkin.
7. Publique a ficha como **comentário na issue** da história.

**Dicas para o protótipo:** contadores que não batem com a lista; nome de pessoa ou de minicurso diferente entre partes da tela; botão habilitado quando a regra proíbe; campo sem rótulo; ação destrutiva em destaque ou sem confirmação; informação que a história pede e a tela não mostra.

**Dicas para caçar problemas na história:** palavras vagas (*rapidamente*, *razoável*, *adequadamente*, *automaticamente*); números que mudam entre a solução e os cenários; o que acontece quando dá errado; quem pode fazer a ação; conflito com as regras de outra história.

### Ficha INVEST

```
História:                                Nome:

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

Protótipo (o que a tela mostra · o que a história diz · por que é problema):
1.
2.

Perguntas para o PO:
-

Cenário reescrito:
```

**Socialização (10 min):** algumas pessoas apresentam o que encontraram; onde duas pessoas pegaram a mesma história, elas comparam as fichas. Ao final, o PO publica a versão fechada no refinamento das 16 histórias, que passa a ser a referência para os casos de teste, o plano de teste e a execução.

---

## Técnicas de teste caixa-preta (CTFL 4.2)

> Esta seção abre a **Parte 2** da noite, depois do intervalo e com o backlog refinado já publicado.

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

## Aplicando as técnicas

As técnicas acima são usadas na prática da Parte 2, em [03 · Casos de teste e plano de teste](../03-casos-de-teste/): é lá que você escreve os cenários da sua história, indicando a técnica usada em cada um.
