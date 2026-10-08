# 02 · Testes de API com Postman

[Trilha](../../README.md#a-trilha) › [Dia 2](../README.md) › [Desafio](DESAFIO.md)

Documentação oficial: https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/

Na [lição de API do dia 1](../../dia-1/04-execucao-de-testes/01-api/) você
enviou requisições e conferiu a resposta com os olhos. Agora a conferência vira
**script**: o Postman passa a dizer sozinho se a resposta está certa, e a
coleção pode rodar inteira num comando.

> **Por que esta lição não usa o Sauce Demo?** A loja não tem API pública. O
> exemplo é uma coleção pronta das histórias US01 a US06 do Inscrevi; o desafio
> é escrever a da sua história.

## Conceitos rápidos

| Verbo | Uso no Inscrevi | Sucesso esperado |
|---|---|---|
| GET | Listar cursos | 200 |
| POST | Cadastrar, entrar, inscrever | 201 (criou) ou 200 (login) |
| DELETE | Cancelar inscrição | 204 (sem corpo) |

Faixas de status: **2xx** sucesso, **4xx** erro de quem chamou (400 dados inválidos, 401 sem login, 403 sem permissão, 404 não existe, 409 conflito com o estado atual), **5xx** erro do servidor.

## Exemplo resolvido · do olho para o script

Suba o Inscrevi (`npm start`) e, no Postman, refaça o login do dia 1:
`POST http://localhost:3000/api/login` com
`{ "email": "maria@inscrevi.dev", "senha": "Senha@123" }`.

### 1. O primeiro teste

Na aba **Scripts → Post-response**:

```js
pm.test('status 200', () => {
  pm.response.to.have.status(200);
});
```

Envie. A aba **Test Results** mostra o teste verde. Troque `200` por `201` e
envie de novo para ver um teste **falhar**: um teste que você nunca viu
vermelho pode não estar conferindo nada.

### 2. Conferir o corpo

```js
const { token, usuario } = pm.response.json();

pm.test('devolve token', () => {
  pm.expect(token).to.be.a('string').and.not.empty;
});

pm.test('devolve a conta que entrou', () => {
  pm.expect(usuario.email).to.eql('maria@inscrevi.dev');
});
```

### 3. Encadear: guardar o token para a próxima requisição

```js
pm.collectionVariables.set('token', token);
```

Na requisição `GET /usuarios/me`, aba **Authorization → Bearer Token**, use
`{{token}}`. O login alimenta as rotas protegidas, sem copiar e colar.

### 4. Um cenário de erro também é teste

Na requisição com a senha errada:

```js
pm.test('status 401', () => {
  pm.response.to.have.status(401);
});

pm.test('não revela qual campo está errado', () => {
  pm.expect(pm.response.json().mensagem).to.eql('E-mail ou senha incorretos.');
});
```

## A coleção pronta

1. No Postman: **Import** e selecione `inscrevi.postman_collection.json` e
   `local.postman_environment.json` (ou `homologacao.postman_environment.json`).
2. No canto superior direito, escolha o ambiente.
3. Rode a coleção inteira com **Run collection**.

Também dá para importar direto do contrato: **Import → Link** com
`http://localhost:3000/openapi.json`.

O que observar em cada pasta:

| Onde | Técnica | O que ver |
|---|---|---|
| *01 Usuários* → Cadastrar usuário válido | **Massa dinâmica** | A aba *Pre-request* gera um e-mail novo a cada execução |
| *01 Usuários* → Cadastrar usuário válido | **Validação de contrato** | `pm.response.to.have.jsonSchema` confere campos e tipos |
| *01 Usuários* → Recusar senha com 7 caracteres | **Valor limite** | O caso de teste do dia 1 virou requisição |
| *02 Login* → Entrar com credenciais válidas | **Encadeamento** | O token vai para uma variável e as próximas usam `{{token}}` |
| *03 Cursos* → Listar cursos | **Regra sobre uma lista** | `forEach` confere todos os cursos, não só o primeiro |
| *04 Inscrições* | **Fluxo com estado** | Inscrever, duplicar, cancelar: a ordem importa |
| Nível da coleção, aba *Scripts* | **Teste para todas as requisições** | Tempo de resposta conferido em toda chamada |

Alguns testes da coleção **falham**. Antes de olhar o código, decida para cada
um: é defeito do Inscrevi ou é o ambiente?

Na homologação, algumas falhas vêm do **ambiente**, e não do produto:

| Requisição | O que acontece na homologação | Por quê |
|---|---|---|
| Restaurar dados iniciais | 403 | Só quem administra reinicia os dados de um ambiente compartilhado |
| Inscrever-se em um curso | A contagem de vagas pode não bater, ou a inscrição ser recusada | A Oficina tem 2 vagas e outra pessoa pode tê-las ocupado |
| Qualquer uma | "responde em menos de 1 segundo" pode falhar | A sua rede e o servidor na nuvem são mais lentos que o app local |

Separar falha de ambiente de falha do produto faz parte do trabalho: antes de
abrir um bug, confirme que ele se repete com a pré-condição certa.

## Linha de comando com Newman

```bash
npm start              # em um terminal, na raiz do repositório
npm run test:postman   # em outro
```

Esse comando usa o ambiente `local.postman_environment.json`, que aponta para
`http://localhost:3000/api`, onde os dados voltam ao estado inicial a cada
execução. É o mesmo comando que roda no pipeline. Newman: https://github.com/postmanlabs/newman

## Para consultar

- A coleção completa do dia 1, com as 31 requisições de todas as rotas, está em
  [dia-1/04-execucao-de-testes/01-api](../../dia-1/04-execucao-de-testes/01-api/).
- **Um desafio resolvido: US05 · Minhas inscrições.**
  `inscrevi-us05-minhas-inscricoes.postman_collection.json`, com o ambiente
  `inscrevi-us05-homologacao.postman_environment.json`, é a coleção de uma
  história inteira: consulta das próprias inscrições com validação de contrato,
  consulta de outra pessoa por estudante (403) e por administrador (200),
  consulta sem token (401) e o fluxo encadeado `POST /inscricoes` → `GET` →
  `DELETE` → `GET`. Execute as pastas na ordem. `studentId`, `otherUserId` e
  `courseId` são variáveis de massa: substitua-as pelos IDs reais do ambiente.
  Se a sua história é a US05, faça o desafio antes de abrir.

## Agora é com você

No [desafio desta fase](DESAFIO.md) você escreve a coleção da sua história.
