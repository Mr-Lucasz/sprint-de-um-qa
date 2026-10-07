// Configuração do Cucumber.js: https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md
// O app precisa estar rodando (npm start) antes de executar: npm run test:bdd
module.exports = {
  default: {
    paths: ['dia-2/extras/04-bdd-cucumber/features/**/*.feature'],
    require: ['dia-2/extras/04-bdd-cucumber/steps/**/*.js'],
    format: ['progress', 'html:dia-2/extras/04-bdd-cucumber/relatorio.html'],
    language: 'pt',
  },
};
