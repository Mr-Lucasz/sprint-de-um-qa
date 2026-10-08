# Plano de teste

Base: CTFL v4.0.1, seção **5.2** (planejamento de teste).

Depois de analisar os requisitos e escrever os casos de teste, o QA decide
**como a entrega será validada**. O plano de teste organiza escopo, riscos,
abordagem, ambiente, dados, responsabilidades e critérios de entrada e saída.

Um plano de teste não precisa ser um documento enorme. Ele precisa deixar
claro o suficiente para que o time consiga executar o trabalho e tomar uma
decisão de qualidade.

## Como preencher

Parta dos casos de teste que você já escreveu. Um plano preenchido e comentado
está em [exemplo-plano-saucedemo.md](exemplo-plano-saucedemo.md).

1. Defina o objetivo e o que está dentro e fora do escopo.
2. Identifique os riscos mais importantes para o usuário e para o negócio.
3. Escolha a abordagem: funcional, API, exploratória, regressão ou outra.
4. Defina dados, ambiente, responsabilidades e evidências esperadas.
5. Compartilhe o plano com outra pessoa e ajuste os pontos que ficaram
   ambíguos.

## Template

```text
Plano:                                  Data:
História / versão:
Responsáveis:

Objetivo:

Escopo (o que será testado):
-

Fora de escopo:
-

Riscos e prioridades:
| Risco | Impacto | Probabilidade | Prioridade | Resposta |
|-------|---------|---------------|------------|----------|
|       |         |               |            |          |

Abordagem e tipos de teste:
-

Ambiente e configuração:
-

Dados e pré-condições:
-

Casos de teste relacionados:
-

Evidências esperadas:
-

Critérios de entrada:
-

Critérios de saída:
-

Bloqueios e dependências:
-
```

## O que discutir

- O que precisa estar pronto antes de começar?
- Qual risco merece teste primeiro?
- O que será evidência suficiente para aprovar ou rejeitar a história?
- Quais testes podem ser executados pela API e quais exigem a interface?
- O que deve ser repetido em uma regressão após uma correção?

> Um plano de teste é uma decisão baseada em risco, não uma lista de todos os
> testes possíveis.
