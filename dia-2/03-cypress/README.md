# 03 · Automação de testes com Cypress

Documentação oficial: https://docs.cypress.io · Boas práticas: https://docs.cypress.io/app/core-concepts/best-practices

Esta fase tem duas partes:

1. **A lição (esta página).** Você monta um projeto de automação a partir de
   uma pasta vazia, usando o Sauce Demo (https://www.saucedemo.com), um site
   público feito para praticar. O projeto pronto está em
   [exemplo-saucedemo](exemplo-saucedemo/), para consultar quando travar.
2. **O [desafio](DESAFIO.md).** Você automatiza, sozinho, os cenários que
   planejou para o Inscrevi. Esta pasta é um projeto Cypress já configurado e
   **sem testes prontos**: os testes do Inscrevi são seus.

> Se perdeu no meio do caminho? A [colinha](COLINHA.md) tem os comandos mais
> usados e o que fazer com os erros mais comuns.

## Construindo o projeto do zero

Crie o seu projeto numa pasta nova, fora deste repositório:

```bash
mkdir cypress-do-zero
cd cypress-do-zero
npm init -y
npm install --save-dev cypress
npx cypress install
npx cypress open
```

No Cypress, escolha **E2E Testing**, um navegador e **Scaffold example specs**
para receber os exemplos oficiais.

Contas do Sauce Demo (a senha de todas é `secret_sauce`): `standard_user`
entra normalmente e `locked_out_user` está bloqueada.

### Anatomia de um teste

```js
describe('assunto', () => {        // agrupa os testes
  beforeEach(() => {               // roda antes de cada teste
    cy.visit('https://...');       // 1. abrir
  });

  it('o que deve acontecer', () => {
    cy.get('[data-test="campo"]').type('valor');   // 2. agir
    cy.get('[data-test="botao"]').click();

    cy.get('[data-test="resultado"]').should('have.text', 'esperado');   // 3. conferir
  });
});
```

### Comandos mais usados

| Comando | Para quê |
|---|---|
| `cy.visit(url)` | Abrir uma página |
| `cy.get(seletor)` | Encontrar pelo seletor CSS |
| `cy.contains(texto)` | Encontrar pelo texto visível |
| `.first()` `.last()` `.eq(n)` | Escolher pela posição |
| `.find(seletor)` `.within(() => {})` | Procurar dentro de um elemento |
| `.type(texto)` `.clear()` | Digitar e limpar |
| `.click()` | Clicar |
| `.select(valor)` `.check()` | Escolher numa lista, marcar uma caixa |
| `.should(...)` `.and(...)` | Conferir o resultado |
| `cy.url()` `cy.location('hash')` | Ler o endereço |
| `cy.fixture('arquivo')` | Ler dados de `cypress/fixtures` |
| `.as('nome')` e `cy.get('@nome')` | Dar um apelido e reutilizar |
| `cy.request(...)` | Chamar a API direto, sem tela |
| `cy.intercept(...)` e `cy.wait('@nome')` | Observar ou simular as chamadas que a tela faz |
| `cy.session(...)` | Guardar o login entre os testes |
| `cy.viewport(...)` `cy.screenshot()` | Mudar o tamanho da tela, capturar evidência |

| Asserção no `.should` | Confere |
|---|---|
| `'be.visible'` / `'not.be.visible'` | Está ou não na tela |
| `'exist'` / `'not.exist'` | Está ou não na página |
| `'have.text', 'x'` / `'contain', 'x'` | Texto exato ou parte dele |
| `'have.value', 'x'` | Valor de um campo |
| `'have.length', 6` | Quantidade de elementos |
| `'have.attr', 'nome', 'valor'` | Atributo |
| `'be.enabled'` / `'be.disabled'` | Habilitado ou não |

### Roteiro da lição

Escreva cada passo no seu projeto antes de abrir o arquivo de exemplo
correspondente, em [exemplo-saucedemo/cypress/e2e/saucedemo](exemplo-saucedemo/cypress/e2e/saucedemo/).

| Passo | O que você escreve | Arquivo de exemplo |
|---|---|---|
| 1 | Login válido, senha errada e usuário bloqueado | `01-login.cy.js` |
| 2 | Uma compra completa, com o login no `beforeEach` | `02-compra.cy.js` |
| 3 | As formas de encontrar um elemento | `03-seletores.cy.js` |
| 4 | Ações e asserções mais usadas | `04-acoes-e-assercoes.cy.js` |
| 5 | Fixtures, apelidos, comando customizado e `cy.session` | `05-fixtures-comandos-sessao.cy.js` |
| 6 | Endereço, viewport, cookies e capturas de tela | `06-navegador.cy.js` |
| 7 | Os casos da [SD01](../../dia-1/03-casos-de-teste/exemplo-saucedemo.csv) virando testes | `07-sd01-checkout.cy.js` |
| 8 | O login e o carrinho em Gherkin, com page objects | `compra.feature`, `carrinho.feature` |
| 9 | Testes de API com `cy.request` e passos genéricos | `../inscrevi/api.feature` |

O passo 7 fecha o ciclo do dia 1: o caso de teste que você leu no CSV e
executou à mão vira um `it`. O `CT-06` fica **vermelho de propósito**: a loja
aceita o checkout com o carrinho vazio, e o teste descreve o comportamento
esperado pela história. Ele só fica verde quando o defeito for corrigido.

O Sauce Demo não tem API pública, então o passo 9 usa a API do Inscrevi.

### Três ideias que evitam dor de cabeça

- **Seletor estável.** Prefira atributos feitos para teste (`data-test` no
  Sauce Demo, `data-testid` no Inscrevi). Classe CSS e posição na página mudam
  quando o layout muda.
- **Nada de `cy.wait(3000)`.** O Cypress repete o `cy.get` e o `.should` até dar
  certo ou o tempo acabar (4 segundos por padrão). Esperar por tempo fixo deixa
  o teste lento e, mesmo assim, instável.
- **Cada teste se vira sozinho.** Um `it` não pode depender do que outro deixou
  pronto. O que é pré-condição vai no `beforeEach`.

### Cucumber dentro do Cypress

```bash
npm install --save-dev @badeball/cypress-cucumber-preprocessor @bahmutov/cypress-esbuild-preprocessor esbuild
```

A configuração comentada linha a linha está no projeto de exemplo: veja o
[cypress.config.js](exemplo-saucedemo/cypress.config.js) e o bloco
`cypress-cucumber-preprocessor` do [package.json](exemplo-saucedemo/package.json).

| No Gherkin | No código | Papel |
|---|---|---|
| `# language: pt` | | Palavras-chave em português |
| `Funcionalidade` | `describe` | Agrupa os cenários |
| `Contexto` | `beforeEach` | Passos comuns a todos os cenários |
| `Cenário` | `it` | Um teste |
| `Esquema do Cenário` + `Exemplos` | Um `it` por linha da tabela | O mesmo cenário com dados diferentes |
| `Dado` / `Quando` / `Então` / `E` | `Given` / `When` / `Then` | Preparar, agir, conferir |
| `"texto"` | `{string}` | Parâmetro passado para o passo |

## Publicando o seu projeto e ligando o pipeline

Teste automatizado é código: vai para o Git e roda sozinho a cada mudança.
Publique o projeto que **você** criou num repositório seu no GitHub. Não é
preciso fazer fork deste repositório.

Se você usou esta pasta ou a de exemplo em vez de criar o projeto do zero,
copie-a antes para fora do repositório do curso (por exemplo, para
`cypress-do-zero`) e trabalhe na cópia.

### 1. Primeiro commit

Confira se há um `.gitignore` com `node_modules/`, `cypress/screenshots/`,
`cypress/videos/` e `cypress/downloads/`. Depois, na pasta do projeto:

```bash
git init -b main
git add .
git commit -m "test: cenários da minha história"
```

Se o Git pedir identificação:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "voce@exemplo.com"
```

### 2. Repositório no GitHub

No GitHub: **+ → New repository**, nome `cypress-do-zero`, sem README,
.gitignore ou licença. Depois, trocando `SEU-USUARIO`:

```bash
git remote add origin https://github.com/SEU-USUARIO/cypress-do-zero.git
git push -u origin main
```

No primeiro `push` o navegador abre para você entrar no GitHub.

### 3. Pipeline

Crie o arquivo `.github/workflows/cypress.yml` na raiz do projeto:

```yaml
# nome que aparece na aba Actions do GitHub
name: Testes Cypress

# quando o pipeline roda
on:
  # a cada push na branch principal
  push:
    branches: [main]
  # a cada pull request aberto ou atualizado
  pull_request:
  # e manualmente, pelo botão "Run workflow"
  workflow_dispatch:

jobs:
  # um job chamado "cypress"
  cypress:
    # máquina Linux nova, criada pelo GitHub só para esta execução
    runs-on: ubuntu-latest
    # se passar de 10 minutos, cancela (evita pipeline preso)
    timeout-minutes: 10
    steps:
      # baixa o código do repositório para a máquina
      - uses: actions/checkout@v7

      # instala o Node e guarda o cache do npm para as próximas execuções
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm

      # instala exatamente as versões do package-lock.json
      - run: npm ci

      # garante que o aplicativo do Cypress foi baixado
      - run: npx cypress install

      # roda todos os testes em headless, no Chrome
      - run: npx cypress run --browser chrome

      # se algum teste falhar, guarda os prints como evidência
      - uses: actions/upload-artifact@v7
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
          retention-days: 7
```

Envie numa branch e abra um pull request para ver o pipeline rodar:

```bash
git switch -c ci/pipeline
git add .github/workflows/cypress.yml
git commit -m "ci: roda os testes do Cypress a cada push e pull request"
git push -u origin ci/pipeline
```

No GitHub, clique em **Compare & pull request** e acompanhe a verificação no
rodapé do PR ou na aba **Actions**.

| Prefixo do commit | Quando usar |
|---|---|
| `test:` | Teste novo ou alterado |
| `fix:` | Correção de um teste que estava errado |
| `ci:` | Mudança no pipeline |
| `chore:` | Configuração e dependências |

Se o pipeline ficar vermelho por causa de um defeito do sistema em teste (como
o `CT-06` do exemplo), ele está fazendo o trabalho dele. Os prints da falha ficam no artefato `cypress-screenshots`, na
página da execução.

## Rodando no terminal

| Comando | O que faz |
|---|---|
| `npx cypress open` | Modo interativo |
| `npx cypress run` | Roda tudo, sem abrir janela |
| `npx cypress run --spec "cypress/e2e/arquivo.cy.js"` | Roda só um arquivo |
| `npx cypress run --browser chrome` | Escolhe o navegador |
| `npx cypress run --config baseUrl=http://localhost:3000` | Roda contra o Inscrevi local (`npm start` na raiz do repositório) |

Quando um teste falha no terminal, o Cypress salva um print em
`cypress/screenshots/`.

## Agora é com você

No [desafio desta fase](DESAFIO.md) você automatiza os cenários da sua história
no Inscrevi.
