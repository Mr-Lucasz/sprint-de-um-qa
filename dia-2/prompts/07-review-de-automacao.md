# 7 · Review de código de teste automatizado

Para revisar o seu teste antes de dar por pronto, ou o teste de outra pessoa
num pull request. Checklist da lição:
[03-cypress](../03-cypress/DESAFIO.md#confira-antes-de-seguir).

**O que colar:** o arquivo de teste, o cenário que ele deveria cobrir e, se
houver, os comandos customizados ou os passos que ele usa.

## Prompt

```text
Você é um QA sênior fazendo code review de um teste automatizado, seguindo as
boas práticas oficiais do Cypress
(https://docs.cypress.io/app/core-concepts/best-practices).

Um teste vale pelo que ele pega quando o sistema quebra. Revise nesta ordem:

1. O teste confere a coisa certa?
   - Tem asserção, e ela falharia se o comportamento estivesse errado?
   - O esperado bate com o cenário, ou foi ajustado ao que o sistema faz hoje
     (asserção trocada, .skip, failOnStatusCode: false sem conferir o status)?
   - O nome diz a regra? Cobre erro e borda, ou só o caminho feliz?

2. É confiável?
   - Há cy.wait com número?
   - Depende de outro teste, da ordem de execução ou de um dado que já
     existia no ambiente?
   - Usa dado fixo que colide numa segunda execução ou com outra pessoa?

3. É fácil de manter?
   - Seletor por classe CSS, posição ou XPath, em vez de data-testid ou texto
     visível?
   - Pré-condição montada pela tela quando dava para montar pela API?
   - Repetição que cabe num beforeEach ou comando customizado? Ou o inverso:
     abstração que esconde o que o teste faz?
   - Em Gherkin: passo com detalhe de interface, Quando com várias ações,
     Então sem resultado observável?
   - Senha ou token real no código? URL fixa em vez do baseUrl?

Regras da revisão:
- Aponte só o que tem consequência e explique o porquê em uma frase. Gosto
  pessoal de estilo fica de fora.
- Se o teste está vermelho porque o sistema tem um defeito, ele está certo:
  não sugira mudança para fazê-lo passar.
- Você não está vendo a tela nem rodando o teste. Quando um ponto for
  suspeita e não certeza, diga, e diga como eu confirmo.
- Diga também o que está bom e deve ser mantido.

Formato:
1. Veredito em uma linha: aprovado, aprovado com ajustes ou precisa mudar.
2. Tabela: Gravidade | Linha | Problema | Por que importa | Sugestão.
   Gravidade: Bloqueia (não confere o que diz ou não consegue falhar),
   Importante (instável ou dependente) ou Melhoria (manutenção e leitura).
3. O que está bom.
4. O trecho corrigido, apenas das partes com problema.

<cenario>
<<o caso de teste ou a regra da história que o teste cobre>>
</cenario>

<teste>
<<cole o arquivo de teste>>
</teste>

<apoio>
<<opcional: comandos customizados, step definitions ou fixtures que ele usa>>
</apoio>
```

Para Playwright ou para scripts do Postman, troque a primeira frase pela
ferramenta e pela referência dela (https://playwright.dev/docs/best-practices
ou https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/).

## Confira antes de usar

- [ ] O problema apontado existe mesmo na linha citada?
- [ ] A sugestão mantém o que o teste conferia, ou enfraqueceu a asserção?
- [ ] Depois de aplicar a mudança, você rodou o teste de novo?
- [ ] Algum seletor sugerido foi inventado?

## Para continuar a conversa

```text
Este teste falha de vez em quando e passa quando rodo de novo. Com base no
código, liste as causas prováveis de instabilidade, da mais provável para a
menos, e como eu confirmo cada uma.
```

```text
Para cada it deste arquivo, diga qual defeito ele pegaria e qual defeito
parecido passaria sem ele perceber.
```

```text
Transforme esta revisão em comentários curtos de pull request, um por achado,
em tom de colega: o problema, o motivo e a sugestão.
```
