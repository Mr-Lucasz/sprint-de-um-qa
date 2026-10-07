# Dia 2 · Execução, API e automação

Ontem você analisou uma história, escreveu os cenários e montou o plano de
teste. Hoje o plano vira execução: primeiro à mão, depois pela API e por fim
automatizado.

Você continua com **a mesma história** do dia 1. Tenha à mão o seu arquivo de
casos de teste: ele é a entrada das três partes.

| Parte | O que você faz | O que você entrega | Material |
|---|---|---|---|
| 1 | Executa os cenários pela tela e relata o que falhou | Casos com status e bugs registrados | [01-execucao-e-defeitos](01-execucao-e-defeitos/) |
| 2 | Testa a API da sua história com o Postman | Requisições com scripts de teste | [02-postman](02-postman/) |
| 3 | Acompanha o live coding de um projeto Cypress do zero (Sauce Demo, API e Cucumber) e depois automatiza, sozinho, os seus cenários no Inscrevi | Um arquivo `.cy.js` ou `.feature` com os seus cenários | [03-cypress](03-cypress/) |

## Antes de começar

```bash
git pull
npm install
```

As três partes usam a homologação do Inscrevi, em https://inscrevi.vercel.app,
compartilhada com a turma. Não é preciso subir o app na sua máquina; se quiser
um ambiente só seu, `npm start` sobe uma cópia em http://localhost:3000. Para o
Cypress, a instalação é separada e está no [README da Parte 3](03-cypress/).

A pasta `app/` está liberada a partir de hoje.

## Como as três partes se ligam

```
caso de teste (dia 1)
   ├── Parte 1  executo à mão        → passou, falhou ou bloqueado → bug
   ├── Parte 2  executo pela API     → a regra vale sem a tela?
   └── Parte 3  automatizo           → o teste passa a rodar sozinho
```

Um cenário que falhou à mão continua falhando depois de automatizado. Isso é o
esperado: o teste automatizado passa a vigiar o defeito até ele ser corrigido.

## Material extra

Os módulos abaixo não entram na aula, mas estão prontos para quem quiser
continuar estudando:

| Módulo | Assunto |
|---|---|
| [extras/01-git-para-qa](extras/01-git-para-qa/) | Branch, commit e pull request para testes |
| [extras/02-playwright](extras/02-playwright/) | Os mesmos cenários em Playwright, com testes de API e de interface |
| [extras/03-ia](extras/03-ia/) | Prompts para cenários e massa de teste |
| [extras/04-bdd-cucumber](extras/04-bdd-cucumber/) | Cucumber sem navegador, direto na API (na aula ele roda dentro do Cypress) |
| [extras/05-ci-cd](extras/05-ci-cd/) | Pipeline com GitHub Actions |
