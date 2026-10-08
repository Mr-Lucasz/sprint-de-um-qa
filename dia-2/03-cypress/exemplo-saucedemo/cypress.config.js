// defineConfig dá autocompletar e validação para as opções do Cypress
const { defineConfig } = require('cypress');
// empacotador: junta a feature e os passos num arquivo que o navegador entende
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
// plugin que ensina o Cypress a ler Gherkin
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
// ponte entre o plugin do Cucumber e o empacotador esbuild
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

// exporta a configuração para o Cypress ler ao abrir
module.exports = defineConfig({
  // bloco dos testes de ponta a ponta (e2e)
  e2e: {
    // endereço do sistema em teste: com ele, cy.visit('/') abre o Sauce Demo
    baseUrl: 'https://www.saucedemo.com',
    // quais arquivos são testes: Gherkin (.feature) e JavaScript (.cy.js)
    specPattern: ['cypress/e2e/**/*.feature', 'cypress/e2e/**/*.cy.js'],
    // arquivo carregado antes de cada teste (é ele que importa o commands.js)
    supportFile: 'cypress/support/e2e.js',
    // não grava vídeo no cypress run (deixa a execução mais leve)
    video: false,

    // roda no Node antes dos testes: é aqui que se ligam os plugins
    async setupNodeEvents(on, config) {
      // liga o plugin do Cucumber
      await addCucumberPreprocessorPlugin(on, config);
      // manda todo arquivo de teste passar pelo empacotador antes de rodar
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));
      // devolve a configuração, já alterada pelo plugin
      return config;
    },
  },
});
