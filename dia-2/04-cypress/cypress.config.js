// Configuração conforme a documentação oficial:
// https://docs.cypress.io/app/references/configuration
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Boa prática oficial: definir baseUrl e subir o servidor ANTES do Cypress
    // https://docs.cypress.io/app/core-concepts/best-practices
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: false,
  },
});
