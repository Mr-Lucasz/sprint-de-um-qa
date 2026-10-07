# Prompts de QA para a aula

Prompts prontos para usar com qualquer IA de chat (Claude, ChatGPT, Gemini,
Copilot) nas práticas de hoje. Cada arquivo traz o prompt, o que colar nele e o
que conferir na resposta antes de usar.

| # | Quando usar | Prompt | Parte da aula |
|---|---|---|---|
| 1 | Revisar uma história antes de testar | [01-refinamento.md](01-refinamento.md) | Recapitulação do dia 1 |
| 2 | Gerar casos de teste e plano de teste | [02-plano-de-teste.md](02-plano-de-teste.md) | Recapitulação do dia 1 |
| 3 | Preparar e conduzir a execução manual | [03-execucao-de-testes.md](03-execucao-de-testes.md) | Parte 1 |
| 4 | Escrever ou revisar um bug | [04-reporte-de-bug.md](04-reporte-de-bug.md) | Parte 1 |
| 5 | Testar a API com o Postman | [05-testes-de-api.md](05-testes-de-api.md) | Parte 2 |
| 6 | Automatizar um cenário no Cypress | [06-automacao-cypress.md](06-automacao-cypress.md) | Parte 3 |
| 7 | Revisar o código de um teste automatizado | [07-review-de-automacao.md](07-review-de-automacao.md) | Parte 3 |
| 8 | Calcular métricas e decidir se a história está pronta | [08-metricas-e-kpis.md](08-metricas-e-kpis.md) | Encerramento |

## Como usar

1. Abra o arquivo do prompt e copie o bloco inteiro.
2. Troque tudo que está entre `<< >>` pelo seu conteúdo: a sua história do
   [backlog](../../sprint/backlog.md), os seus casos de teste, o seu código.
3. Leia a resposta com o checklist **Confira antes de usar** do próprio arquivo.
4. Se a resposta vier fraca, use os prompts de **Para continuar a conversa** em
   vez de recomeçar.

Comece a conversa colando o contexto abaixo. Ele evita que a IA trate o
Inscrevi como um sistema genérico:

```text
Contexto: sou QA numa Sprint do Inscrevi, um sistema de inscrição em minicursos
de eventos acadêmicos. O ambiente de teste é https://inscrevi.vercel.app, a API
fica em /api e a documentação em /docs. O ambiente é compartilhado com outras
pessoas, então cada teste precisa criar os próprios dados. As regras do sistema
são as que estão na história que vou colar: não invente regras, mensagens ou
status que não estejam nela. Quando faltar informação, pergunte ou liste como
dúvida para o PO. Responda em português.
```

## Três regras

**A IA sugere, você decide.** Trate a resposta como o trabalho de um colega
júnior muito rápido: ela inventa regras, mensagens de erro e seletores com a
mesma segurança com que acerta. O que vale é o backlog e o que você observou no
sistema.

**Não cole dado sigiloso.** Nada de senha real, token, dado pessoal ou código de
cliente. As contas de exemplo do Inscrevi podem ser usadas porque são públicas.

**Não peça para o teste passar.** Se o seu teste automatizado ficou vermelho
porque o Inscrevi tem um defeito, ele está certo. Pedir à IA para "fazer
passar" troca um teste útil por um que não confere nada.

## Como escrever um bom prompt

Os prompts desta pasta seguem a mesma estrutura, que serve para qualquer outro
que você escrever:

| Parte | O que dizer | Exemplo |
|---|---|---|
| Papel e contexto | Quem responde e sobre qual sistema | "Você é um QA num refinamento do Inscrevi" |
| Tarefa | O que fazer, com o critério | "Avalie a história com o INVEST, nota de 0 a 2" |
| Material | O insumo, colado e delimitado | A história entre `<historia>` e `</historia>` |
| Limites | O que não fazer | "Não invente regras; o que faltar vira pergunta" |
| Formato | Como a resposta deve vir | "Devolva em CSV com estas colunas" |

## Usando com o Claude Code

Quem usa o Claude Code dentro deste repositório não precisa copiar os prompts:
as mesmas tarefas estão em [`.claude/skills`](../../.claude/skills/) e leem o
backlog, os modelos e o código direto dos arquivos.

| Skill | Exemplo de pedido |
|---|---|
| `qa-refinamento` | "Refina a US04" |
| `qa-plano-de-teste` | "Gera os casos e o plano de teste da US06" |
| `qa-execucao` | "Executa os meus casos da US04 na homologação" |
| `qa-bug` | "Abre um bug: a inscrição passou com o curso sem vagas" |
| `qa-api` | "Cria os testes de API da US06 para o Postman" |
| `qa-automacao` | "Automatiza o CT-03 em Cypress" |
| `qa-review-automacao` | "Revisa o meu us04-inscricao.cy.js" |
| `qa-metricas` | "Gera as métricas da US04 e diz se ela está pronta" |

Também dá para chamar pelo nome, digitando `/qa-refinamento US04`.
