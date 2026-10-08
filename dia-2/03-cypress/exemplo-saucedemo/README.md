# Exemplo · projeto Cypress do Sauce Demo

O projeto construído do zero na [lição de Cypress](../README.md), pronto para
rodar e consultar. Tente escrever junto com a lição antes de olhar o código.

```bash
cd dia-2/03-cypress/exemplo-saucedemo
npm install
npx cypress install
npx cypress open
```

## O que tem aqui

```
cypress.config.js                          baseUrl do Sauce Demo e plugin do Cucumber
cypress/
  e2e/
    saucedemo/
      01-login.cy.js                       visit, get, type, click e should
      02-compra.cy.js                      uma jornada completa e o beforeEach
      03-seletores.cy.js                   formas de encontrar um elemento
      04-acoes-e-assercoes.cy.js           ações e asserções mais usadas
      05-fixtures-comandos-sessao.cy.js    fixtures, apelidos, comandos e cy.session
      06-navegador.cy.js                   viewport, cookies, navegação
      07-sd01-checkout.cy.js               os casos de teste da SD01 automatizados
      compra.feature                       o mesmo login e carrinho em Gherkin
      carrinho.feature                     passos reaproveitados entre features
    inscrevi/
      api.feature                          testes de API com passos genéricos
  fixtures/sauce.json                      dados de teste
  support/
    commands.js                            cy.loginSauce e cy.tokenDoInscrevi
    locators/                              seletores num lugar só
    pages/                                 page objects
    step_definitions/                      passos do Cucumber
```

Leia na ordem dos números: cada arquivo acrescenta uma ideia ao anterior.

## Um teste vermelho de propósito

O `CT-06` de `07-sd01-checkout.cy.js` **falha**, e está certo: ele descreve a
regra 3 da [SD01](../../../dia-1/02-requisitos/exemplo-saucedemo.md), que a
loja não respeita. É o mesmo defeito do
[relato de exemplo](../../../dia-1/05-defeitos/README.md). O teste vigia o
defeito e só fica verde quando ele for corrigido.

A `api.feature` chama a API do Inscrevi em homologação
(https://inscrevi.vercel.app), porque o Sauce Demo não tem API pública. Se a
homologação estiver fora do ar, esses cenários falham por causa do ambiente.
