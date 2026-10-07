---
name: qa-automacao
description: Automatiza em Cypress os cenários de uma história do Inscrevi, em JavaScript (.cy.js) ou em Cucumber (.feature + passos), reaproveitando os comandos do projeto, e roda os testes para confirmar o resultado. Use quando pedirem para automatizar um cenário, escrever teste Cypress, converter caso de teste ou Gherkin em código, ou criar step definitions (ex.: "automatiza o CT-03", "escreve o teste do cancelamento").
---

# Automação com Cypress

Projeto: `dia-2/03-cypress` (baseUrl `https://inscrevi.vercel.app`). Leia o
`README.md` da pasta, `cypress/support/commands.js` e os modelos
`cypress/e2e/minha-historia.cy.js` e `.feature` antes de escrever.

## Entrada

- Os cenários: o CSV de casos de teste, Gherkin colado ou a história (`USxx`
  em `sprint/backlog.md`).
- O formato: `.cy.js` por padrão; Cucumber se pedirem ou se o cenário já vier
  em Gherkin e a pessoa quiser mantê-lo.

## Do cenário para o código

| No caso de teste | `.cy.js` | Cucumber |
|---|---|---|
| Cenário | `it('...')` | `Cenário:` |
| Dado | `beforeEach`, `cy.visit`, `cy.loginPelaApi`, `cy.criarCurso` | `Given(...)` |
| Quando | `.type`, `.click` | `When(...)` |
| Então | `.should` | `Then(...)` |

1. Crie um arquivo novo com o nome da história (`us06-cancelamento.cy.js`),
   sem editar os modelos.
2. Monte a pré-condição **pela API**, com `cy.loginPelaApi()`,
   `cy.criarCurso({ vagas: 1 })` ou `cy.request`. A tela entra só no que o
   cenário está de fato conferindo.
3. Selecione por `data-testid` com `cy.getByTestId(...)`. Descubra os ids em
   `app/public/index.html` e `app/public/app.js`; não chute. Sem `data-testid`,
   use `cy.contains` com o texto visível. Nada de classe CSS ou posição.
4. Confira o resultado que a pessoa vê (mensagem, item na lista, contagem de
   vagas) e, quando a regra é de API, o status com `cy.intercept` + `cy.wait('@alias')`.
5. Para regra que vale sem a tela, acrescente um teste com `cy.request` e
   `failOnStatusCode: false` nos cenários de erro.

Em Cucumber: `# language: pt` na primeira linha, passos em
`cypress/support/step_definitions/`, textos parametrizados com `{string}` e
`{int}`, e passos reutilizáveis em vez de um passo por cenário.

## Regras

- **Sem `cy.wait(número)`.** O Cypress repete `get` e `should` sozinho.
- **Cada teste se vira sozinho**: cria os próprios dados (e-mail e curso
  novos) e passa isolado e junto com os outros. A homologação é compartilhada.
- **O nome diz a regra**: `recusa inscrição quando o curso está sem vagas`,
  não `teste 2`.
- **A asserção descreve o esperado pelo backlog.** Se o Inscrevi tem um
  defeito, o teste fica vermelho e está certo. Nunca ajuste a asserção, use
  `.skip` ou afrouxe a verificação para passar; avise que o vermelho aponta um
  provável defeito e mostre a evidência.
- Um teste precisa conseguir falhar: verificação que passa com qualquer
  resposta não serve.
- Não repita em vários testes o que cabe num comando customizado; proponha o
  comando novo em `commands.js` só quando houver repetição real.

## Rodar e entregar

Dentro de `dia-2/03-cypress` (com `npm install` feito):

```bash
npx cypress run --spec "cypress/e2e/<arquivo>"
```

Rode e leia o resultado antes de dar por pronto. Entregue: o arquivo, o
resultado da execução (passou, falhou, e por quê), e a relação cenário → teste.
Falha por seletor ou pré-condição errada é do teste e deve ser corrigida;
falha porque o sistema diverge do backlog é achado e fica como está.
