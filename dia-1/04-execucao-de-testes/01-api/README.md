# 04.1 · Execução de testes de API com Postman

Base: CTFL v4.0.1, testes funcionais e teste de interfaces.

Nesta dinâmica, valide diretamente os contratos e as regras de negócio da API
usando o **Postman**. A automação com scripts, coleções e Newman será
aprofundada no [módulo de Postman do dia 2](../../../dia-2/02-postman/).

Use a documentação Swagger em `/docs` para localizar os endpoints. No ambiente
hospedado, a API está em `https://inscrevi.vercel.app/api`; no ambiente local,
em `http://localhost:3000/api`.

## Dinâmica · Validando o contrato da API (25 min)

Cada pessoa testa a **sua história** pela API, usando a versão refinada do
[backlog](../../../sprint/backlog.md). Todas as 16 histórias têm rotas na API;
a documentação em `/docs` mostra quais.

Algumas rotas são só de administrador (cadastrar e excluir minicurso, lista de
presença, e-mails enviados). Para testá-las, use a conta de administrador de
exemplo, que está no [README](../../../README.md). Os e-mails do sistema não são
enviados de verdade: ficam em `GET /emails`, visível só para administradores.

1. Abram o Postman e criem uma requisição para o endpoint escolhido.
2. Identifiquem método HTTP, URL, autenticação e pré-condições.
3. Preparem dados válidos, inválidos e de fronteira no Body ou Params.
4. Executem pelo menos cinco cenários, incluindo sucesso e erro.
5. Confiram status, corpo, headers e efeito persistido.
6. Guardem a resposta ou um print do Postman como evidência.
7. Classifiquem o resultado como passou, falhou ou bloqueado.

### Fluxo sugerido no Postman

1. Criem uma coleção com o nome da história.
2. Criem uma variável `baseUrl` para o ambiente escolhido.
3. Organizem as requisições por cenário ou operação.
4. Para endpoints protegidos, façam login e usem o token no header
   `Authorization`.
5. Enviem cada requisição e registrem o resultado na ficha abaixo.

Nesta primeira execução, não é necessário escrever scripts de teste. O foco é
aprender a observar a resposta da API e comparar o comportamento com o caso de
teste e o plano de teste.

## Checklist mínimo

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

## Ficha de execução

```text
História:
Endpoint:
Método:
Ambiente:
Testadores:

| Cenário | Entrada/pré-condição | Esperado | Obtido | Status | Evidência |
|---------|----------------------|----------|--------|--------|-----------|
|         |                      |          |        |        |           |
```

## Discussão

- O status HTTP comunica corretamente o resultado?
- A API impede acesso ou alteração de dados de outra pessoa?
- O contrato documentado bate com o comportamento observado?
- O que deve virar script de teste ou coleção automatizada no dia 2?

Se houver falha, registre-a na dinâmica de [gestão de
defeitos](../../05-defeitos/).
