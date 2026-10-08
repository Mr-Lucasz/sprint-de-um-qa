# Desafio 01 · Executar e reportar no Inscrevi, com IA

Lição desta fase: [Execução manual e reporte de bugs, com IA](README.md).

Você continua com a mesma história do dia 1. Se já executou os seus casos no
[desafio 04.2](../../dia-1/04-execucao-de-testes/02-funcional/DESAFIO.md), use
este para o que ficou faltando: os casos não executados, uma segunda sessão
exploratória e a revisão dos seus relatos com a IA.

## Material

- `minha-sprint/casos-de-teste.csv` e a sua história no
  [backlog](../../sprint/backlog.md).
- Os prompts de [execução](../prompts/03-execucao-de-testes.md) e de
  [reporte de bug](../prompts/04-reporte-de-bug.md).
- O Inscrevi em http://localhost:3000 (`npm start`) ou na homologação,
  https://inscrevi.vercel.app.

A pasta `app/` está liberada a partir do dia 2.

## Tarefas (40 min)

### 1. Preparar (5 min)

1. Anote o **ambiente** e a **versão** que aparecem no rodapé do Inscrevi.
2. Abra o DevTools (`F12`) na aba **Network**.
3. Peça à IA o roteiro de execução dos seus casos (prompt A de execução) e
   confira se ela não mudou nenhum resultado esperado.

### 2. Executar os cenários (15 min)

Para cada cenário, na ordem de risco:

1. Monte a pré-condição (o **Dado**).
2. Execute a ação (o **Quando**) com os dados do caso de teste.
3. Compare o que aconteceu com o **Então**.
4. Preencha `resultado_obtido` e `status` (`Passou`, `Falhou` ou `Bloqueado`).

Guarde a evidência **na hora** em que a falha aparece: um print da tela
(`Win + Shift + S`) e, quando houver, o status e o corpo da resposta na aba
Network.

### 3. Explorar (10 min)

Peça à IA ideias para o charter da sua história (prompt B de execução; os
charters estão no
[desafio 04.2](../../dia-1/04-execucao-de-testes/02-funcional/DESAFIO.md#charters)),
escolha as que fazem sentido e explore com o cronômetro ligado.

### 4. Reportar (10 min)

Cada cenário com status **Falhou** vira um bug.

1. Escreva a anotação crua do que você observou.
2. Use o prompt de reporte de bug para dar forma ao relato.
3. **Reproduza o bug seguindo o texto que a IA devolveu.** Corrija o que não
   bater.
4. Abra a issue no seu fork (**Issues → New issue → Reportar bug**), como no
   [desafio 05](../../dia-1/05-defeitos/DESAFIO.md#onde-relatar).
5. Copie o link para o campo `resultado_obtido` do caso de teste.

Um exemplo de relato curto e completo:

```text
Título: [Bug] Inscrição - aceita aluno - quando o curso está sem vagas

Pré-condições: curso "Oficina de acessibilidade web" com 0 vagas disponíveis;
conta de estudante sem inscrição nesse curso.

Passos:
1. Entrar com ana.teste01@teste.dev
2. Abrir a Programação
3. Clicar em "Inscrever-se" na Oficina de acessibilidade web

Esperado: a inscrição é recusada com a mensagem de curso lotado (US04, regra de vagas).
Obtido: a inscrição é confirmada e o curso aparece em "Minhas inscrições".
Evidência: print da programação + POST /api/inscricoes respondendo 201.
```

O exemplo é ilustrativo: o que vale é o que **você** observou.

## O que você entrega

O CSV com todos os casos executados, a ficha da sessão e uma issue por defeito.

## Confira antes de seguir

- [ ] Uma pessoa que não viu o teste consegue reproduzir só com o que está escrito?
- [ ] Os passos são numerados e trazem os dados usados (e-mail, curso, valores)?
- [ ] O esperado cita o critério de aceite da história?
- [ ] O obtido descreve um fato, sem hipótese sobre a causa?
- [ ] Há evidência anexada (print, status HTTP, corpo da resposta)?
- [ ] Ambiente e versão do rodapé estão informados?
- [ ] Severidade e prioridade foram pensadas separadamente?
- [ ] Nada no relato veio só da IA, sem você ter visto na tela?

## Fechamento

- Quantos cenários passaram, falharam e ficaram bloqueados?
- Algum bug apareceu só na sessão exploratória?
- Qual dos seus cenários você rodaria de novo a cada entrega? Guarde a
  resposta: é ele que você vai automatizar na [fase 03](../03-cypress/).

Próxima fase: [02 · Testes de API com Postman](../02-postman/).
