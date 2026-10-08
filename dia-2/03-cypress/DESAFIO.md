# Desafio 03 · Automatizar a sua história no Inscrevi

[Trilha](../../README.md#a-trilha) › [Dia 2](../README.md) › [Lição](README.md)

Lição desta fase: [Automação de testes com Cypress](README.md) ·
[colinha](COLINHA.md)

Na lição, cada caso de teste da SD01 virou um `it`. Agora os casos são os seus:
os cenários que você escreveu, executou à mão e testou pela API passam a rodar
sozinhos.

## Preparação

Você pode continuar no projeto que criou na lição ou usar esta pasta, que já
vem configurada:

```bash
cd dia-2/03-cypress
npm install
npx cypress install
npx cypress open
```

O `baseUrl` é `https://inscrevi.vercel.app`, a homologação do Inscrevi, então
`cy.visit('/#/entrar')` basta e não é preciso subir nada na sua máquina.

A homologação é compartilhada: os testes criam contas, minicursos e inscrições
de verdade, que outras pessoas veem. Gere os seus próprios dados (e-mail novo,
curso novo) em vez de contar com o que já está lá. Para um ambiente só seu,
suba o Inscrevi (`npm start` na raiz do repositório) e rode com
`npx cypress open --config baseUrl=http://localhost:3000`.

## O que a pasta entrega

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

## Do caso de teste para o Cypress

| No caso de teste | Em JavaScript (`.cy.js`) | Em Cucumber (`.feature` + passos) |
|---|---|---|
| Cenário | `it('...')` | `Cenário:` |
| Dado | `beforeEach`, `cy.visit`, `cy.loginPelaApi`, `cy.criarCurso` | `Given('...', () => { ... })` |
| Quando | `.type`, `.click` | `When('...', () => { ... })` |
| Então | `.should` | `Then('...', () => { ... })` |

## Tarefas (40 min)

1. Copie `cypress/e2e/minha-historia.cy.js` com o nome da sua história, por
   exemplo `us06-cancelamento.cy.js`. Se preferir Cucumber, copie o
   `minha-historia.feature` e escreva os passos em `step_definitions/`.
2. Automatize **um cenário de sucesso** da sua história.
3. Automatize **um cenário de erro** (regra de negócio ou valor limite).
4. Acrescente **um teste de API** com `cy.request` para a mesma regra.
5. Automatize o cenário de um bug que você relatou.
6. Rode no terminal: `npx cypress run --spec "cypress/e2e/<seu-arquivo>"`.

Se o teste do seu bug ficar vermelho, ele está certo: o teste descreve o
comportamento **esperado** pela história, e fica vermelho até o defeito ser
corrigido. Não ajuste a asserção para o teste passar.

## Confira antes de seguir

- [ ] O nome do `it` ou do cenário diz a regra que está sendo conferida?
- [ ] O teste falharia se o comportamento estivesse errado?
- [ ] Ele passa rodando sozinho e também junto com os outros?
- [ ] Não há `cy.wait` com número?
- [ ] Os dados são criados pelo próprio teste (e-mail novo, curso novo)?
- [ ] O teste do bug está vermelho pelo motivo certo (o defeito), e não por
      seletor errado ou dado que já existia?

## O que você entrega

Um arquivo `.cy.js` (ou `.feature` com os passos) com os cenários da sua
história. Para fechar o ciclo, publique o projeto num repositório seu e ligue o
pipeline, como mostra a
[lição](README.md#publicando-o-seu-projeto-e-ligando-o-pipeline).

## Para ir além

- Peça uma revisão do seu teste com o
  [prompt de review](../prompts/07-review-de-automacao.md).
- Calcule as métricas da sua história e decida se ela está pronta com o
  [prompt de métricas](../prompts/08-metricas-e-kpis.md).
- Refaça os mesmos cenários em Playwright: [extras/02-playwright](../extras/02-playwright/).
