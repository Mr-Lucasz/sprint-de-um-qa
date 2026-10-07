# 6 · Automação com Cypress

Para transformar um cenário em teste automatizado e para entender um teste que
falhou. Roteiro da aula: [03-cypress](../03-cypress/).

A IA não vê a tela do Inscrevi. Se você não informar os `data-testid`, ela
inventa. Descubra os seus com **botão direito → Inspecionar** ou com o ícone de
alvo do Cypress e cole no prompt.

## Prompt A · Do cenário para o `.cy.js`

**O que colar:** o cenário, os `data-testid` das telas que ele usa e a rota da
interface (por exemplo `/#/cursos`).

```text
Você é um QA de automação que segue as boas práticas oficiais do Cypress
(https://docs.cypress.io/app/core-concepts/best-practices).

Automatize o cenário abaixo em Cypress, com JavaScript, para o Inscrevi. O
baseUrl já é https://inscrevi.vercel.app e o ambiente é compartilhado com
outras pessoas.

O projeto já tem estes comandos customizados:
- cy.getByTestId('id')  → atalho para cy.get('[data-testid="id"]')
- cy.loginPelaApi()     → cria uma conta nova e entra pela API
- cy.criarCurso({ vagas: 3 })  → cria um minicurso como administrador e
  devolve os dados dele (aceita titulo, data, inicio, fim e vagas)

Regras:
- A pré-condição (o Dado) é montada pela API, com os comandos acima ou com
  cy.request. A tela entra só no que o cenário está conferindo.
- Use apenas os data-testid que eu informei. Se precisar de um elemento que
  não está na lista, use cy.contains com o texto visível e me avise qual
  data-testid eu devo procurar. Não invente seletores.
- Nada de cy.wait com número. Deixe o cy.get e o .should esperarem.
- O teste cria os próprios dados e passa rodando sozinho e junto com outros.
- O nome do describe é a história e o nome do it diz a regra conferida.
- A asserção descreve o resultado esperado pelo cenário, mesmo que o sistema
  hoje se comporte diferente.

Entregue o arquivo completo e, depois, uma tabela ligando cada parte do
cenário (Dado, Quando, Então) à linha de código correspondente.

<cenario>
<<cole o seu caso de teste: dado, quando, entao e dados>>
</cenario>

<tela>
Rota: <<por exemplo /#/cursos>>
data-testid disponíveis: <<liste os que você encontrou>>
</tela>
```

## Prompt B · Em Cucumber

```text
Escreva o mesmo cenário para o Cypress com o
@badeball/cypress-cucumber-preprocessor:

1. O arquivo .feature, começando com "# language: pt", com Funcionalidade,
   Contexto (se houver passo comum) e Cenário. Se o cenário se repete com
   dados diferentes, use Esquema do Cenário com Exemplos.
2. O arquivo de passos, importando Given, When e Then do pacote, com textos
   parametrizados por {string} e {int} para os passos serem reutilizáveis.

Os passos falam a língua do negócio: nada de "clico no botão azul" nem de
seletor dentro do .feature. Mantenha as mesmas regras de antes: pré-condição
pela API, sem cy.wait com número, sem seletor inventado.
```

## Prompt C · Teste de API com `cy.request`

```text
Escreva um teste com cy.request para a mesma regra, chamando a API direto, sem
a tela. A API fica em /api e as rotas protegidas recebem
Authorization: Bearer <token>, vindo de POST /api/login.

Para o cenário de erro, use failOnStatusCode: false e confira o status e o
corpo da resposta. O status esperado é o da história:

<<cole a regra e o status esperado>>
```

## Prompt D · Meu teste falhou

**O que colar:** o teste, a mensagem de erro e o cenário que ele cobre.

```text
Meu teste Cypress falhou. Antes de propor qualquer mudança, diga em qual
destes casos a falha se encaixa e por quê:

a) O teste está errado: seletor, pré-condição, ordem dos comandos, dado que
   colidiu com o de outra pessoa.
b) O sistema está errado: o comportamento diverge do que o cenário espera.
   Nesse caso o teste está certo e deve continuar vermelho.
c) O ambiente: indisponível, lento, ou a pré-condição foi alterada por outra
   pessoa.

Se for (a), mostre a correção e explique. Se for (b), não mude a asserção: me
diga o que observar para confirmar o defeito e escrever o bug. Se não der para
decidir com o que colei, diga o que eu devo verificar.

<cenario>
<<o cenário esperado>>
</cenario>

<teste>
<<o código>>
</teste>

<erro>
<<a mensagem do Cypress>>
</erro>
```

## Confira antes de usar

- [ ] Todo `data-testid` do código existe na tela?
- [ ] O teste falharia se o comportamento estivesse errado? Troque o valor
      esperado de propósito e veja o teste ficar vermelho.
- [ ] Ele passa sozinho e também junto com os outros?
- [ ] Não há `cy.wait` com número?
- [ ] Os dados são criados pelo próprio teste?
- [ ] Você entende cada linha? Peça explicação do que não entender.

## Para continuar a conversa

```text
Explique este teste linha por linha, como se eu nunca tivesse usado Cypress.
```

```text
Estes três testes repetem a mesma preparação. Mostre como mover o que é comum
para um beforeEach ou para um comando customizado, sem esconder o que cada
teste confere.
```
