# 5 · Testes de API

Para planejar os testes de API da sua história e escrever os scripts do
Postman. Lição e desafio: [02-postman](../02-postman/).

**O que colar:** a sua história e a documentação das rotas dela. Copie da
página https://inscrevi.vercel.app/docs ou do contrato em
https://inscrevi.vercel.app/openapi.json apenas as rotas que a história usa.

## Prompt A · O que testar

```text
Você é um QA especialista em testes de API. A API do Inscrevi fica em
https://inscrevi.vercel.app/api e as rotas protegidas recebem o header
Authorization: Bearer <token>, obtido no login.

A partir da história e do contrato abaixo, monte a lista de testes de API. A
pergunta que guia o trabalho é: a regra vale mesmo sem a tela?

Passe por estas frentes e inclua só o que a história justifica:
- Sucesso: status correto e corpo com os campos do contrato.
- Dados: campo obrigatório ausente, tipo errado, valores limite e partições
  inválidas.
- Autenticação: sem token e com token inválido.
- Autorização: token de outra pessoa ou de um perfil sem permissão; dados de
  outra pessoa não podem vazar.
- Estado: duplicidade, conflito, recurso que não existe.
- Contrato: formato da resposta, mensagem de erro que explica o motivo e
  nenhum dado sensível (senha) no corpo.

Limites:
- O status esperado vem da história e do contrato. Se os dois divergirem, ou
  se o status de um cenário não estiver definido, não escolha: liste como
  dúvida.
- Não invente rotas, campos ou mensagens.

Formato: tabela com # | Cenário | Método e rota | Corpo enviado | Pré-condição |
Status esperado | O que conferir no corpo | Frente. Depois, as dúvidas.

<historia>
<<cole aqui a sua história>>
</historia>

<contrato>
<<cole aqui as rotas da sua história>>
</contrato>
```

## Prompt B · Scripts do Postman

Use na mesma conversa, escolhendo os cenários da tabela.

```text
Escreva os scripts de teste do Postman para os cenários <<números>> da tabela.

Para cada requisição, entregue: nome (dizendo a regra), método, URL usando
{{baseUrl}}, headers, corpo, script de Pre-request (se precisar) e script de
Post-response.

Regras:
- Um pm.test por verificação, com nome que diz o que está sendo conferido.
  Confira o status e também o corpo.
- Rotas protegidas usam Authorization: Bearer {{token}}. O login grava o
  token com pm.environment.set('token', ...).
- Dados que não podem se repetir (e-mail) são gerados no Pre-request e
  guardados em variável, porque o ambiente é compartilhado.
- Valide o formato da resposta de sucesso com
  pm.response.to.have.jsonSchema(schema).
- Não confira tempo de resposta: a rede varia.

Exemplo do estilo:

pm.test('responde 409 para inscrição duplicada', () => {
  pm.response.to.have.status(409);
});
```

## Prompt C · Entender uma resposta

**O que colar:** a requisição que você enviou e a resposta que recebeu. Troque
o token por `<token>` antes de colar.

```text
Enviei a requisição abaixo e recebi esta resposta. Compare com a regra da
história e responda:
1. O status HTTP comunica corretamente o que aconteceu? Qual seria o esperado
   e por quê?
2. O corpo ajuda quem chamou a entender o problema?
3. Isso é defeito do produto, problema do ambiente compartilhado ou erro na
   minha requisição? O que eu devo conferir para ter certeza?

<regra>
<<cole a regra da história>>
</regra>

<requisicao>
<<método, rota, headers sem o token, corpo>>
</requisicao>

<resposta>
<<status e corpo>>
</resposta>
```

## Confira antes de usar

- [ ] As rotas e os campos existem na documentação (`/docs`)?
- [ ] O status esperado está na história ou no contrato, ou foi suposto?
- [ ] Cada teste falharia se a regra fosse quebrada?
- [ ] A requisição cria os próprios dados, sem depender do que já existe?
- [ ] Você rodou o script e viu o teste passar **e** falhar quando deveria?

## Para continuar a conversa

```text
Quais destes testes de API eu colocaria para rodar a cada entrega, e quais só
fazem sentido uma vez? Justifique.
```

```text
Reescreva o teste do cenário <<n>> com cy.request, do Cypress, mantendo as
mesmas verificações.
```
