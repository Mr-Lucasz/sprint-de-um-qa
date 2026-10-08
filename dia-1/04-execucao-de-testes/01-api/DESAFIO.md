# Desafio 04.1 · A sua história pela API

Lição desta fase: [Execução de testes de API com Postman](README.md).

A tela do Inscrevi pode estar protegendo uma regra que a API deixa passar.
Teste a sua história direto nas rotas e descubra.

## Material

- A sua história na versão refinada do [backlog](../../../sprint/backlog.md).
- A documentação da API em http://localhost:3000/docs (ou
  https://inscrevi.vercel.app/docs). Todas as 16 histórias têm rotas.
- As contas de exemplo do [README principal](../../../README.md#contas-de-exemplo).

Algumas rotas são só de administrador (cadastrar e excluir minicurso, lista de
presença, e-mails enviados): use a conta de administrador de exemplo. Os
e-mails do sistema não são enviados de verdade: ficam em `GET /emails`, visível
só para administradores.

## Tarefas (30 min)

1. No Postman, crie uma coleção com o nome da sua história e a variável
   `baseUrl`.
2. Para cada rota da história, identifique método, URL, autenticação e
   pré-condições.
3. Prepare dados válidos, inválidos e de fronteira no Body ou nos Params.
4. Execute **pelo menos cinco cenários**, incluindo sucesso e erro. Parta dos
   seus casos de teste: quais deles dá para executar sem a tela?
5. Para cada um, confira status, corpo, headers e o **efeito persistido**
   (consulte o recurso depois da operação).
6. Tente pelo menos uma coisa que a tela não deixa fazer: um valor que o
   formulário bloqueia, um recurso de outra pessoa, uma chamada sem token.
7. Guarde a resposta ou um print como evidência e registre na ficha.

Não é preciso escrever scripts de teste ainda. O foco é observar a resposta e
compará-la com o caso de teste.

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

## O que você entrega

A ficha preenchida em `minha-sprint/04-execucao-api.md` e a coleção exportada
(**⋯ → Export**) na mesma pasta.

## Confira antes de seguir

- [ ] O status HTTP comunica corretamente cada resultado?
- [ ] A API impede acesso ou alteração de dados de outra pessoa?
- [ ] O contrato documentado em `/docs` bate com o comportamento observado?
- [ ] Alguma regra que a tela respeita falhou quando chamada direto?
- [ ] Você conferiu o efeito da operação, e não só o status?

Próxima fase: [05 · Gestão de defeitos](../../05-defeitos/).
