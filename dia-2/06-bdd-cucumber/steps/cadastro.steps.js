const assert = require('node:assert/strict');
const { Dado, Quando, Então } = require('./pt');

Dado('que sou uma pessoa ainda não cadastrada', function () {
  this.dados = { nome: 'Pessoa BDD', email: this.emailUnico(), senha: 'Senha@1234' };
});

Dado('que já existe uma conta com o e-mail {string}', function (email) {
  // A conta da Maria faz parte dos dados iniciais do app
  this.dados = { nome: 'Outra Pessoa', email, senha: 'Senha@1234' };
});

Quando('eu me cadastro com uma senha de {int} caracteres', async function (tamanho) {
  this.resposta = await this.api('POST', '/usuarios', { ...this.dados, senha: 'a'.repeat(tamanho) });
});

Quando('eu me cadastro com o e-mail {string}', async function (email) {
  this.resposta = await this.api('POST', '/usuarios', { ...this.dados, email });
});

Então('o cadastro deve ser {word}', function (resultado) {
  if (resultado === 'aceito') {
    assert.equal(this.resposta.status, 201);
  } else {
    // Recusa por dado inválido (400) ou por conflito com dado existente (409)
    assert.ok([400, 409].includes(this.resposta.status), `esperava recusa, recebeu ${this.resposta.status}`);
  }
});

Então('devo ver a mensagem {string}', function (mensagem) {
  assert.equal(this.resposta.corpo.mensagem, mensagem);
});
