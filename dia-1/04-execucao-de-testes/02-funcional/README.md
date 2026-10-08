# 04.2 · Execução de testes funcionais

Base: CTFL v4.0.1, seção **4.4** (técnicas baseadas na experiência).

Na execução funcional, você valida o comportamento observável do produto pela
interface. São dois momentos que se completam:

1. **Casos roteirizados:** você executa o que planejou e registra o status.
2. **Sessão exploratória:** você **aprende, projeta e executa ao mesmo tempo**,
   guiado por uma missão. Ela costuma encontrar o que ninguém pensou em
   escrever.

## Exemplo resolvido · executando a SD01 no Sauce Demo

Abra https://www.saucedemo.com, o arquivo
[exemplo-saucedemo.csv](../../03-casos-de-teste/exemplo-saucedemo.csv) e o
DevTools (`F12`). Execute junto: o que está abaixo é o que **você** deve
conferir na sua tela.

### 1. Casos roteirizados

Para cada caso, na ordem de risco do
[plano](../../03-casos-de-teste/exemplo-plano-saucedemo.md) (CT-04 e CT-05
primeiro):

1. Monte a pré-condição (o **Dado**).
2. Execute a ação (o **Quando**) com os dados do caso.
3. Compare o que aconteceu com o **Então**.
4. Preencha `resultado_obtido` e `status`.

Dois casos preenchidos, para ver o nível de detalhe:

| id | resultado_obtido | status |
|---|---|---|
| CT-04 | Resumo mostrou "Item total: $29.99", "Tax: $2.40" e "Total: $32.39". Print: ct04-resumo.png | Passou |
| CT-06 | Com o carrinho vazio, o botão "Checkout" estava disponível e levou à tela "Checkout: Your Information". Print: ct06-checkout-vazio.png | Falhou |

Execute o CT-06 você também. Se o seu resultado for o mesmo, você acabou de
encontrar um defeito de verdade com um caso de **valor limite**: é ele que vira
relato de bug na lição de [gestão de defeitos](../../05-defeitos/).

Repare no `resultado_obtido`: ele descreve **o que apareceu**, não "funcionou"
ou "deu erro".

### 2. Sessão exploratória

Vamos usar **sessões com tempo fixo** (*session-based testing*): cada sessão
tem um **charter** (missão), um tempo limite e anotações.

Um charter tem três partes: **explore** (o alvo), **com** (os recursos) e
**para descobrir** (a informação que você busca).

> **Charter do exemplo:** explore o checkout do Sauce Demo com a conta
> `problem_user` e com dados fora do comum, para descobrir se as regras da SD01
> valem para qualquer conta e qualquer entrada.

Como conduzir:

1. Leia o charter e a história.
2. Ligue um cronômetro de **20 minutos**.
3. Explore e anote tudo na ficha: o que testou, o que achou estranho, perguntas.
4. Ao final, reveja as anotações e separe **defeitos**, **dúvidas para o PO** e
   **ideias de teste**.

Use também a **suposição de erro** (4.4.1): pense nos erros que um dev
cometeria e vá atrás deles. Ideias para começar:

- valores nas bordas e logo depois delas;
- campos vazios, só com espaços, com acentos e emojis;
- a mesma ação duas vezes seguidas (clique duplo, voltar e reenviar);
- o botão Voltar do navegador e o endereço digitado à mão;
- a mesma operação com outra conta ou sem estar logado.

Uma ficha de sessão preenchida fica assim:

```
Charter: checkout com problem_user e dados fora do comum
Testadores: (você)                   Início: 19:40   Duração: 20 min
Ambiente (navegador, SO): Chrome, Windows 11, saucedemo.com

Notas (o que testei, o que observei):
- lista de produtos com problem_user: comparei as imagens com as de standard_user
- checkout com problem_user: tentei preencher os três campos, um por vez
- Postal Code com letras, com espaços e com 200 caracteres
- abri /checkout-step-two.html direto, sem passar pelos dados
- concluí o pedido e usei o botão Voltar do navegador

Defeitos encontrados:
- (um por linha: o que fiz, o que esperava, o que apareceu)

Dúvidas para o PO:
- o Postal Code aceita qualquer texto: a SD01 deixa o formato fora de escopo,
  mas existe um tamanho máximo?

Ideias de teste para depois:
- repetir os casos CT-01 a CT-08 com error_user e visual_user
```

Faça a sessão e preencha a parte de defeitos com o que **você** observar. Só
entra na ficha o que você viu.

## Agora é com você

No [desafio](DESAFIO.md) você executa os seus casos no Inscrevi e conduz uma
sessão com o charter da sua história.
