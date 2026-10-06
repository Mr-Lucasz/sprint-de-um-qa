# 06 · BDD com Cucumber

Documentação oficial: https://cucumber.io/docs/gherkin/reference/ · Cucumber.js: https://github.com/cucumber/cucumber-js

BDD (CTFL 2.1.3) é sobre **conversa e exemplos concretos** antes de ser sobre ferramenta. O Gherkin dá um formato comum para negócio, desenvolvimento e teste descreverem o comportamento esperado, e o Cucumber transforma esses exemplos em testes executáveis.

## Rodando

```bash
npm start            # em um terminal
npm run test:bdd     # em outro
```

O relatório HTML é gerado em `dia-2/06-bdd-cucumber/relatorio.html`.

## Gherkin em português

A primeira linha `# language: pt` habilita as palavras-chave em português:

| Inglês | Português |
|---|---|
| Feature | Funcionalidade |
| Rule | Regra |
| Background | Contexto |
| Scenario / Example | Cenário / Exemplo |
| Scenario Outline + Examples | Esquema do Cenário + Exemplos |
| Given / When / Then / And / But | Dado / Quando / Então / E / Mas |

## Boas práticas aplicadas

- **Dado** descreve o estado, não cliques: "Dado que existe um curso com 2 vagas", e não "Dado que clico em...".
- **Um Quando por cenário**: um comportamento por vez.
- **Então** com resultado observável e concreto.
- **Regra** agrupa os exemplos de cada critério de aceite.
- **Esquema do Cenário** para os valores limite, sem repetir texto.
- Os passos chamam a **API**, o que deixa os cenários rápidos e estáveis.

## Exercício

Escreva em `features/cancelamento.feature` os cenários da **US06** e implemente os passos que ainda não existirem em `steps/`.
