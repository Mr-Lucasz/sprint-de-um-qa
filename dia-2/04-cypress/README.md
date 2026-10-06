# 04 · Cypress (demonstração)

Documentação oficial: https://docs.cypress.io · Boas práticas: https://docs.cypress.io/app/core-concepts/best-practices

O Cypress fica numa pasta separada, com instalação própria, para não pesar o projeto principal.

```bash
# em um terminal, na raiz do repositório
npm start

# em outro terminal
cd dia-2/04-cypress
npm install
npx cypress open    # modo interativo
npx cypress run     # modo terminal
```

## Mesmos cenários, duas ferramentas

`cypress/e2e/login.cy.js` cobre os mesmos cenários de `../03-playwright/tests/e2e/login.spec.ts`. Compare:

| Aspecto | Playwright | Cypress |
|---|---|---|
| Seleção de elementos | Recomenda locators por papel e rótulo (`getByRole`) | Recomenda atributos `data-*` (`data-cy`, `data-testid`) |
| Espera | Asserções web-first com `await` | Comandos encadeados com retry automático |
| Navegadores | Chromium, Firefox e WebKit | Família Chrome, Firefox e Electron (WebKit experimental) |
| Login reaproveitável | `storageState` / fixtures | `cy.session` |
| Esperar a rede | `page.waitForResponse` | `cy.intercept` + `cy.wait('@alias')` |
| Linguagem | JS/TS, Python, Java, .NET | JS/TS |

Nenhuma é "a melhor". A escolha depende do contexto do time (princípio 6 do CTFL).

## O que observar

- `cy.getByTestId`: comando customizado em `cypress/support/commands.js`.
- `cy.loginPelaApi`: cria o usuário e entra pela API, com `cy.session` guardando a sessão.
- `cy.intercept`: espera a resposta da inscrição e verifica o status, **sem** `cy.wait(1000)`.
