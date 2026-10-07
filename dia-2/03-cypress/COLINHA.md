# Colinha · Cypress, Cucumber e Git

Para consultar quando se perder. O material completo está no [README](README.md).

## Terminal

| Comando | O que faz |
|---|---|
| `npm init -y` | Cria o `package.json` |
| `npm install --save-dev cypress` | Instala o Cypress no projeto |
| `npm install` | Instala o que está no `package.json` (depois de clonar ou copiar um projeto) |
| `npx cypress install` | Baixa o aplicativo do Cypress |
| `npx cypress open` | Abre o Cypress **com interface** |
| `npx cypress run` | Roda tudo **sem interface** (headless) |
| `npx cypress run --spec "cypress/e2e/arquivo.cy.js"` | Roda só um arquivo |
| `npx cypress run --headed` | Roda pelo terminal mostrando o navegador |
| `npx cypress run --browser chrome` | Escolhe o navegador |

## Onde fica cada coisa

```
cypress.config.js                configuração (baseUrl, plugins)
cypress/
  e2e/                           os testes (.cy.js e .feature)
  fixtures/                      dados em JSON
  support/
    commands.js                  comandos customizados
    e2e.js                       carregado antes de cada teste
    step_definitions/            passos do Cucumber
    locators/                    seletores
    pages/                       page objects
```

## Um teste em JavaScript

```js
describe('assunto', () => {
  beforeEach(() => {
    cy.visit('/#/entrar');                          // abrir
  });

  it('o que deve acontecer', () => {
    cy.get('[data-testid="campo-email"]').type('ana@teste.dev');   // agir
    cy.get('[data-testid="botao-entrar"]').click();

    cy.get('[data-testid="erro-formulario"]').should('be.visible'); // conferir
  });
});
```

`it.only` roda só aquele teste. `it.skip` pula.

## Um teste em Cucumber

A feature, em `cypress/e2e/nome.feature`:

```gherkin
# language: pt
Funcionalidade: Nome da história

  Cenário: O que deve acontecer
    Dado que estou na tela "Entrar"
    Quando entro com o e-mail "ana@teste.dev" e a senha "Senha@1234"
    Então vejo a mensagem "E-mail ou senha incorretos."
```

Os passos, em `cypress/support/step_definitions/nome.steps.js`:

```js
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('que estou na tela "Entrar"', () => {
  cy.visit('/#/entrar');
});

When('entro com o e-mail {string} e a senha {string}', (email, senha) => {
  cy.get('[data-testid="campo-email"]').type(email);
  cy.get('[data-testid="campo-senha"]').type(senha);
  cy.get('[data-testid="botao-entrar"]').click();
});

Then('vejo a mensagem {string}', (mensagem) => {
  cy.get('[data-testid="erro-formulario"]').should('have.text', mensagem);
});
```

| Gherkin | Código | Papel |
|---|---|---|
| `Funcionalidade` | `describe` | Agrupa os cenários |
| `Contexto` | `beforeEach` | Roda antes de cada cenário |
| `Cenário` | `it` | Um teste |
| `Esquema do Cenário` + `Exemplos` | um teste por linha da tabela | Mesmo cenário, dados diferentes |
| `Dado` | `Given` | Pré-condição |
| `Quando` | `When` | Ação |
| `Então` | `Then` | Resultado esperado |
| `E` | o mesmo do passo anterior | Continua o passo de cima |
| `"texto"` | `{string}` | Parâmetro de texto |
| `3` | `{int}` | Parâmetro numérico |

## Encontrar elementos

| Comando | Encontra |
|---|---|
| `cy.get('[data-testid="x"]')` | Pelo atributo de teste (preferido) |
| `cy.getByTestId('x')` | O mesmo, com o comando do projeto |
| `cy.get('#id')` / `cy.get('.classe')` | Por id ou classe |
| `cy.contains('texto')` | Pelo texto visível |
| `cy.contains('button', 'Salvar')` | Um botão com esse texto |
| `.first()` `.last()` `.eq(2)` | Pela posição |
| `.find('button')` | Dentro do elemento encontrado |
| `.parents('seletor')` | Subindo a partir do elemento |

Para descobrir o seletor: botão direito no elemento → **Inspecionar**.

## Agir

| Comando | O que faz |
|---|---|
| `cy.visit('/#/cursos')` | Abre uma página |
| `.type('texto')` | Digita |
| `.type('texto{enter}')` | Digita e aperta Enter |
| `.clear()` | Limpa o campo |
| `.click()` | Clica |
| `.select('opção')` | Escolhe numa lista |
| `.check()` / `.uncheck()` | Marca e desmarca uma caixa |

## Conferir

| Asserção | Confere |
|---|---|
| `.should('be.visible')` | Está na tela |
| `.should('not.exist')` | Não está na página |
| `.should('have.text', 'x')` | O texto é exatamente `x` |
| `.should('contain', 'x')` | O texto contém `x` |
| `.should('have.value', 'x')` | O valor do campo é `x` |
| `.should('have.length', 3)` | Foram encontrados 3 elementos |
| `.should('be.disabled')` | Está desabilitado |
| `cy.url().should('include', '/cursos')` | O endereço contém esse trecho |
| `cy.location('hash').should('eq', '#/entrar')` | A rota é exatamente essa |

Para conferir mais de uma coisa no mesmo elemento: `.should(...).and(...)`.

## Testar a API

```js
// sucesso
cy.request('GET', '/api/cursos').then((resposta) => {
  expect(resposta.status).to.eq(200);
  expect(resposta.body).to.be.an('array');
});

// erro esperado: failOnStatusCode: false deixa o teste receber o 4xx
cy.request({
  method: 'POST',
  url: '/api/login',
  body: { email: 'ana@teste.dev', senha: 'errada' },
  failOnStatusCode: false,
}).then((resposta) => {
  expect(resposta.status).to.eq(401);
  expect(resposta.body.mensagem).to.eq('E-mail ou senha incorretos.');
});

// rota protegida: token no header
cy.request({
  method: 'GET',
  url: '/api/usuarios/me',
  headers: { Authorization: `Bearer ${token}` },
});
```

## Comandos prontos do projeto

| Comando | O que faz |
|---|---|
| `cy.getByTestId('campo-email')` | Atalho para `cy.get('[data-testid="campo-email"]')` |
| `cy.loginPelaApi()` | Cria uma conta e entra pela API, sem passar pela tela |
| `cy.criarCurso({ vagas: 3 })` | Cria um minicurso como administrador |

Para criar o seu, em `cypress/support/commands.js`:

```js
Cypress.Commands.add('nomeDoComando', (parametro) => {
  // passos que se repetem em vários testes
});
```

## Git

| Comando | O que faz |
|---|---|
| `git status` | Mostra o que mudou |
| `git add .` | Prepara todas as mudanças |
| `git commit -m "test: mensagem"` | Grava um commit |
| `git push` | Envia para o GitHub |
| `git pull` | Traz o que está no GitHub |
| `git switch -c testes/minha-historia` | Cria uma branch e muda para ela |
| `git switch main` | Volta para a branch principal |
| `git log --oneline` | Lista os commits |

Primeira publicação de um projeto novo:

```bash
git init -b main
git add .
git commit -m "test: cenários da minha história"
git remote add origin https://github.com/SEU-USUARIO/cypress-do-zero.git
git push -u origin main
```

Prefixos de commit: `test:` teste, `fix:` correção, `ci:` pipeline, `chore:` configuração.

## Travou?

| O que aparece | O que fazer |
|---|---|
| `Step implementation missing` | O texto do passo na feature não é igual ao do código. Confira letra por letra, inclusive aspas e acentos |
| `Timed out retrying after 4000ms: Expected to find element` | O seletor não achou nada. Inspecione o elemento e confira o `data-testid`; veja se a página certa abriu |
| `Timed out retrying ... expected 'x' to have text 'y'` | O elemento existe, mas o texto é outro. Pode ser erro no teste ou um bug: compare com o critério de aceite |
| `Cypress could not verify that this server is running` | O endereço do `baseUrl` não respondeu. Confira a internet e o endereço no `cypress.config.js` |
| `The cypress npm package is installed, but the Cypress binary is missing` | Rode `npx cypress install` |
| `cy.request() failed ... status code 4xx` | A API respondeu erro. Se o erro é o esperado, use `failOnStatusCode: false` |
| Mudei o `cypress.config.js` e nada aconteceu | Feche e abra o Cypress |
| O arquivo não aparece na lista do Cypress | O nome precisa terminar em `.cy.js` ou `.feature` e estar dentro de `cypress/e2e/` |
| `Author identity unknown` no commit | Rode `git config --global user.name "Seu Nome"` e `git config --global user.email "voce@exemplo.com"` |
| `rejected` no `git push` | Rode `git pull` antes e tente de novo |
| O teste passa sozinho e falha junto com os outros | Ele depende de dados de outro teste. Crie os dados dentro dele (e-mail novo, curso novo) |

Três regras que evitam a maioria dos problemas: seletor por `data-testid`,
nenhum `cy.wait(3000)` e cada teste criando os próprios dados.
