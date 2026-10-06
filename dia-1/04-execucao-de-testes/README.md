# 04 · Execução de testes

Nesta etapa o plano vira execução. Há dois caminhos para executar os cenários
da sua história:

1. [pela API](01-api/), com o Postman;
2. [pela interface](02-funcional/), com um charter de teste exploratório.

Os dois usam os mesmos critérios de aceite e precisam de evidências concretas.
Um teste pode passar na API e a interface ainda apresentar uma falha, ou o
contrário.

## Prática da Parte 3 · Executar e relatar (25 min, individual)

1. Execute os cenários que você escreveu na Parte 2, pela tela ou pela API.
2. Explore com o charter da sua história (a tabela está em
   [02-funcional](02-funcional/)).
3. Preencha `resultado_obtido` e `status` (`Passou`, `Falhou` ou `Bloqueado`) no
   seu arquivo de casos de teste.
4. Para cada cenário que falhou, abra um relato pelo formulário de defeito,
   como explica [05 · Gestão de defeitos](../05-defeitos/).
5. Revise o relato de outra pessoa.

Em 25 minutos não dá para percorrer os dois caminhos inteiros. Escolha o que
faz mais sentido para a sua história e use os tempos indicados nos roteiros de
API e de execução funcional como referência para estudar depois. O que não der
tempo de relatar em aula pode ser registrado até o início do dia 2.

## Antes de começar: o ambiente é compartilhado

A turma inteira testa o mesmo sistema, em https://inscrevi.vercel.app, com os
mesmos dados. Isso muda a forma de testar:

- **Criem as suas próprias contas** para os testes, em vez de usar só as contas
  de exemplo, que todo mundo conhece.
- **Não contem com o estado inicial.** Uma vaga que estava livre pode ter sido
  ocupada por outra pessoa um minuto antes. Confiram a pré-condição do cenário
  antes de executar e anotem o que encontraram.
- **Os minicursos pequenos esgotam rápido.** Se precisarem de vagas de volta,
  peçam ao instrutor para reiniciar os dados.
- **Anotem o ambiente e a versão** que aparecem no rodapé do app: eles entram
  no relato de defeito.

## Compartilhando evidências (5 min)

Cada pessoa apresenta:

- qual história e risco priorizou;
- quais testes executou;
- qual resultado obteve;
- quais evidências coletou;
- se encontrou um defeito, uma dúvida ou uma limitação do ambiente.
