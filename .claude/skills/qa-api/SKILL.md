---
name: qa-api
description: Planeja e escreve testes de API para uma história do Inscrevi, como requisições do Postman com scripts pm.test, e pode executá-los contra a API para dizer o que passa e o que falha. Use quando pedirem teste de API, Postman, Newman, validação de status, contrato ou schema, ou "testa essa rota" (ex.: "cria os testes de API da US06", "a regra de vagas vale direto na API?").
---

# Testes de API

A pergunta que guia o teste de API: a regra vale sem a tela? Uma regra que a
interface protege pode estar aberta para quem chama a API direto.

## Entrada

- A história (`USxx`) ou a rota. Regras em `sprint/backlog.md`; contrato em
  `app/openapi.json` (também em https://inscrevi.vercel.app/openapi.json e
  `/docs`).
- Ambiente: `{{baseUrl}}` é `https://inscrevi.vercel.app/api` na homologação e
  `http://localhost:3000/api` no local.

## Como montar a cobertura

Para cada rota da história, passe por estas seis frentes e escreva só os
testes que a história justifica:

| Frente | O que conferir |
|---|---|
| Sucesso | Status certo (201 criou, 200 leu, 204 sem corpo) e corpo com os campos do contrato |
| Dados | Obrigatórios ausentes, tipos errados, valores limite e partições inválidas → 400 |
| Autenticação | Sem token ou com token inválido → 401 |
| Autorização | Token de outra pessoa ou de perfil sem permissão → 403; recurso de outra pessoa não vaza |
| Estado | Duplicidade, sem vagas, conflito de horário → 409; recurso inexistente → 404 |
| Contrato | Schema da resposta, mensagem de erro que explica o motivo, nenhum dado sensível (senha, hash) no corpo |

O status esperado vem do backlog e do contrato. Quando os dois divergem, isso
é um achado: registre e pergunte, não escolha um.

## Como escrever no Postman

- Uma pasta com o nome da história; uma requisição por cenário, com nome que
  diz a regra (`POST inscrições · recusa curso sem vagas`).
- Scripts em *Scripts → Post-response*, um `pm.test` por verificação:

  ```js
  pm.test('responde 409 para inscrição duplicada', () => {
    pm.response.to.have.status(409);
  });

  pm.test('explica o motivo da recusa', () => {
    pm.expect(pm.response.json().mensagem).to.eql('Você já está inscrito neste curso.');
  });
  ```

- Contrato com `pm.response.to.have.jsonSchema(schema)`.
- Encadeamento: o login grava o token (`pm.environment.set('token', ...)`) e
  as rotas protegidas usam `Authorization: Bearer {{token}}`.
- Massa dinâmica no *Pre-request*: e-mail novo a cada execução, para o teste
  não depender do que já existe.
- Cada requisição cria a própria pré-condição ou depende só de uma anterior da
  mesma pasta, em ordem explícita.

Siga o estilo de `dia-2/02-postman/inscrevi.postman_collection.json`. Para
entregar, gere o JSON da pasta (Collection v2.1) ou acrescente à coleção se
pedirem; não altere as requisições que já existem.

## Executando

- Local: `npm start` num terminal e `npm run test:postman` em outro.
- Para conferir uma regra rapidamente, chame a API direto (curl ou a
  ferramenta de API disponível na sessão) e mostre método, rota, corpo
  enviado, status e corpo recebido.
- Na homologação os dados são compartilhados: use e-mails próprios, não chame
  `POST /test/reset` (responde 403 e não é para aluno) e não apague o que não
  criou. Tempo de resposta lento ali é do ambiente, não do produto.

## Saída

1. Tabela de cobertura: cenário · método e rota · status esperado · frente.
2. As requisições com os scripts.
3. Se executou: o que passou, o que falhou e, para cada falha, se é do produto
   (vira bug, com a skill `qa-bug`) ou do ambiente, com a evidência.
