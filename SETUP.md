# Preparação do ambiente

Faça antes de começar o dia 1. Leva uns 15 minutos, mais o tempo dos downloads.

## 1. Instale as ferramentas

| Ferramenta | Versão | Onde baixar |
|---|---|---|
| Node.js | 20 ou mais recente (recomendado 22 LTS) | https://nodejs.org |
| Git | qualquer recente | https://git-scm.com |
| VS Code | qualquer recente | https://code.visualstudio.com |
| Postman | app desktop | https://www.postman.com/downloads |

Extensão do VS Code recomendada: **Cucumber** (Cucumber). Para o material extra
de Playwright, também a **Playwright Test for VS Code** (Microsoft).

Confira no terminal:

```bash
node -v
```

```bash
npm -v
```

```bash
git --version
```

## 2. Crie sua conta no GitHub e faça o fork

Você vai precisar da conta para guardar as suas entregas e registrar os
defeitos como issues: https://github.com/signup

Depois, na página do repositório, clique em **Fork**. No fork, abra
**Settings → General → Features** e marque **Issues**.

## 3. Clone e instale o projeto

Trocando `SEU-USUARIO`:

```bash
git clone https://github.com/SEU-USUARIO/sprint-de-um-qa.git
```

```bash
cd sprint-de-um-qa
```

```bash
npm install
```

## 4. Teste se está tudo certo

```bash
npm start
```

Abra http://localhost:3000. Se aparecer a programação de minicursos, o Inscrevi
está pronto. Abra também https://www.saucedemo.com e entre com `standard_user`
e a senha `secret_sauce`: é o site das lições.

## 5. Cypress (para o dia 2)

A automação do dia 2 é feita com Cypress, que tem instalação separada:

```bash
cd dia-2/03-cypress
```

```bash
npm install
```

```bash
npx cypress install
```

```bash
npx cypress verify
```

O download do aplicativo do Cypress tem algumas centenas de MB.

## 6. Playwright (só para o material extra)

```bash
npx playwright install chromium
```

Baixa só o Chromium (cerca de 150 MB), como recomenda a documentação do
Playwright.

## Problemas comuns

**Porta 3000 ocupada:** rode `node app/server.js --porta=4000` e acesse http://localhost:4000.

**`npm install` lento:** numa rede compartilhada (laboratório, evento), faça a instalação antes, em casa.

**Windows bloqueando scripts no PowerShell:** use o Prompt de Comando (cmd) ou o terminal do VS Code.
