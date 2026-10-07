# 03 · Automação com Playwright

Documentação oficial: https://playwright.dev/docs/intro · Boas práticas: https://playwright.dev/docs/best-practices

## Rodando

```bash
npm run test:api        # só testes de API
npm run test:e2e        # só testes de interface
npm run test:ui         # modo UI: ver, depurar e reexecutar com "viagem no tempo"
npm run report          # relatório HTML da última execução
npx playwright codegen http://localhost:3000   # gravar ações e gerar locators
```

O [playwright.config.ts](../../../playwright.config.ts) sobe o app sozinho (`webServer`), então não precisa rodar `npm start` antes.

## Organização

```
tests/api/        testes de API com o fixture `request`
tests/e2e/        testes de interface
pages/            Page Objects (Programação e Minhas inscrições)
support/dados.ts  massa de teste com Faker
support/api.ts    preparação de cenário pela API
support/fixtures.ts  fixture `usuarioLogado` que pula a tela de login
```

## As práticas aplicadas aqui (todas da documentação oficial)

| Prática | Onde ver |
|---|---|
| Locators pelo que a pessoa usuária vê (`getByRole`, `getByLabel`) | `tests/e2e/login.spec.ts` |
| Asserções web-first (`await expect(...).toBeVisible()`), que esperam sozinhas | todos os e2e |
| Testes isolados: cada um cria os próprios dados | `support/api.ts` |
| Preparar o cenário pela API, verificar pela interface | `tests/e2e/inscricao.spec.ts` |
| Fixtures customizadas | `support/fixtures.ts` |
| Page Object Model | `pages/` |
| Testes parametrizados (valores limite) | `tests/api/cadastro.spec.ts` |
| `test.step` para relatórios legíveis | teste de limite de vagas |
| Trace no primeiro retry em CI | `playwright.config.ts` |

## Os testes vão falhar, e isso é bom

Na versão da Sprint, cerca de 11 testes falham. Cada falha corresponde a um defeito real do Inscrevi. Leia a mensagem, abra o relatório e confira se o defeito já tem issue.

Para ver a suíte inteira verde (a versão "corrigida" do app):

```bash
# Linux / macOS
MODO=estavel npx playwright test
# Windows (PowerShell)
$env:MODO="estavel"; npx playwright test
```

## Exercício (40 min)

1. Rode `npm run test:api` e relacione cada falha com uma história do backlog.
2. Escreva um teste de API para a **US06**: cancelar a inscrição de **outra pessoa** deve retornar 403.
3. Escreva um teste e2e: tentar se inscrever **deslogado** leva à tela de login com um aviso.
4. Use o `codegen` para descobrir locators e depois **reescreva** o código gerado com nomes claros.
5. Desafio: transforme seus casos de teste do dia 1 em testes automatizados.
