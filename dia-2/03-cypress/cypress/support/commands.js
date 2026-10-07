// Comandos customizados: https://docs.cypress.io/api/cypress-api/custom-commands

// Seleciona por data-testid, seguindo a recomendação oficial de usar atributos data-*
// https://docs.cypress.io/app/core-concepts/best-practices#Selecting-Elements
Cypress.Commands.add('getByTestId', (id, ...args) => {
  return cy.get(`[data-testid="${id}"]`, ...args);
});

// Cria um usuário e faz login PELA API, sem passar pela tela.
// cy.session guarda a sessão entre testes: https://docs.cypress.io/api/commands/session
// O usuário é gerado uma vez por arquivo de spec, então cy.session reaproveita o login.
const sufixo = Cypress._.random(1e6, 9e6);
Cypress.Commands.add('loginPelaApi', () => {
  const usuario = { nome: `Aluno Cypress ${sufixo}`, email: `cy${sufixo}@teste.dev`, senha: 'Senha@1234' };

  cy.session(usuario.email, () => {
    cy.request('POST', '/api/usuarios', usuario);
    cy.request('POST', '/api/login', { email: usuario.email, senha: usuario.senha }).then(({ body }) => {
      window.localStorage.setItem('inscrevi.token', body.token);
      window.localStorage.setItem('inscrevi.usuario', JSON.stringify(body.usuario));
    });
  });
});

// Cria um curso como admin e devolve o corpo da resposta
Cypress.Commands.add('criarCurso', (dados = {}) => {
  return cy.request('POST', '/api/login', { email: 'admin@inscrevi.dev', senha: 'Admin@123' })
    .then(({ body }) => cy.request({
      method: 'POST',
      url: '/api/cursos',
      headers: { Authorization: `Bearer ${body.token}` },
      body: { titulo: `Curso Cypress ${Cypress._.random(1e6, 9e6)}`, data: '2027-03-10', inicio: '19:00', fim: '21:00', vagas: 3, ...dados },
    }))
    .its('body');
});
