// Apelidos em português para Given/When/Then.
// O Cucumber ignora a palavra-chave na hora de casar o passo; isto é só para leitura.
const { Given, When, Then } = require('@cucumber/cucumber');

module.exports = { Dado: Given, Quando: When, Então: Then };
