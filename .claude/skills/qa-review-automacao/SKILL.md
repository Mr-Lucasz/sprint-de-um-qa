---
name: qa-review-automacao
description: Faz code review de testes automatizados (Cypress, Cucumber, Playwright ou scripts do Postman), apontando testes que não conseguem falhar, seletores frágeis, esperas fixas, dependência entre testes e nomes que não dizem a regra. Use quando pedirem para revisar, avaliar ou melhorar um teste automatizado, um spec, uma feature ou um PR de testes (ex.: "revisa meu us04.cy.js", "esse teste está bom?", "por que esse teste é instável?").
---

# Review de código de teste automatizado

Um teste automatizado vale pelo que ele pega quando o sistema quebra. A
revisão procura, nesta ordem, o que o impede de fazer isso.

## Entrada

O arquivo, o diff ou o trecho colado. Leia também o que ele usa
(`cypress/support/commands.js`, step definitions, fixtures) e, quando houver,
o caso de teste ou a história que ele deveria cobrir (`sprint/backlog.md`).

## O que conferir

**1. O teste confere a coisa certa?**
- Tem asserção, e ela falharia se o comportamento estivesse errado? Asserção
  fraca: só `exist`, só status 200, `contain` com um trecho genérico.
- O esperado bate com o critério de aceite, ou foi ajustado ao que o sistema
  faz hoje (asserção trocada, `.skip`, `failOnStatusCode: false` sem conferir
  o status)?
- O nome do `it` ou do cenário diz a regra? Cobre erro e borda, ou só o
  caminho feliz?

**2. É confiável?**
- `cy.wait(3000)` ou `waitForTimeout`: troque por espera pelo estado
  (`should`, `cy.intercept` + `cy.wait('@alias')`, asserções web-first).
- Depende de outro teste ter rodado antes, da ordem ou de dado que já existia
  no ambiente? Cada teste cria o que precisa (e-mail e curso novos).
- Dado fixo que colide numa segunda execução ou com outra pessoa na
  homologação.
- Valor de comando Cypress guardado em variável comum e usado fora do `.then`.

**3. É fácil de manter?**
- Seletor por classe CSS, posição ou XPath longo em vez de `data-testid`
  (`cy.getByTestId`) ou papel/texto visível.
- Pré-condição montada pela tela quando há `cy.loginPelaApi`, `cy.criarCurso`
  ou `cy.request`.
- Repetição que cabe num `beforeEach` ou num comando customizado; e o inverso:
  abstração que esconde o que o teste faz.
- Em Gherkin: passo com detalhe de interface ("clico no botão azul"), `Quando`
  com várias ações, `Então` sem resultado observável, passos duplicados.
- Senha ou token real no código; URL fixa em vez de `baseUrl`.

**4. Em scripts do Postman**: um `pm.test` por verificação, status **e** corpo
conferidos, token em variável, massa dinâmica no pre-request.

Boas práticas de referência: https://docs.cypress.io/app/core-concepts/best-practices
e https://playwright.dev/docs/best-practices.

## Regras

- Comprove antes de apontar: abra o arquivo, confira se o `data-testid`
  existe em `app/public/`, rode o teste se der
  (`npx cypress run --spec ...` em `dia-2/03-cypress`). Diga quando um ponto é
  suspeita e não fato.
- Teste vermelho por defeito do sistema está correto. Não sugira mudança que o
  faça passar; sugira ligá-lo ao bug.
- Explique o porquê de cada ponto em uma frase; quem está aprendendo precisa
  da razão, não só da correção.
- Não reescreva tudo por gosto. Preferência de estilo sem consequência fica de fora.

## Saída

1. Veredito em uma linha: **aprovado**, **aprovado com ajustes** ou **precisa mudar**.
2. Achados, do mais grave ao menos grave:

   | Gravidade | Onde | Problema | Por que importa | Sugestão |
   |---|---|---|---|---|

   Gravidade: **Bloqueia** (o teste não confere o que diz ou não consegue
   falhar), **Importante** (instável ou dependente), **Melhoria** (manutenção
   e leitura).
3. O que está bom e deve ser mantido.
4. O trecho corrigido, só das partes com achado. Reescreva o arquivo inteiro
   apenas se pedirem.
