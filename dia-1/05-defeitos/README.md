# 05 · Gestão de defeitos

Base: CTFL v4.0.1, seção **5.5**.

Um relato de defeito serve para três coisas: dar a quem corrige **informação suficiente para reproduzir**, permitir **acompanhar** a qualidade do produto e gerar **ideias de melhoria** do processo.

## O que um bom relato contém

Alinhado ao conteúdo sugerido pelo syllabus:

| Campo | Para quê |
|---|---|
| Identificador e título | Achar e entender o problema só pelo título |
| Objeto de teste e ambiente | Saber **onde** e **em que versão/configuração** aconteceu |
| Contexto | Qual caso de teste, charter ou história estava sendo testado |
| Passos para reproduzir | Sequência mínima e numerada, com dados concretos |
| Resultado esperado × obtido | A diferença que caracteriza o defeito |
| Evidências | Prints, vídeo, logs, resposta da API |
| Severidade | Impacto no sistema |
| Prioridade | Urgência da correção para o negócio |
| Status | Em que ponto do ciclo de vida está |
| Referências | Links para o caso de teste e a história |

## Severidade × prioridade

São coisas diferentes. **Severidade** é técnica (quanto o defeito afeta o sistema). **Prioridade** é de negócio (quão rápido precisa ser corrigido), normalmente decidida com o PO.

| Exemplo | Severidade | Prioridade |
|---|---|---|
| Nome da loja com erro de digitação na página inicial na véspera de uma campanha | Baixa | Alta |
| Falha rara num relatório administrativo que ninguém usa este mês | Alta | Baixa |

## Ciclo de vida (exemplo)

```
Novo → Em triagem → Aberto → Em correção → Pronto para teste → Fechado
                 ↘ Rejeitado / Duplicado              ↘ Reaberto
```

## Escrevendo bem

| Evite | Prefira |
|---|---|
| "Checkout não funciona" | "Checkout inicia com o carrinho vazio" |
| "Deu erro" | "A tela mostra 'Error' sem dizer o que corrigir" |
| "Testei e quebrou" | Passos numerados com os dados usados |
| Opinião ("o dev esqueceu de validar") | Fato observado (o que fez, o que esperava, o que aconteceu) |

O título segue o padrão **[Bug] [área] - [comportamento observado] - [condição]**.

## Exemplo resolvido · o bug do CT-06 no Sauce Demo

Na [lição de execução](../04-execucao-de-testes/02-funcional/), o caso CT-06 da
SD01 falhou. Veja o relato nascer em três versões.

**Primeira tentativa (ruim):**

```text
Título: Bug no carrinho
O checkout está com problema quando não tem nada. Acho que esqueceram de
validar. Favor corrigir urgente.
```

Quem lê não sabe o que fazer para ver o problema, o que era esperado nem onde
aconteceu. E há uma hipótese sobre a causa no lugar do fato.

**Segunda tentativa (melhor, ainda incompleta):**

```text
Título: Checkout funciona com carrinho vazio
Entrei no site, fui no carrinho sem adicionar nada e cliquei em checkout.
Deixou continuar. Não deveria.
```

Já dá para reproduzir, mas faltam a conta usada, o ambiente, a regra que diz
"não deveria" e a evidência.

**Versão final:**

```text
Título: [Bug] Checkout - inicia e conclui o pedido - quando o carrinho está vazio

Descrição breve:
Com o carrinho vazio, o botão "Checkout" leva à tela de dados de entrega e o
pedido pode ser concluído sem nenhum produto.

Ambiente: https://www.saucedemo.com · Chrome · Windows 11
Contexto: caso de teste CT-06, história SD01 (regra 3)

Pré-condições:
- conta standard_user
- carrinho vazio (sem contador no ícone)

Passos para reproduzir:
1. Entrar com standard_user / secret_sauce
2. Clicar no ícone do carrinho, sem adicionar nenhum produto
3. Clicar em "Checkout"
4. Preencher Ana / Lima / 89219-710 e clicar em "Continue"
5. Clicar em "Finish"

Resultado esperado:
No passo 3, o checkout não inicia (SD01, regra 3: só é possível iniciar o
checkout com pelo menos um item no carrinho).

Resultado obtido:
O passo 3 abre "Checkout: Your Information". O resumo mostra "Item total: $0",
e o passo 5 exibe "Thank you for your order!".

Evidências: ct06-carrinho-vazio.png, ct06-resumo-zero.png, ct06-concluido.png

Severidade: Média. Nenhum dado é corrompido e não há cobrança, mas o sistema
registra um pedido inválido.
Prioridade: a definir com o PO. Sugestão: média, pois o caminho exige uma ação
incomum e não bloqueia quem compra normalmente.
```

O que a versão final tem que as outras não tinham:

- o **título** diz a área, o que acontece e em que condição;
- os **passos** começam do zero e trazem os dados usados;
- o **esperado** cita a regra da história, e não a opinião de quem testou;
- o **obtido** é um fato, com o texto que apareceu na tela;
- **severidade** e **prioridade** têm justificativa separada.

Execute os passos você mesmo antes de aceitar o relato: é assim que se revisa
o bug de outra pessoa.

## Agora é com você

No [desafio desta fase](DESAFIO.md) você relata os defeitos que encontrou no
Inscrevi.
