# Exemplo · Plano de teste da SD01 (Sauce Demo)

O [template](plano-de-teste.md) preenchido para a história
[SD01 · Finalizar compra](../02-requisitos/exemplo-saucedemo.md), com os casos
de [exemplo-saucedemo.csv](exemplo-saucedemo.csv).

```text
Plano: Checkout do Sauce Demo             Data: (dia da execução)
História / versão: SD01 · Finalizar compra, versão refinada
Responsáveis: (você)

Objetivo:
Verificar se uma pessoa logada consegue concluir um pedido com os valores
corretos e se o checkout recusa o que as regras 1 e 3 proíbem.

Escopo (o que será testado):
- campos obrigatórios da entrega (regra 1)
- subtotal, imposto de 8% e total no resumo (regra 2)
- checkout com o carrinho vazio (regra 3)
- confirmação do pedido e carrinho esvaziado (regra 4)

Fora de escopo:
- login e ordenação dos produtos (outras histórias)
- formato do Postal Code, pagamento e frete (fora do escopo da SD01)
- contas problem_user, error_user e visual_user: ficam para a sessão exploratória

Riscos e prioridades:
| Risco | Impacto | Probabilidade | Prioridade | Resposta |
|-------|---------|---------------|------------|----------|
| Total cobrado errado | Alto: prejuízo para o cliente ou para a loja | Média: há cálculo e arredondamento | 1 | CT-04 e CT-05 primeiro |
| Pedido concluído sem itens | Médio: pedido inválido na operação | Média: cenário ausente do rascunho | 2 | CT-06 |
| Pedido aceito sem dados de entrega | Médio: entrega impossível | Baixa: validação simples | 3 | CT-01 a CT-03 |
| Carrinho não esvazia depois do pedido | Baixo: confunde, não gera cobrança | Baixa | 4 | CT-07 |

Abordagem e tipos de teste:
- funcional, caixa-preta, pela interface (a loja não tem API pública)
- casos roteirizados (CT-01 a CT-08) seguidos de uma sessão exploratória de 20 min
- técnicas: tabela de decisão nos campos, valor limite no carrinho (0, 1 e 6 itens)

Ambiente e configuração:
- https://www.saucedemo.com, Chrome atualizado, janela de 1366x768
- o site é público e não guarda pedidos: cada login começa com o carrinho vazio

Dados e pré-condições:
- conta standard_user / secret_sauce
- entrega: Ana / Lima / 89219-710
- preços conferidos na lista de produtos antes de calcular o esperado

Casos de teste relacionados:
- CT-01 a CT-08 em exemplo-saucedemo.csv

Evidências esperadas:
- print da tela do resumo com os três valores (CT-04, CT-05)
- print da mensagem de erro de cada campo (CT-01 a CT-03)
- print da tela alcançada com o carrinho vazio (CT-06)

Critérios de entrada:
- história refinada e site no ar
- login com standard_user funcionando (smoke test)

Critérios de saída:
- 100% dos casos executados, com status e evidência
- nenhum defeito de severidade alta em aberto nas regras 2 e 3
- defeitos encontrados relatados com passos reproduzíveis

Bloqueios e dependências:
- site fora do ar bloqueia toda a execução
- se o login falhar, todos os casos ficam bloqueados (não falhos)
```

## O que observar neste plano

- **O risco manda na ordem.** O cálculo do total vem antes dos campos
  obrigatórios porque errar o valor custa mais caro.
- **Fora de escopo é decisão, não esquecimento.** O formato do Postal Code está
  fora porque a história diz que está. Se você achar isso arriscado, vira
  pergunta para o PO, não caso de teste.
- **O esperado foi calculado antes de executar.** $129.94 × 8% = $10.3952, que
  vira $10.40. Quem calcula depois de ver a tela tende a concordar com ela.
- **Bloqueado é diferente de falho.** O plano já diz o que bloqueia a execução.
