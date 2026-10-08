# 04.1 · Execução de testes de API com Postman

Base: CTFL v4.0.1, testes funcionais e teste de interfaces.

Por trás de uma tela existe uma API. Testar direto nela mostra se a regra de
negócio vale **sem a interface no meio**: uma regra que a tela protege pode
estar aberta para quem chama a API.

> **Por que esta lição não usa o Sauce Demo?** A loja não tem API pública: tudo
> acontece no navegador. Por isso o exemplo usa as rotas de **login** do
> Inscrevi (história US02), e o desafio fica com as rotas da sua história.

## O que observar numa resposta HTTP

| Parte | O que diz | Exemplo |
|---|---|---|
| Método e rota | O que foi pedido | `POST /api/login` |
| Status | O resultado, em número | `200`, `401` |
| Corpo | Os dados ou a explicação do erro | `{ "mensagem": "..." }` |
| Headers | Informações sobre a resposta | `Content-Type: application/json` |

| Verbo | Para quê | Sucesso costuma ser |
|---|---|---|
| GET | Consultar | 200 |
| POST | Criar ou executar uma ação | 201 (criou) ou 200 |
| PUT / PATCH | Alterar | 200 |
| DELETE | Remover | 204 (sem corpo) |

Faixas de status: **2xx** sucesso, **4xx** erro de quem chamou (400 dados
inválidos, 401 sem login, 403 sem permissão, 404 não existe, 409 conflito com o
estado atual), **5xx** erro do servidor.

## Exemplo resolvido · o login do Inscrevi pela API

Suba o Inscrevi (`npm start`). A API fica em `http://localhost:3000/api` e a
documentação (Swagger) em http://localhost:3000/docs. Na homologação, troque
por `https://inscrevi.vercel.app`.

### 1. Preparar o Postman

1. Crie uma coleção chamada **US02 · Login**.
2. Na coleção, aba **Variables**, crie `baseUrl` com o valor
   `http://localhost:3000/api`.

### 2. Um cenário de sucesso

- Método `POST`, URL `{{baseUrl}}/login`.
- Aba **Body → raw → JSON**:

  ```json
  { "email": "maria@inscrevi.dev", "senha": "Senha@123" }
  ```

- Envie e observe: status **200** e um campo `token` no corpo.

### 3. Um cenário de erro

Duplique a requisição e troque a senha por `senha-errada`. Observe: status
**401** e o corpo com `"mensagem": "E-mail ou senha incorretos."`.

Repare que a mensagem não diz **qual** dos dois está errado. Isso é de
propósito: confirmar que um e-mail existe ajuda quem está tentando invadir uma
conta.

### 4. Uma rota protegida

- `GET {{baseUrl}}/usuarios/me`, sem nada a mais: status **401**.
- Copie o `token` do passo 2. Na aba **Authorization**, escolha **Bearer
  Token** e cole. Envie de novo: status **200** e os dados da Maria.

### 5. Registrar

| Cenário | Entrada/pré-condição | Esperado | Obtido | Status | Evidência |
|---|---|---|---|---|---|
| Login válido | maria@inscrevi.dev / Senha@123 | 200 + token | 200, corpo com `token` | Passou | print-01.png |
| Senha errada | maria@inscrevi.dev / senha-errada | 401 + mensagem genérica | 401, "E-mail ou senha incorretos." | Passou | print-02.png |
| Rota protegida sem token | GET /usuarios/me sem header | 401 | 401 | Passou | print-03.png |
| Rota protegida com token | GET /usuarios/me com Bearer | 200 + dados da conta | 200, e-mail da Maria | Passou | print-04.png |

O esperado veio da história, não da resposta: confira a US02 no
[backlog](../../../sprint/backlog.md) e veja se a tabela acima cobre todas as
regras dela. (Não cobre. O que falta é um bom aquecimento para o desafio.)

## Checklist de um teste de API

- método, URL e coleção corretos;
- autenticação e autorização;
- status HTTP esperado;
- token enviado quando necessário;
- campos obrigatórios e tipos;
- limites e valores inválidos;
- mensagem de erro sem expor dados sensíveis;
- ausência de duplicidade;
- efeito no recurso consultado depois da operação;
- comportamento em uma segunda tentativa.

## Para ir além: a collection completa

Depois de praticar à mão, você pode rodar todas as rotas da API de uma vez, com
encadeamento de token, IDs e massa dinâmica. Importe no Postman:

- `inscrevi-api-completa.postman_collection.json`: a collection, com 31 requisições;
- `inscrevi-api-homologacao.postman_environment.json`: o ambiente que aponta
  para `https://inscrevi.vercel.app/api`.

A collection tem scripts visíveis em cada requisição, nas abas
`Scripts > Before request` e `Scripts > After response`, com um comentário em
cada linha explicando o que ela faz. O fluxo cobre usuários, login e logout,
cursos, inscrições, lista de espera, recuperação de senha, e-mails simulados,
presença e certificados.

Dois cuidados na homologação:

- a primeira requisição, `POST /test/reset`, é recusada com 403: num ambiente
  compartilhado só quem administra reinicia os dados. As demais seguem
  normalmente;
- a collection cria contas, minicursos e inscrições de verdade num sistema que
  outras pessoas estão usando.

Para rodar no terminal, contra o app local (`npm start` em outro terminal):

```bash
npm run test:postman:dia1
```

Esse comando usa o ambiente `inscrevi-api-local-run.postman_environment.json`,
que aponta para `http://localhost:3000/api`. As variáveis de ambiente mais
importantes são `baseUrl`, `emailAluno`, `senhaAluno`, `emailAdmin`,
`senhaAdmin`, `token`, `cursoId` e `inscricaoId`. Os IDs e o token são
preenchidos automaticamente pelos scripts.

> Faça o desafio **antes** de rodar a collection completa: ela mostra quais
> rotas falham, e descobrir isso é o seu trabalho.

Escrever scripts de teste e rodar com Newman é assunto do
[módulo de Postman do dia 2](../../../dia-2/02-postman/).

## Agora é com você

No [desafio](DESAFIO.md) você testa a sua história pela API.
