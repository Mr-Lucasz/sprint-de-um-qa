# 02 · Testes de API com Postman

Documentação oficial: https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/

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

## Exercício (20 min)

1. Rode a coleção e anote quais testes falham. Algum bate com os defeitos que você relatou ontem?
2. Adicione à pasta *04 Inscrições* uma requisição que tente se inscrever em dois cursos com **horários sobrepostos** e verifique o **409**.
3. Adicione um teste que confira se, após cancelar, `vagasDisponiveis` do curso voltou ao valor anterior.
