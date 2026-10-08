# Desafio 02 · QA de plantão no refinamento

Lição desta fase: [Análise de requisitos e técnicas de teste](README.md).

O PO trouxe 16 histórias do Inscrevi para o refinamento. **Nenhuma está
pronta**: todas chegaram como rascunho e têm problemas. Você é o "amigo do
teste" na conversa dos três amigos, e a sua história só entra na Sprint depois
que passar por você.

## Material

- Os rascunhos: [sprint/backlog-rascunho.md](../../sprint/backlog-rascunho.md).
- Os **protótipos de tela**, feitos pelo time de design a partir dos mesmos
  rascunhos: [protótipos do Inscrevi](https://claude.ai/artifact/EppH87VQmyfY2aCtzQXuov).
  Cada tela leva no título o número da história. Protótipo também é artefato
  de teste: revisá-lo é teste estático, do mesmo jeito que revisar a história.

> Não abra o [backlog refinado](../../sprint/backlog.md) ainda: ele é a
> resposta deste desafio.

## Tarefas (30 min)

1. **Escolha uma história.** Ela acompanha você em todos os desafios seguintes
   (casos de teste, plano, execução, API e automação). Sugestões para começar:
   US01, US04 ou US06.
2. Leia a história inteira: narrativa de negócio, problemática, solução,
   história e critérios de aceite.
3. Preencha a **ficha INVEST** abaixo, dando uma nota de 0 a 2 para cada letra.
4. Liste **todos os problemas** que encontrar e as **perguntas para o PO**. Para
   cada problema, indique a letra do INVEST e o trecho da história.
5. Abra o **protótipo** da história e compare com o texto: a tela mostra o que
   a história pede? Mostra algo que a história não pede? Os números, nomes e
   mensagens batem entre si?
6. Reescreva **um cenário** corrigido em Gherkin.

**Dicas para caçar problemas na história:** palavras vagas (*rapidamente*, *razoável*, *adequadamente*, *automaticamente*); números que mudam entre a solução e os cenários; o que acontece quando dá errado; quem pode fazer a ação; conflito com as regras de outra história.

**Dicas para o protótipo:** contadores que não batem com a lista; nome de pessoa ou de minicurso diferente entre partes da tela; botão habilitado quando a regra proíbe; campo sem rótulo; ação destrutiva em destaque ou sem confirmação; informação que a história pede e a tela não mostra.

### Ficha INVEST

```
História:                                Nome:

Nota: 0 = não atende · 1 = atende em parte · 2 = atende

| Letra | Nota | Justificativa |
|-------|------|---------------|
| I     |      |               |
| N     |      |               |
| V     |      |               |
| E     |      |               |
| S     |      |               |
| T     |      |               |
Total:    / 12

Problemas encontrados (letra do INVEST · trecho · por que é problema):
1.
2.
3.

Protótipo (o que a tela mostra · o que a história diz · por que é problema):
1.
2.

Perguntas para o PO:
-

Cenário reescrito:
```

## O que você entrega

A ficha preenchida, em `minha-sprint/02-refinamento.md`.

## Confira antes de seguir

- [ ] Cada problema aponta a letra do INVEST e o trecho exato da história?
- [ ] As perguntas para o PO pedem uma regra, e não um "sim" ou "não"?
- [ ] O cenário reescrito tem `Dado` com dados concretos, um `Quando` só e um
      `Então` observável?
- [ ] Você olhou o protótipo, além do texto?

Só agora abra a sua história no [backlog refinado](../../sprint/backlog.md) e
compare: o que o refinamento do time corrigiu que você não tinha visto? E o que
você viu que continua sem resposta? Daqui em diante, a versão refinada é a
referência: se o sistema se comportar diferente dela, é defeito.

**Estudando em grupo?** Duas pessoas pegam a mesma história, cada uma preenche
a própria ficha e as duas comparam os achados no final.

Próxima fase: [03 · Casos de teste e plano de teste](../03-casos-de-teste/).
