# 4 · Reporte de bug

Para transformar as suas anotações num relato que outra pessoa consegue
reproduzir, ou para revisar um relato antes de enviar. Material de apoio:
[dia-1/05-defeitos](../../dia-1/05-defeitos/) e o checklist de
[01-execucao-e-defeitos](../01-execucao-e-defeitos/DESAFIO.md#4-reportar-10-min).

A IA organiza o que **você** observou. Ela não viu o teste: se inventar um
passo ou um dado, o relato deixa de ser verdadeiro.

## Prompt A · Escrever o relato

**O que colar:** as suas anotações e o critério de aceite da história.

```text
Você é um QA experiente. Transforme as minhas anotações num relato de bug para
uma issue do GitHub.

Regras:
- Use somente os fatos que eu descrevi. Não invente passos, dados, mensagens
  ou status. Se faltar informação para reproduzir, não preencha: liste ao
  final, em "O que falta", as perguntas que eu preciso responder.
- O resultado obtido descreve o que aconteceu, sem hipótese sobre a causa e
  sem adjetivos.
- O resultado esperado cita a história e a regra do critério de aceite.
- Passos numerados, a partir de um estado conhecido, com os dados usados. O
  menor caminho que reproduz.
- Um defeito por relato. Se as anotações tiverem mais de um, separe.
- Severidade é o impacto no sistema (Crítica, Alta, Média ou Baixa);
  prioridade é a urgência para o negócio (Alta, Média ou Baixa). Decida as
  duas separadamente e justifique cada uma em uma frase. A prioridade é uma
  sugestão para o PO.

Formato:
Título: [Bug] [área] - [comportamento observado] - [condição]
Descrição breve:
Pré-condições:
História relacionada:
Onde a falha aparece: API | Interface (front) | As duas
Passos para reproduzir:
Resultado esperado:
Resultado obtido:
Severidade:
Prioridade sugerida:
Ambiente:
Evidências:
Informações adicionais:
Caso de teste ou charter de origem:
O que falta:

<anotacoes>
<<o que você fez, com que dados, o que esperava e o que aconteceu; ambiente e
versão do rodapé; navegador; status e corpo da resposta, se houver>>
</anotacoes>

<criterio_de_aceite>
<<cole a regra da história que foi violada>>
</criterio_de_aceite>
```

## Prompt B · Revisar um relato pronto

**O que colar:** o seu relato, ou o de quem está ao seu lado na revisão cruzada.

```text
Revise o relato de bug abaixo como alguém que vai tentar reproduzi-lo sem ter
visto o teste. Responda a cada item com "sim" ou "não" e, quando for "não",
cite o trecho e diga o que falta:

1. Dá para reproduzir só com o que está escrito?
2. Os passos são numerados e trazem os dados usados?
3. O esperado cita o critério de aceite da história?
4. O obtido descreve um fato, sem hipótese sobre a causa?
5. Há evidência (print, status HTTP, corpo da resposta)?
6. Ambiente e versão estão informados?
7. Severidade e prioridade foram pensadas separadamente e fazem sentido?
8. O título diz o comportamento observado e a condição?

Depois reescreva o relato corrigindo a forma, sem alterar nenhum fato. O que
estiver faltando fica marcado como [FALTA: ...] para eu completar.

<relato>
<<cole o relato>>
</relato>
```

## Confira antes de usar

- [ ] Todos os passos são os que você realmente executou?
- [ ] Os dados (e-mail, curso, valores) são os que você usou?
- [ ] O obtido continua dizendo o que você viu, sem ter sido suavizado?
- [ ] Você procurou nas issues se alguém já relatou o mesmo?
- [ ] Não há senha real nem dado pessoal na evidência?

## Para continuar a conversa

```text
Proponha três títulos para este bug no padrão
[Bug] [área] - [comportamento observado] - [condição] e diga qual é o mais
claro para quem lê só a lista de issues.
```

```text
Que testes de regressão eu deveria rodar depois que este bug for corrigido,
para confirmar a correção e conferir que nada em volta quebrou?
```

```text
Este bug e o que vou colar agora são o mesmo defeito ou defeitos diferentes?
Compare os passos, o esperado e o obtido.

<<cole o outro relato>>
```
