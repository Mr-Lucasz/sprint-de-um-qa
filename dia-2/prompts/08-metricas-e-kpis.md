# 8 · Métricas e KPIs de qualidade

Para transformar o resultado do seu trabalho em números e numa recomendação:
a história está pronta? Material de apoio:
[métricas de qualidade](../../dia-1/01-fundamentos/) e a
[Definition of Done](../../sprint/definition-of-done.md).

A IA erra conta. Peça sempre o numerador e o denominador, e confira.

**O que colar:** o seu CSV de casos com `status` preenchido, a lista dos bugs
que você abriu (título, história, severidade, prioridade, aberto ou fechado) e
o resultado dos testes automatizados.

Para listar os bugs do seu repositório pela linha de comando:

```bash
gh issue list --repo Mr-Lucasz/sprint-de-um-qa --label defeito --state all --limit 200
```

## Prompt A · Indicadores da minha história

```text
Você é um QA Lead preparando o resumo de qualidade de uma história ao fim da
Sprint. Calcule os indicadores abaixo com os dados que vou colar.

Indicadores:
- Progresso da execução = casos executados ÷ casos planejados
- Taxa de aprovação = casos que passaram ÷ casos executados
- Casos bloqueados = bloqueados ÷ planejados, com o motivo
- Cobertura de requisitos = regras da história com pelo menos um caso
  executado ÷ total de regras
- Defeitos por severidade (Crítica, Alta, Média, Baixa)
- Defeitos abertos × fechados, destacando críticos e altos abertos
- Defeitos encontrados pelos casos roteirizados × pela sessão exploratória
- Cobertura de automação = cenários automatizados ÷ cenários planejados
- Aprovação da automação = testes verdes ÷ testes rodados

Regras:
- Mostre sempre numerador, denominador e percentual, por exemplo "7/9 · 78%".
- Use só os dados que eu colei. Quando faltar dado para um indicador, escreva
  "sem dados" e diga o que eu precisaria informar. Não estime.
- Para cada indicador, uma frase de leitura: o que ele diz sobre esta
  história, e o que ele não permite concluir.
- Teste automatizado vermelho que aponta um defeito já relatado não é teste
  quebrado: conte separado.

Formato:
1. Tabela: Indicador | Valor | Leitura.
2. Os três maiores riscos para a entrega, cada um com o dado que o sustenta.
3. O que não foi possível medir.

<regras_da_historia>
<<cole as regras da sua história>>
</regras_da_historia>

<casos>
<<cole o seu CSV de casos com resultado_obtido e status>>
</casos>

<defeitos>
<<cole a lista de bugs: título, severidade, prioridade, estado, origem>>
</defeitos>

<automacao>
<<cole o resumo do npx cypress run ou do Newman; ou "não automatizei">>
</automacao>
```

## Prompt B · Pronta ou não? (Definition of Done)

Use na mesma conversa, depois do Prompt A.

```text
Agora confira a história contra a Definition of Done abaixo. Para cada item,
responda "atende", "não atende" ou "sem evidência", citando o dado que
sustenta a resposta. Item sem evidência não está atendido.

Feche com a recomendação, em uma destas três formas, e o motivo principal:
- Pronta
- Pronta com ressalvas (liste quais)
- Não pronta (liste o que falta)

<definition_of_done>
- Todos os critérios de aceite foram verificados e têm evidência (caso de
  teste executado ou teste automatizado).
- Os cenários principais e os de borda (valores limite, partições inválidas)
  foram testados.
- Não há defeitos abertos de severidade crítica ou alta ligados à história.
- Defeitos de severidade média ou baixa estão registrados como issues e
  priorizados com o PO.
- Os testes automatizados da história rodam no pipeline e estão verdes.
- A API está documentada no Swagger (/docs) e o comportamento bate com a
  documentação.
- As telas novas podem ser usadas só pelo teclado e todos os campos têm
  rótulo.
</definition_of_done>
```

## Prompt C · Resumo para o time

```text
Escreva o resumo de qualidade desta história para a reunião de revisão da
Sprint, em no máximo 8 linhas, para quem não é de teste (PO e
desenvolvimento): o que foi testado, o que foi encontrado, o que continua em
aberto e a recomendação. Sem jargão, com os números principais e sem apontar
culpados.
```

## Confira antes de usar

- [ ] Refaça à mão pelo menos duas contas. Os totais batem com o seu CSV?
- [ ] O número de regras da história está certo?
- [ ] Algum indicador foi calculado sem dado (estimado)?
- [ ] A leitura faz sentido? Poucos bugs com pouca cobertura não é qualidade,
      é falta de teste.
- [ ] A recomendação decorre dos dados, ou só soa bem?

## Para continuar a conversa

```text
Se eu tivesse mais 30 minutos de teste, onde eles reduziriam mais o risco
desta história? Use os indicadores para justificar.
```

```text
Agrupe os defeitos por causa provável (regra não implementada, validação só na
tela, permissão, mensagem) e diga o que o padrão sugere para a próxima Sprint.
Marque como hipótese o que não dá para afirmar só pelos relatos.
```
