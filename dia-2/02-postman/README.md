# 02 · Testes de API com Postman

Documentação oficial: https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/

Na [Parte 1](../01-execucao-e-defeitos/) você testou pela tela. Agora a mesma
história é testada direto na API, sem a interface no meio: uma regra que a tela
protege pode estar aberta para quem chama a API.

Deixe o Inscrevi no ar (`npm start`, na raiz do repositório). A documentação
das rotas fica em http://localhost:3000/docs.

## Conceitos rápidos

| Verbo | Uso no Inscrevi | Sucesso esperado |
|---|---|---|
| GET | Listar cursos | 200 |
| POST | Cadastrar, entrar, inscrever | 201 (criou) ou 200 (login) |
| DELETE | Cancelar inscrição | 204 (sem corpo) |

Faixas de status: **2xx** sucesso, **4xx** erro de quem chamou (400 dados inválidos, 401 sem login, 403 sem permissão, 404 não existe, 409 conflito com o estado atual), **5xx** erro do servidor.

## Importando

1. No Postman: **Import** e selecione os dois arquivos desta pasta.
2. No canto superior direito, escolha o ambiente **Inscrevi local**.
3. Com o app no ar (`npm start`), rode a coleção inteira com **Run collection**.

Também dá para importar direto do contrato: **Import → Link** com `http://localhost:3000/openapi.json`.

## O que observar na coleção

- **Scripts de teste** em cada requisição (aba *Scripts → Post-response*), usando `pm.test` e `pm.expect`.
- **Validação de contrato** com `pm.response.to.have.jsonSchema`.
- **Encadeamento:** o login salva o token numa variável e as próximas requisições usam `{{token}}`.
- **Massa dinâmica:** o cadastro gera um e-mail novo a cada execução (aba *Pre-request*).
- **Teste no nível da coleção:** tempo de resposta verificado em todas as requisições.

## Linha de comando com Newman

```bash
npm run test:postman
```

É o mesmo comando que roda no pipeline. Newman: https://github.com/postmanlabs/newman

## Prática (25 min, individual)

1. Rode a coleção e anote quais testes falham. Algum bate com um bug que você
   relatou na Parte 1?
2. Crie na coleção uma pasta com o nome da **sua história** e adicione uma
   requisição para cada cenário do seu arquivo de casos de teste, com sucesso e
   erro.
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

Se sobrar tempo:

- adicione à pasta *04 Inscrições* uma requisição que tente se inscrever em dois
  cursos com **horários sobrepostos** e verifique o **409**;
- adicione um teste que confira se, após cancelar, `vagasDisponiveis` do curso
  voltou ao valor anterior.

A coleção completa do dia 1, com as 31 requisições de todas as rotas, está em
[dia-1/04-execucao-de-testes/01-api](../../dia-1/04-execucao-de-testes/01-api/)
e serve de consulta.

## Fechamento

- Alguma regra que a tela respeita falhou quando chamada direto na API?
- O status HTTP comunica corretamente o que aconteceu?
- Qual desses testes você colocaria para rodar a cada entrega?

Próxima parte: [automação com Cypress](../03-cypress/).
