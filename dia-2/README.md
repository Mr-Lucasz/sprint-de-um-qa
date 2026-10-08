# Dia 2 · Execução com IA, API e automação

No dia 1 você analisou uma história, escreveu os cenários, executou à mão e
relatou defeitos. Agora o mesmo trabalho ganha apoio de IA, vira script de API
e, por fim, roda sozinho.

Cada fase tem duas partes:

- **Aprenda** (o `README.md` da fase): a lição com um exemplo resolvido.
- **Desafio** (o `DESAFIO.md` da fase): você aplica na **mesma história** do
  Inscrevi que escolheu no dia 1. Tenha à mão o seu arquivo de casos de teste:
  ele é a entrada das três fases.

| Fase | Aprenda | Desafio (Inscrevi) | Você entrega |
|---|---|---|---|
| 01 | [Execução e reporte de bugs com IA](01-execucao-e-defeitos/), no Sauce Demo | [Executar e reportar](01-execucao-e-defeitos/DESAFIO.md) | Casos com status e bugs registrados |
| 02 | [Scripts de teste no Postman](02-postman/), com a coleção pronta do Inscrevi | [A coleção da sua história](02-postman/DESAFIO.md) | Requisições com scripts de teste |
| 03 | [Cypress do zero](03-cypress/), no Sauce Demo, com Cucumber, Git e pipeline | [Automatizar a sua história](03-cypress/DESAFIO.md) | Um `.cy.js` ou `.feature` com os seus cenários |

A fase 02 é a exceção ao Sauce Demo: a loja não tem API pública.

## Antes de começar

```bash
git pull
npm install
```

Os desafios rodam no Inscrevi local (`npm start`, em http://localhost:3000) ou
na homologação, em https://inscrevi.vercel.app, que é compartilhada. Para o
Cypress, a instalação é separada e está no [README da fase 03](03-cypress/).

A pasta `app/` está liberada a partir de hoje.

## Como as três fases se ligam

```
caso de teste (dia 1)
   ├── Fase 01  executo à mão        → passou, falhou ou bloqueado → bug
   ├── Fase 02  executo pela API     → a regra vale sem a tela?
   └── Fase 03  automatizo           → o teste passa a rodar sozinho
```

Um cenário que falhou à mão continua falhando depois de automatizado. Isso é o
esperado: o teste automatizado passa a vigiar o defeito até ele ser corrigido.

## Prompts de IA

A pasta [prompts](prompts/) traz um prompt pronto para cada etapa:
refinamento, plano de teste, execução, reporte de bug, testes de API,
automação, review de código de teste e métricas. Funcionam em qualquer IA de
chat; quem usa o Claude Code tem as mesmas tarefas como skills em
[`.claude/skills`](../.claude/skills/).

## Material extra

Para continuar estudando depois dos desafios:

| Módulo | Assunto |
|---|---|
| [extras/01-git-para-qa](extras/01-git-para-qa/) | Branch, commit e pull request para testes |
| [extras/02-playwright](extras/02-playwright/) | Os mesmos cenários em Playwright, com testes de API e de interface |
| [extras/03-ia](extras/03-ia/) | Prompts para cenários e massa de teste |
| [extras/04-bdd-cucumber](extras/04-bdd-cucumber/) | Cucumber sem navegador, direto na API |
| [extras/05-ci-cd](extras/05-ci-cd/) | Pipeline com GitHub Actions |
