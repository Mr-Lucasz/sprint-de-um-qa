# A Sprint de um QA: qualidade de software na prática

Repositório do minicurso ministrado por **Lucas da Cunha Rodrigues** na UDESC, nos dias **06 e 07/10, das 19:00 às 22:00**, no Laboratório 003 (Bloco Carvalho).

Durante duas noites você vai trabalhar como QA de um time que está terminando uma Sprint do **Inscrevi**, um sistema de inscrição em minicursos. Você vai receber o backlog, analisar as histórias, testar à mão, registrar defeitos, testar a API, automatizar, usar IA a seu favor e colocar tudo para rodar num pipeline.

> O Inscrevi tem defeitos **de propósito**. Encontrá-los é o seu trabalho.

## Antes do curso

Siga o [SETUP.md](SETUP.md). Leva uns 15 minutos e evita perder tempo de aula com instalação.

## Como começar

```bash
git clone https://github.com/Mr-Lucasz/sprint-de-um-qa.git
cd sprint-de-um-qa
npm install
npm start
```

Abra http://localhost:3000. A documentação da API fica em http://localhost:3000/docs.

| Conta de exemplo | E-mail | Senha |
|---|---|---|
| Aluna | maria@inscrevi.dev | Senha@123 |
| Aluno | joao@inscrevi.dev | Senha@123 |
| Admin | admin@inscrevi.dev | Admin@123 |

Rodando assim, o Inscrevi usa um banco PostgreSQL embutido em memória: reiniciar o app (`Ctrl+C` e `npm start`) volta tudo ao estado inicial. O rodapé de todas as telas mostra o **ambiente** e a **versão** em teste, que você vai precisar ao relatar defeitos.

### Ambiente de homologação

No dia 1 cada dupla testa num ambiente hospedado, com dados só seus: `https://inscrevi.vercel.app/t/<ambiente>/` (o instrutor informa o nome do ambiente da sua dupla, por exemplo `dupla-07`). A API fica em `/t/<ambiente>/api` e a documentação em `/t/<ambiente>/docs`. As contas de exemplo acima existem em todos os ambientes.

> **Regra do dia 1:** não abra a pasta `app/`. Um QA testando em caixa-preta não vê o código, e é isso que vamos praticar. No dia 2 ela fica liberada.

## Agenda

### Dia 1 (06/10) · Fundamentos, requisitos e testes manuais

| Horário | Bloco | Material |
|---|---|---|
| 19:00 | Abertura, apresentação do produto e da Sprint | [sprint/](sprint/) |
| 19:15 | Fundamentos de teste | [dia-1/01-fundamentos](dia-1/01-fundamentos/) |
| 19:40 | Análise de requisitos e técnicas de teste | [dia-1/02-requisitos](dia-1/02-requisitos/) |
| 20:20 | Intervalo | |
| 20:35 | Casos de teste e teste exploratório | [dia-1/03-casos-de-teste](dia-1/03-casos-de-teste/), [dia-1/04-exploratorio](dia-1/04-exploratorio/) |
| 21:20 | Gestão de defeitos | [dia-1/05-defeitos](dia-1/05-defeitos/) |
| 21:50 | Daily de encerramento e preparação para o dia 2 | |

### Dia 2 (07/10) · APIs, automação, IA e CI/CD

| Horário | Bloco | Material |
|---|---|---|
| 19:00 | Recapitulação e Git para QA | [dia-2/01-git-para-qa](dia-2/01-git-para-qa/) |
| 19:20 | Testes de API com Postman | [dia-2/02-postman](dia-2/02-postman/) |
| 20:00 | Intervalo | |
| 20:15 | Automação com Playwright (hands-on) e Cypress (demonstração) | [dia-2/03-playwright](dia-2/03-playwright/), [dia-2/04-cypress](dia-2/04-cypress/) |
| 21:05 | IA para cenários e massa de teste, BDD com Cucumber | [dia-2/05-ia](dia-2/05-ia/), [dia-2/06-bdd-cucumber](dia-2/06-bdd-cucumber/) |
| 21:25 | CI/CD com GitHub Actions | [dia-2/07-ci-cd](dia-2/07-ci-cd/) |
| 21:50 | Sprint Review e Retrospectiva | |

## Comandos

| Comando | O que faz |
|---|---|
| `npm start` | Sobe o Inscrevi na versão da Sprint |
| `npm run test:api` | Testes de API com Playwright |
| `npm run test:e2e` | Testes de interface com Playwright |
| `npm run test:ui` | Abre o modo UI do Playwright |
| `npm run report` | Abre o último relatório HTML do Playwright |
| `npm run test:postman` | Roda a coleção do Postman com Newman (app precisa estar no ar) |
| `npm run test:bdd` | Roda os cenários Gherkin com Cucumber (app precisa estar no ar) |
| `npm run massa` | Gera massa de teste com Faker |
| `npm run start:hospedado` | Sobe o Inscrevi ligado a um Postgres externo (precisa do `.env.hospedado`, veja `.env.example`) |
| `npm run banco:preparar` | Cria os ambientes de teste no Postgres externo |

## Estrutura

```
app/                 o sistema sob teste (API + front)
sprint/              backlog com as histórias e Definition of Done
dia-1/               fundamentos, requisitos, casos de teste, exploratório, defeitos
dia-2/               Git, Postman, Playwright, Cypress, IA, Cucumber, CI/CD
.github/             template de defeito, template de PR e pipeline
```

## Referências oficiais

- Syllabus ISTQB CTFL v4.0.1: https://www.istqb.org (a tradução oficial em português é publicada pelo BSTQB, o board brasileiro)
- Playwright: https://playwright.dev/docs/intro
- Cypress: https://docs.cypress.io
- Cucumber e Gherkin: https://cucumber.io/docs/gherkin/reference/
- Postman: https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/
- GitHub Actions: https://docs.github.com/actions
