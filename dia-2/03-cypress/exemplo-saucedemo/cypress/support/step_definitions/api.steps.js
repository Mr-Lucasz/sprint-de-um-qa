import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// A API em teste é a do Inscrevi. Como o baseUrl deste projeto é o Sauce Demo,
// o endereço fica aqui. Num projeto com baseUrl do Inscrevi, esta linha some.
const API = 'https://inscrevi.vercel.app';

// O token fica guardado entre os passos do mesmo cenário
let token;

// antes de cada cenário, apaga o token: um cenário não herda o login do outro
beforeEach(() => {
  token = undefined;
});

// função de apoio usada pelos dois passos de envio
const enviar = (method, rota, body) => {
  // se há token, manda no header Authorization; senão, nenhum header
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  // failOnStatusCode: false deixa o teste receber 4xx e 5xx para conferir o erro
  // .as('resposta') guarda a resposta com um apelido para os passos de Então
  // a URL é o endereço da API + a rota escrita na feature
  cy.request({ method, url: API + rota, body, headers, failOnStatusCode: false }).as('resposta');
};

Given('que tenho um token de acesso', () => {
  // faz o login pela API (comando do commands.js) e guarda o token
  cy.tokenDoInscrevi().then((valor) => {
    token = valor;
  });
});

// {word} recebe uma palavra sem aspas (GET, POST, DELETE); {string}, a rota
When('envio um {word} para {string}', (metodo, rota) => {
  enviar(metodo, rota);
});

// O texto entre """ na feature chega como último parâmetro
When('envio um {word} para {string} com o corpo:', (metodo, rota, corpo) => {
  // JSON.parse transforma o texto da feature num objeto
  enviar(metodo, rota, JSON.parse(corpo));
});

Then('a API responde {int}', (status) => {
  // lê a resposta guardada e confere o status
  cy.get('@resposta').its('status').should('eq', status);
});

Then('a resposta traz o campo {string}', (campo) => {
  // o corpo tem uma propriedade com esse nome
  cy.get('@resposta').its('body').should('have.property', campo);
});

Then('a resposta traz a mensagem {string}', (mensagem) => {
  // o campo "mensagem" do corpo é exatamente esse texto
  cy.get('@resposta').its('body.mensagem').should('eq', mensagem);
});
