# A Sprint de um QA: qualidade de software na prática

Um curso prático e gratuito de QA, para fazer no seu ritmo. Você aprende cada
etapa do trabalho com um exemplo resolvido e depois enfrenta um desafio num
sistema que tem defeitos **de propósito**.

| | Onde | Como |
|---|---|---|
| **Aprenda** | [Sauce Demo](https://www.saucedemo.com), uma loja pública feita para praticar teste | Teoria curta e um exemplo resolvido, para acompanhar fazendo junto |
| **Desafio** | **Inscrevi**, um sistema de inscrição em minicursos que vem neste repositório | Você, um backlog, uma Sprint em andamento e nenhum gabarito |

Em cada fase, o `README.md` é a lição e o `DESAFIO.md` é o desafio.

> O material nasceu como um minicurso de duas noites ministrado por **Lucas da
> Cunha Rodrigues** na UDESC, em outubro de 2026, e foi reorganizado para quem
> quiser estudar por conta própria ou usar em sala.

## A trilha

### [Dia 1](dia-1/) · Fundamentos, requisitos e testes manuais

| Fase | Aprenda (Sauce Demo) | Desafio (Inscrevi) |
|---|---|---|
| 01 | [Fundamentos de teste](dia-1/01-fundamentos/) | [Reconhecimento do produto](dia-1/01-fundamentos/DESAFIO.md) |
| 02 | [Requisitos, INVEST e técnicas de teste](dia-1/02-requisitos/) | [QA de plantão no refinamento](dia-1/02-requisitos/DESAFIO.md) |
| 03 | [Casos de teste em BDD e plano de teste](dia-1/03-casos-de-teste/) | [Cenários e plano da sua história](dia-1/03-casos-de-teste/DESAFIO.md) |
| 04 | [Execução funcional](dia-1/04-execucao-de-testes/02-funcional/) · [Execução de API](dia-1/04-execucao-de-testes/01-api/) ¹ | [Executar e explorar](dia-1/04-execucao-de-testes/02-funcional/DESAFIO.md) · [Testar pela API](dia-1/04-execucao-de-testes/01-api/DESAFIO.md) |
| 05 | [Gestão de defeitos](dia-1/05-defeitos/) | [Relatar os defeitos](dia-1/05-defeitos/DESAFIO.md) |

### [Dia 2](dia-2/) · Execução com IA, API e automação

| Fase | Aprenda | Desafio (Inscrevi) |
|---|---|---|
| 01 | [Execução e reporte de bugs com IA](dia-2/01-execucao-e-defeitos/) (Sauce Demo) | [Executar e reportar](dia-2/01-execucao-e-defeitos/DESAFIO.md) |
| 02 | [Scripts de teste no Postman](dia-2/02-postman/) ¹ | [A coleção da sua história](dia-2/02-postman/DESAFIO.md) |
| 03 | [Cypress do zero, com Cucumber, Git e pipeline](dia-2/03-cypress/) (Sauce Demo) | [Automatizar a sua história](dia-2/03-cypress/DESAFIO.md) |

¹ O Sauce Demo não tem API pública. Nas duas lições de API, o exemplo usa as
rotas de login do Inscrevi, e o desafio fica com as rotas da sua história.

Cada dia leva cerca de 3 a 4 horas. Depois dos desafios, há
[material extra](dia-2/#material-extra) de Git, Playwright, IA, Cucumber e
CI/CD.

### Como as fases se ligam

Nas lições, uma história do Sauce Demo
([SD01 · Finalizar compra](dia-1/02-requisitos/exemplo-saucedemo.md)) atravessa
a trilha: é refinada, ganha casos de teste e plano, é executada, gera um relato
de bug e, no fim, vira teste automatizado.

Nos desafios, você escolhe **uma história do Inscrevi** na fase 02 do dia 1 e
faz o mesmo caminho com ela.

## Como começar

1. Faça um **fork** deste repositório (é nele que você guarda as suas entregas
   e registra os seus bugs).
2. Prepare o ambiente com o [SETUP.md](SETUP.md). Leva uns 15 minutos.
3. Clone o seu fork e suba o Inscrevi:

```bash
git clone https://github.com/SEU-USUARIO/sprint-de-um-qa.git
```

```bash
cd sprint-de-um-qa
```

```bash
npm install
```

```bash
npm start
```

4. Abra http://localhost:3000. A documentação da API fica em
   http://localhost:3000/docs.
5. Comece pelo [dia 1](dia-1/).

### Contas de exemplo

| Sistema | Conta | Usuário | Senha |
|---|---|---|---|
| Inscrevi | Aluna | maria@inscrevi.dev | Senha@123 |
| Inscrevi | Aluno | joao@inscrevi.dev | Senha@123 |
| Inscrevi | Admin | admin@inscrevi.dev | Admin@123 |
| Sauce Demo | Padrão | standard_user | secret_sauce |
| Sauce Demo | Bloqueada | locked_out_user | secret_sauce |
| Sauce Demo | Com defeitos | problem_user | secret_sauce |

### Onde testar o Inscrevi

| Ambiente | Endereço | Para quê |
|---|---|---|
| Local | http://localhost:3000 | O padrão. Usa um banco PostgreSQL embutido em memória: reiniciar o app (`Ctrl+C` e `npm start`) volta tudo ao estado inicial |
| Homologação | https://inscrevi.vercel.app | Ambiente compartilhado: o que uma pessoa cadastra ou altera, todas as outras veem. Pode estar fora do ar ou com os dados mexidos |

O rodapé de todas as telas mostra o **ambiente** e a **versão** em teste, que
você vai precisar ao relatar defeitos.

### Regras do jogo

- **No dia 1, não abra a pasta `app/`.** Um QA testando em caixa-preta não vê o
  código, e é isso que você vai praticar. No dia 2 ela fica liberada.
- **Guarde as suas entregas em `minha-sprint/`**, na raiz do seu fork.
- **Relate os bugs nas Issues do seu fork**, e não no repositório original
  (ative em *Settings → General → Features → Issues*).
- **Sem spoiler.** Os defeitos do Inscrevi são a graça do curso: ao compartilhar
  o que você fez, mostre o seu processo e deixe os achados para quem vem depois.

### Artefatos da Sprint

| Artefato | Onde está |
|---|---|
| Backlog em rascunho (para o desafio de refinamento) | [sprint/backlog-rascunho.md](sprint/backlog-rascunho.md) |
| Backlog refinado (16 histórias em 5 épicos) | [sprint/backlog.md](sprint/backlog.md) |
| Protótipos de tela | https://claude.ai/artifact/EppH87VQmyfY2aCtzQXuov |
| Definition of Done | [sprint/definition-of-done.md](sprint/definition-of-done.md) |
| Quadro da Sprint da turma original | https://github.com/users/Mr-Lucasz/projects/4 |

## Para quem vai dar aula com este material

O formato original são duas noites de 3 horas. Em cada fase, conduza a lição
ao vivo no Sauce Demo e deixe o desafio do Inscrevi como prática individual:
cada pessoa escolhe uma história, com no máximo duas pessoas por história. A
homologação compartilhada serve para a turma inteira testar o mesmo sistema ao
mesmo tempo.

## Comandos

| Comando | O que faz |
|---|---|
| `npm start` | Sobe o Inscrevi na versão da Sprint |
| `npm run test:postman` | Roda a coleção do Postman com Newman (app precisa estar no ar) |
| `npm run test:postman:dia1` | Roda a coleção completa do dia 1, com todas as rotas (app precisa estar no ar) |
| `npm run cy:open` / `npm run cy:run` | Dentro de `dia-2/03-cypress`: abre o Cypress ou roda os testes no terminal |
| `npm run test:api` | Testes de API com Playwright (material extra) |
| `npm run test:e2e` | Testes de interface com Playwright (material extra) |
| `npm run test:ui` | Abre o modo UI do Playwright |
| `npm run report` | Abre o último relatório HTML do Playwright |
| `npm run test:bdd` | Roda os cenários Gherkin com Cucumber (app precisa estar no ar) |
| `npm run massa` | Gera massa de teste com Faker |
| `npm run test:app` | Testes das rotas das histórias US07 a US16 |
| `npm run start:hospedado` | Sobe o Inscrevi ligado a um Postgres externo (precisa do `.env.hospedado`, veja `.env.example`) |
| `npm run banco:preparar` | Cria as tabelas e os dados iniciais no Postgres externo |

## Estrutura

```
app/                 o Inscrevi, sistema sob teste dos desafios (API + front)
sprint/              backlog em rascunho, backlog refinado e Definition of Done
dia-1/               fundamentos, requisitos, casos e plano de teste, execução e defeitos
dia-2/               execução com IA, Postman, Cypress, prompts e material extra
  <fase>/README.md     a lição
  <fase>/DESAFIO.md    o desafio no Inscrevi
.claude/skills/      as tarefas de QA como skills do Claude Code
.github/             template de defeito, template de PR e pipeline
```

## Contribuindo

Achou um erro no material ou quer sugerir uma melhoria? Veja o
[CONTRIBUTING.md](CONTRIBUTING.md). Os defeitos do Inscrevi são intencionais:
não precisam de correção.

## Referências oficiais

- Syllabus ISTQB CTFL v4.0.1: https://www.istqb.org (a tradução oficial em português é publicada pelo BSTQB, o board brasileiro)
- Sauce Demo: https://www.saucedemo.com
- Cypress: https://docs.cypress.io
- Cucumber no Cypress: https://github.com/badeball/cypress-cucumber-preprocessor
- Playwright: https://playwright.dev/docs/intro
- Cucumber e Gherkin: https://cucumber.io/docs/gherkin/reference/
- Postman: https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/
- GitHub Actions: https://docs.github.com/actions

## Licença

[MIT](LICENSE). Use, adapte e compartilhe, mantendo o crédito.
