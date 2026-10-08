# Desafio 05 · Relatar os defeitos do Inscrevi

Lição desta fase: [Gestão de defeitos](README.md).

Você executou os seus casos e explorou a sua história. Cada cenário com status
**Falhou** e cada defeito anotado na sessão exploratória vira um relato que
outra pessoa consegue reproduzir sem falar com você.

## Onde relatar

No **seu fork** deste repositório, que já traz o formulário de defeito:

1. No fork, abra **Settings → General → Features** e marque **Issues** (em
   forks elas vêm desligadas).
2. Abra **Issues → New issue → Reportar bug**.

Sem fork? Escreva os relatos em `minha-sprint/05-defeitos.md`, com os mesmos
campos do formulário.

> Relate no seu fork, e não no repositório original: os defeitos do Inscrevi
> são o gabarito do curso e ficam mais divertidos quando cada pessoa os
> encontra sozinha.

## Tarefas (25 min)

1. Escolha os defeitos que você encontrou nos casos de teste, na execução de
   API e na sessão exploratória.
2. **Reproduza cada um mais uma vez**, do zero, com a pré-condição certa. Se
   não reproduzir, anote como observação, não como bug.
3. Preencha o formulário. O título segue o padrão
   **[Bug] [área] - [comportamento observado] - [condição]**.
4. Defina severidade e prioridade **separadamente**, com uma frase de
   justificativa para cada.
5. Copie o link da issue para o campo `resultado_obtido` do caso de teste.

Não encontrou nenhum defeito? Volte ao charter da sua história: todas as
histórias implementadas têm pelo menos um.

## O que você entrega

Uma issue por defeito (ou `minha-sprint/05-defeitos.md`) e o CSV de casos com o
link de cada uma.

## Confira antes de seguir

- [ ] Uma pessoa que não viu o teste consegue reproduzir só com o que está escrito?
- [ ] Os passos são numerados e trazem os dados usados (e-mail, curso, valores)?
- [ ] O esperado cita o critério de aceite da história?
- [ ] O obtido descreve um fato, sem hipótese sobre a causa?
- [ ] Há evidência anexada (print, status HTTP, corpo da resposta)?
- [ ] Ambiente e versão do rodapé estão informados?
- [ ] Severidade e prioridade foram pensadas separadamente?
- [ ] Cada issue trata de **um** defeito só?

**Revisão cruzada.** Estudando em grupo, troque um relato com outra pessoa e
tente reproduzir o bug dela seguindo só o texto. Se travar em algum passo, é
isso que falta no relato. Estudando sozinho, releia no dia seguinte.

## Fechando o dia 1

Com os casos executados e os defeitos relatados, olhe para a
[Definition of Done](../../sprint/definition-of-done.md): a sua história está
pronta? O que falta?

Próximo passo: [dia 2](../../dia-2/), onde a execução ganha IA, scripts de API
e automação.
