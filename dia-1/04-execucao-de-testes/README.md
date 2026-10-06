# 04 · Execução de testes

Nesta etapa o plano vira execução. A turma será dividida em duas frentes:

1. [Execução de testes de API](01-api/);
2. [Execução de testes funcionais](02-funcional/).

As duas frentes devem usar os mesmos critérios de aceite e registrar evidências
concretas. Ao final, comparem os resultados: um teste pode passar na API e a
interface ainda apresentar uma falha, ou o contrário.

## Antes de começar: o ambiente é compartilhado

A turma inteira testa o mesmo sistema, em https://inscrevi.vercel.app, com os
mesmos dados. Isso muda a forma de testar:

- **Criem as suas próprias contas** para os testes, em vez de usar só as contas
  de exemplo, que todo mundo conhece.
- **Não contem com o estado inicial.** Uma vaga que estava livre pode ter sido
  ocupada por outra dupla um minuto antes. Confiram a pré-condição do cenário
  antes de executar e anotem o que encontraram.
- **Os minicursos pequenos esgotam rápido.** Se precisarem de vagas de volta,
  peçam ao instrutor para reiniciar os dados.
- **Anotem o ambiente e a versão** que aparecem no rodapé do app: eles entram
  no relato de defeito.

## Dinâmica · Compartilhando evidências (10 min)

Cada dupla apresenta:

- qual história e risco priorizou;
- quais testes executou;
- qual resultado obteve;
- quais evidências coletou;
- se encontrou um defeito, uma dúvida ou uma limitação do ambiente.
