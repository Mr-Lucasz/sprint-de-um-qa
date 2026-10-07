// Configuração conforme a documentação oficial:
// https://docs.cypress.io/app/references/configuration
const { defineConfig } = require('cypress');

// As três linhas abaixo só existem por causa do Cucumber.
// O Cypress não entende arquivos .feature sozinho: o preprocessador traduz o
// Gherkin e o esbuild empacota o resultado.
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  e2e: {
    // Boa prática oficial: definir baseUrl. Aqui é o Inscrevi em homologação,
    // o mesmo ambiente da execução manual. O sistema precisa estar no ar.
    // https://docs.cypress.io/app/core-concepts/best-practices
    baseUrl: 'https://inscrevi.vercel.app',
    // Testes escritos em JavaScript (.cy.js) e em Gherkin (.feature)
    specPattern: ['cypress/e2e/**/*.cy.js', 'cypress/e2e/**/*.feature'],
    supportFile: 'cypress/support/e2e.js',
    video: false,

    // Roda no Node, antes dos testes: é aqui que se ligam os plugins
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));
      return config;
    },
  },
});
