// "World" do Cucumber: estado compartilhado entre os passos de UM cenário.
// https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md
const { setWorldConstructor, World } = require('@cucumber/cucumber');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000/api';
let contador = 0;

class MundoInscrevi extends World {
  async api(metodo, caminho, corpo, token) {
    const resposta = await fetch(`${BASE_URL}${caminho}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
    const texto = await resposta.text();
    return { status: resposta.status, corpo: texto ? JSON.parse(texto) : null };
  }

  emailUnico() {
    contador += 1;
    return `bdd${Date.now()}${contador}@teste.dev`;
  }

  async novaPessoaLogada() {
    const dados = { nome: 'Pessoa BDD', email: this.emailUnico(), senha: 'Senha@1234' };
    await this.api('POST', '/usuarios', dados);
    const { corpo } = await this.api('POST', '/login', { email: dados.email, senha: dados.senha });
    return corpo.token;
  }
}

setWorldConstructor(MundoInscrevi);
