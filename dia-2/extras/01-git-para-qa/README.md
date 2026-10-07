# 01 · Git para QA

Testes automatizados são código: versionados, revisados e integrados como qualquer outro. Referência: https://git-scm.com/book/pt-br/v2

## Fluxo que vamos usar

```bash
git checkout main
git pull                                  # sempre comece atualizado
git checkout -b testes/us04-inscricao     # uma branch por assunto
# ... escreve os testes ...
git add dia-2/extras/02-playwright/tests
git commit -m "test(us04): cobre limite de vagas na inscrição"
git push -u origin testes/us04-inscricao
# abra o pull request no GitHub
```

## Boas práticas

- **Branches com nome que explica:** `testes/us01-cadastro`, `fix/teste-instavel-login`.
- **Commits pequenos e semânticos** ([Conventional Commits](https://www.conventionalcommits.org/pt-br/)): `test:` para testes, `fix:` para correções, `chore:` para configuração.
- **Nunca suba** `node_modules/`, relatórios ou senhas reais. O [.gitignore](../../../.gitignore) já cuida dos dois primeiros.
- **Pull request com contexto:** use o [template](../../../.github/pull_request_template.md) e linke a issue do defeito que o teste cobre.
- **Code review de teste:** o teste falharia se o comportamento estivesse errado? O nome explica a regra? Depende de outro teste?

## Exercício (10 min)

1. Faça um fork deste repositório.
2. Crie a branch `testes/<seu-nome>`.
3. Ao longo do dia, faça um commit a cada teste novo e abra o PR no final.
