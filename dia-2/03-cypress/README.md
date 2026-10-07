# 03 · Automação de testes com Cypress

Documentação oficial: https://docs.cypress.io · Boas práticas: https://docs.cypress.io/app/core-concepts/best-practices

A parte tem dois momentos:

1. **Live coding do zero.** O instrutor monta um projeto de automação a partir
   de uma pasta vazia, usando o Sauce Demo (https://www.saucedemo.com), um site
   público feito para praticar. Acompanhe digitando junto.
2. **Sua vez.** Você automatiza, sozinho, os cenários que planejou no dia 1
   para o Inscrevi.

Esta pasta é um projeto Cypress já configurado e **sem testes prontos**: os
testes do Inscrevi são seus.

> Se perdeu no meio do caminho? A [colinha](COLINHA.md) tem os comandos mais
> usados e o que fazer com os erros mais comuns.

## Momento 1 · Acompanhando o live coding

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

A configuração está pronta nesta pasta: veja o [cypress.config.js](cypress.config.js)
e o bloco `cypress-cucumber-preprocessor` do [package.json](package.json).

| No Gherkin | No código | Papel |
|---|---|---|
| `# language: pt` | | Palavras-chave em português |
| `Funcionalidade` | `describe` | Agrupa os cenários |
| `Contexto` | `beforeEach` | Passos comuns a todos os cenários |
| `Cenário` | `it` | Um teste |
| `Esquema do Cenário` + `Exemplos` | Um `it` por linha da tabela | O mesmo cenário com dados diferentes |
| `Dado` / `Quando` / `Então` / `E` | `Given` / `When` / `Then` | Preparar, agir, conferir |
| `"texto"` | `{string}` | Parâmetro passado para o passo |

## Momento 2 · Sua vez no Inscrevi

Você pode continuar no projeto que criou no live coding ou usar esta pasta, que
já vem configurada:

```bash
cd dia-2/03-cypress
npm install
npx cypress install
npx cypress open
```

O `baseUrl` é `https://inscrevi.vercel.app`, a homologação do Inscrevi, então
`cy.visit('/#/entrar')` basta e não é preciso subir nada na sua máquina.

O ambiente é o mesmo da execução manual, compartilhado com a turma: os testes
criam contas, minicursos e inscrições de verdade. Gere os seus próprios dados
(e-mail novo, curso novo) em vez de contar com o que já está lá.

### O que a pasta entrega

```
cypress.config.js                      baseUrl e plugin do Cucumber
cypress/
  e2e/
    minha-historia.cy.js               modelo em JavaScript
    minha-historia.feature             modelo em Gherkin
  support/
    commands.js                        comandos customizados
    e2e.js                             carregado antes de todos os testes
    step_definitions/                  passos do Cucumber
```

Comandos customizados, para montar a pré-condição sem passar pela tela:

| Comando | O que faz |
|---|---|
| `cy.getByTestId('campo-email')` | Atalho para `cy.get('[data-testid="campo-email"]')` |
| `cy.loginPelaApi()` | Cria uma conta nova e entra **pela API** |
| `cy.criarCurso({ vagas: 3 })` | Cria um minicurso como administrador e devolve os dados dele |

Rotas da interface: `/#/cursos`, `/#/entrar`, `/#/criar-conta`,
`/#/minhas-inscricoes`, `/#/perfil`, `/#/recuperar-senha` e `/#/admin/cursos`.
A API fica em `/api` e está documentada em https://inscrevi.vercel.app/docs.

Para descobrir o `data-testid` de um elemento, clique nele com o botão direito
e escolha **Inspecionar**. No modo interativo do Cypress, o ícone de alvo ao
lado da barra de endereço sugere o seletor.

### Do caso de teste para o Cypress

| No caso de teste | Em JavaScript (`.cy.js`) | Em Cucumber (`.feature` + passos) |
|---|---|---|
| Cenário | `it('...')` | `Cenário:` |
| Dado | `beforeEach`, `cy.visit`, `cy.loginPelaApi`, `cy.criarCurso` | `Given('...', () => { ... })` |
| Quando | `.type`, `.click` | `When('...', () => { ... })` |
| Então | `.should` | `Then('...', () => { ... })` |

### Prática (30 min, individual)

1. Copie `cypress/e2e/minha-historia.cy.js` com o nome da sua história, por
   exemplo `us06-cancelamento.cy.js`. Se preferir Cucumber, copie o
   `minha-historia.feature` e escreva os passos em `step_definitions/`.
2. Automatize **um cenário de sucesso** da sua história.
3. Automatize **um cenário de erro** (regra de negócio ou valor limite).
4. Acrescente **um teste de API** com `cy.request` para a mesma regra.
5. Se sobrar tempo, automatize o cenário do bug que você relatou na Parte 1.
6. Rode no terminal: `npx cypress run --spec "cypress/e2e/<seu-arquivo>"`.

Se o teste do seu bug ficar vermelho, ele está certo: o teste descreve o
comportamento **esperado** pela história, e fica vermelho até o defeito ser
corrigido. Não ajuste a asserção para o teste passar.

### Antes de dar o teste por pronto

- [ ] O nome do `it` ou do cenário diz a regra que está sendo conferida?
- [ ] O teste falharia se o comportamento estivesse errado?
- [ ] Ele passa rodando sozinho e também junto com os outros?
- [ ] Não há `cy.wait` com número?
- [ ] Os dados são criados pelo próprio teste (e-mail novo, curso novo)?

## Publicando o seu projeto e ligando o pipeline

Teste automatizado é código: vai para o Git e roda sozinho a cada mudança.
Publique o projeto que **você** criou num repositório seu no GitHub. Não é
preciso fazer fork deste repositório.

Se você usou esta pasta em vez de criar o projeto do zero, copie-a antes para
fora do repositório do curso (por exemplo, para `cypress-do-zero`) e trabalhe
na cópia.

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

Se o pipeline ficar vermelho por causa de um bug do Inscrevi, ele está fazendo
o trabalho dele. Os prints da falha ficam no artefato `cypress-screenshots`, na
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
