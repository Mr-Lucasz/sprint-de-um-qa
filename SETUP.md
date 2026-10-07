# Preparação do ambiente

Faça antes do dia 1. Se travar em algum passo, chegue 15 minutos antes que resolvemos juntos.

## 1. Instale as ferramentas

| Ferramenta | Versão | Onde baixar |
|---|---|---|
| Node.js | 20 ou mais recente (recomendado 22 LTS) | https://nodejs.org |
| Git | qualquer recente | https://git-scm.com |
| VS Code | qualquer recente | https://code.visualstudio.com |
| Postman | app desktop | https://www.postman.com/downloads |

Extensões do VS Code recomendadas: **Playwright Test for VS Code** (Microsoft) e **Cucumber** (Cucumber).

Confira no terminal:

```bash
node -v
npm -v
git --version
```

## 2. Crie sua conta no GitHub

Você vai precisar dela no dia 1 (registrar defeitos como issues) e no dia 2 (relatar os bugs da execução): https://github.com/signup

## 3. Clone e instale o projeto

```bash
git clone https://github.com/Mr-Lucasz/sprint-de-um-qa.git
cd sprint-de-um-qa
npm install
npx playwright install chromium
```

O último comando baixa só o Chromium (cerca de 150 MB), como recomenda a documentação do Playwright.

## 4. Teste se está tudo certo

```bash
npm start
```

Abra http://localhost:3000. Se aparecer a programação de minicursos, está pronto.

## 5. Cypress (para o dia 2)

A automação do dia 2 é feita com Cypress, que tem instalação separada:

```bash
cd dia-2/03-cypress
npm install
npx cypress install
npx cypress verify
```

O download do aplicativo do Cypress tem algumas centenas de MB. Se possível,
faça em casa.

## Problemas comuns

**Porta 3000 ocupada:** rode `node app/server.js --porta=4000` e acesse http://localhost:4000.

**`npm install` lento no laboratório:** a rede é compartilhada com toda a turma. Se possível, faça a instalação em casa.

**Windows bloqueando scripts no PowerShell:** use o Prompt de Comando (cmd) ou o terminal do VS Code.
