# Desafio 02 · A coleção da sua história

[Trilha](../../README.md#a-trilha) › [Dia 2](../README.md) › [Lição](README.md)

Lição desta fase: [Testes de API com Postman](README.md).

No dia 1 você testou a sua história pela API conferindo a resposta com os
olhos. Agora cada conferência vira um `pm.test`, e a coleção passa a rodar
sozinha.

## Material

- `minha-sprint/casos-de-teste.csv` e a sua história no
  [backlog](../../sprint/backlog.md).
- A coleção `inscrevi.postman_collection.json`, como referência de estilo.
- A documentação da API em http://localhost:3000/docs.
- O [prompt de testes de API](../prompts/05-testes-de-api.md), se quiser apoio
  de uma IA.

A homologação é compartilhada: as requisições criam contas e inscrições de
verdade. Use e-mails seus e confira a pré-condição antes de enviar. No ambiente
local, reiniciar o app devolve tudo ao estado inicial.

## Tarefas (30 min)

1. Rode a coleção pronta e anote quais testes falham. Algum bate com um bug
   que você relatou?
2. Crie na coleção uma pasta com o nome da **sua história** e adicione uma
   requisição para cada cenário do seu arquivo de casos de teste, com sucesso
   e erro.
3. Em cada requisição, escreva na aba *Scripts → Post-response* um teste para o
   status e um para o corpo:

   ```js
   pm.test('responde 409 para inscrição duplicada', () => {
     pm.response.to.have.status(409);
   });

   pm.test('explica o motivo da recusa', () => {
     pm.expect(pm.response.json().mensagem).to.eql('Você já está inscrito neste curso.');
   });
   ```

4. Se a rota exige login, use `{{token}}` no header `Authorization`, como fazem
   as requisições da pasta *04 Inscrições*.
5. Gere a massa na aba *Pre-request* (e-mail novo a cada execução) em vez de
   depender de um dado que já existe.
6. Rode a sua pasta **duas vezes seguidas**. Se a segunda execução falhar onde a
   primeira passou, algum teste depende de um dado que ele mesmo consumiu.

Para ir além:

- adicione à pasta *04 Inscrições* uma requisição que tente se inscrever em dois
  cursos com **horários sobrepostos** e verifique o **409**;
- adicione um teste que confira se, após cancelar, `vagasDisponiveis` do curso
  voltou ao valor anterior;
- rode a sua coleção com o Newman:
  `npx newman run minha-colecao.json -e dia-2/02-postman/local.postman_environment.json`.

## O que você entrega

A coleção exportada em `minha-sprint/`, com uma pasta da sua história.

## Confira antes de seguir

- [ ] O nome de cada `pm.test` diz a regra conferida, e não "teste 1"?
- [ ] Você viu cada teste falhar pelo menos uma vez (trocando o esperado)?
- [ ] Há teste para o corpo, além do status?
- [ ] A coleção passa duas vezes seguidas sem mexer em nada?
- [ ] Os testes vermelhos apontam um defeito real, com a pré-condição certa?

## Fechamento

- Alguma regra que a tela respeita falhou quando chamada direto na API?
- O status HTTP comunica corretamente o que aconteceu?
- Qual desses testes você colocaria para rodar a cada entrega?

Próxima fase: [03 · Automação com Cypress](../03-cypress/).
