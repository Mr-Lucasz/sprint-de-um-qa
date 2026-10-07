const assert = require('node:assert/strict');
const { Dado, Quando, Então } = require('./pt');

Dado('que estou logado como uma pessoa nova', async function () {
  this.token = await this.novaPessoaLogada();
});

Dado('que existe um curso com {int} vagas e {int} pessoa(s) inscrita(s)', async function (vagas, inscritos) {
  const admin = await this.api('POST', '/login', { email: 'admin@inscrevi.dev', senha: 'Admin@123' });
  const curso = await this.api('POST', '/cursos', {
    titulo: 'Curso BDD', data: '2027-05-20', inicio: '19:00', fim: '21:00', vagas,
  }, admin.corpo.token);
  this.curso = curso.corpo;

  for (let i = 0; i < inscritos; i += 1) {
    const outraPessoa = await this.novaPessoaLogada();
    await this.api('POST', '/inscricoes', { cursoId: this.curso.id }, outraPessoa);
  }
});

Dado('eu já estou inscrito nesse curso', async function () {
  await this.api('POST', '/inscricoes', { cursoId: this.curso.id }, this.token);
});

Quando('eu me inscrevo nesse curso', async function () {
  this.resposta = await this.api('POST', '/inscricoes', { cursoId: this.curso.id }, this.token);
});

Então('a inscrição deve ser confirmada', function () {
  assert.equal(this.resposta.status, 201);
});

Então('o curso deve ficar com {int} vagas disponíveis', async function (vagas) {
  const { corpo } = await this.api('GET', `/cursos/${this.curso.id}`);
  assert.equal(corpo.vagasDisponiveis, vagas);
});

Então('a inscrição deve ser recusada com a mensagem {string}', function (mensagem) {
  assert.equal(this.resposta.status, 409);
  assert.equal(this.resposta.corpo.mensagem, mensagem);
});
