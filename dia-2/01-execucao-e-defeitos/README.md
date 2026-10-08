# 01 · Execução manual e reporte de bugs, com IA

[Trilha](../../README.md#a-trilha) › [Dia 2](../README.md) › [Desafio](DESAFIO.md)

Base: CTFL v4.0.1, seções **4.4** (técnicas baseadas na experiência) e **5.5**
(gestão de defeitos).

A teoria de execução e de defeitos está no dia 1 e não se repete aqui:

- [Execução de testes funcionais](../../dia-1/04-execucao-de-testes/02-funcional/): casos roteirizados, charters e ficha da sessão;
- [Gestão de defeitos](../../dia-1/05-defeitos/): o que um bom relato contém, severidade e prioridade.

Esta lição refaz o mesmo ciclo com uma **IA de chat como apoio**, no Sauce
Demo. A IA não vê a sua tela: quem executa é você. Ela ajuda **antes**
(roteiro, massa, ideias) e **depois** (interpretar e redigir).

## Três regras para usar IA em teste

**A IA sugere, você decide.** Ela inventa regras, mensagens de erro e seletores
com a mesma segurança com que acerta. O que vale é a história e o que você
observou no sistema.

**Não cole dado sigiloso.** Nada de senha real, token, dado pessoal ou código de
cliente. As contas do Sauce Demo e as de exemplo do Inscrevi são públicas.

**Não peça para o teste passar.** Se um teste falhou porque o sistema tem um
defeito, ele está certo.

## Exemplo resolvido · o ciclo da SD01 com IA

Material: a história [SD01](../../dia-1/02-requisitos/exemplo-saucedemo.md) e
os casos de [exemplo-saucedemo.csv](../../dia-1/03-casos-de-teste/exemplo-saucedemo.csv).
Os prompts completos estão em [prompts](../prompts/); aqui vai a versão curta
de cada um, já adaptada ao Sauce Demo.

### 1. Dar o contexto

Toda conversa começa dizendo à IA qual é o sistema e quais são os limites:

```text
Contexto: sou QA testando o Sauce Demo (https://www.saucedemo.com), uma loja
de demonstração. As regras são as da história que vou colar: não invente
regras, mensagens ou valores que não estejam nela. Quando faltar informação,
liste como dúvida para o PO. Responda em português.
```

### 2. Pedir o roteiro de execução

```text
Monte um roteiro para executar os casos abaixo à mão: ordene pelo risco, agrupe
os que têm a mesma pré-condição e diga qual evidência guardar em cada um. Não
altere o resultado esperado dos casos.

<historia> (cole a SD01 refinada) </historia>
<casos> (cole o CSV) </casos>
```

**Confira na resposta:** a ordem bate com o risco do
[plano](../../dia-1/03-casos-de-teste/exemplo-plano-saucedemo.md)? A IA mudou
algum esperado? Inventou alguma regra (por exemplo, um formato para o Postal
Code, que a SD01 deixa fora de escopo)?

### 3. Executar (você, não a IA)

Execute os casos no navegador, com o DevTools aberto, e preencha
`resultado_obtido` e `status`. O CT-06 falha: com o carrinho vazio, o checkout
inicia.

### 4. Pedir ideias para a sessão exploratória

```text
Vou fazer uma sessão exploratória de 15 minutos com este charter: "explore o
checkout do Sauce Demo com a conta problem_user e com dados fora do comum, para
descobrir se as regras da SD01 valem para qualquer conta e entrada". Liste até
10 ideias de teste usando suposição de erro, da mais promissora para a menos.
Para cada uma: o que fazer, o que observar e qual regra ela põe à prova.
```

**Confira na resposta:** descarte as ideias que dependem de algo que a loja não
tem (pagamento, frete, cadastro). Elas mostram a IA tratando o Sauce Demo como
uma loja genérica.

### 5. Transformar a anotação em relato

A sua anotação crua do CT-06:

```text
carrinho vazio, cliquei checkout, abriu a tela de dados. preenchi e finalizei,
deu thank you. standard_user, chrome.
```

O prompt:

```text
Transforme a anotação abaixo num relato de defeito com: título no padrão
"[Bug] [área] - [comportamento observado] - [condição]", pré-condições, passos
numerados, resultado esperado (citando a regra da história), resultado obtido
e sugestão de severidade com justificativa. Use só os fatos da anotação: se
faltar algo para reproduzir, pergunte em vez de completar.

<historia> (cole a SD01 refinada) </historia>
<anotacao> (cole a anotação) </anotacao>
```

Compare a resposta com o
[relato final da lição de defeitos](../../dia-1/05-defeitos/README.md#exemplo-resolvido--o-bug-do-ct-06-no-sauce-demo).

**Confira na resposta:**

- [ ] Os passos reproduzem o bug quando **você** os executa do zero?
- [ ] O esperado cita a regra 3 da SD01, e não uma regra inventada?
- [ ] O obtido tem só o que você viu? A IA costuma acrescentar uma causa
      provável: apague.
- [ ] A severidade tem justificativa que você assinaria?

### O que a IA fez bem e o que não fez

| Ajudou | Não substituiu |
|---|---|
| Ordenar e agrupar os casos | Executar e observar a tela |
| Ter ideias que você não teria | Decidir quais ideias fazem sentido neste sistema |
| Dar forma ao relato | Garantir que o relato é verdadeiro e reproduzível |

## Agora é com você

No [desafio desta fase](DESAFIO.md) você refaz o ciclo na sua história do
Inscrevi.
