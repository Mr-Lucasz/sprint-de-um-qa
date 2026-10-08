# 07 · CI/CD com GitHub Actions

Documentação oficial: https://docs.github.com/actions · Playwright em CI: https://playwright.dev/docs/ci-intro

O pipeline está em [.github/workflows/qualidade.yml](../../../.github/workflows/qualidade.yml) e roda a cada push na `main` e a cada pull request, contra o Inscrevi no modo `estavel` (a versão de referência, sem defeitos). Por isso ele fica verde.

## O que ele faz

```
push / pull request
   ├── job "API"         sobe o app → Newman (Postman) → Cucumber → publica relatórios
   └── job "Playwright"  instala só o Chromium → testes de API e e2e → publica relatório HTML
```

## Vendo o pipeline ficar vermelho

O Inscrevi que você testa nos desafios é o modo `sprint`, que **tem defeitos**. Para ver os testes fazendo o trabalho deles: aba **Actions → Qualidade → Run workflow**, escolha o modo `sprint`. Um pipeline vermelho por defeito real é um pipeline funcionando.

Compare as duas execuções: os mesmos testes, verdes na versão de referência e vermelhos onde a Sprint tem defeito.

## Lendo uma falha

1. Abra a execução que falhou e o job em vermelho.
2. Leia o passo que falhou: o nome do teste já deve dizer qual regra quebrou.
3. Baixe o artefato `playwright-report`, descompacte e rode `npx playwright show-report <pasta>`.
4. Nos testes com retry, abra o **trace** para ver cada ação, a rede e o DOM.

## Exercício (20 min)

1. No seu fork, habilite o Actions e abra um PR com os testes que você escreveu.
2. Veja o pipeline rodar no PR. Depois rode-o manualmente no modo `sprint` e identifique qual job falhou e por qual defeito.
3. Discussão: o time deveria bloquear o merge enquanto o pipeline estiver vermelho? E se o teste falha por um defeito já conhecido e aceito pelo PO?
