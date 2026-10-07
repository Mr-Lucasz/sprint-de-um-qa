# 2 · Cenários em BDD e plano de teste

Para transformar a história em bons cenários e decidir como ela será validada.
Material de apoio: [dia-1/02-requisitos](../../dia-1/02-requisitos/) (técnicas)
e [dia-1/03-casos-de-teste](../../dia-1/03-casos-de-teste/) (modelos).

**O que colar:** a sua história refinada do [backlog](../../sprint/backlog.md).

## Prompt A · Cenários em BDD

```text
Você é um analista de testes experiente em BDD. A partir da história abaixo,
escreva os cenários de teste em Gherkin.

De onde tirar os cenários:
1. Liste as regras da história.
2. Para cada regra, aplique a técnica que cabe e diga qual usou:
   - particionamento de equivalência: um exemplo por partição, válida e
     inválidas;
   - análise de valor limite com 2 valores: o limite e o vizinho do outro lado
     (faixa de 8 a 64 → 7, 8, 64 e 65);
   - tabela de decisão: quando o resultado depende da combinação de condições;
   - transição de estado: quando o item tem ciclo de vida;
   - suposição de erro, como complemento: vazio, só espaços, ação repetida,
     outra conta, sem login.
3. Cubra o caminho feliz, os casos negativos e as bordas de cada regra. Quando
   a regra envolve acesso, inclua quem NÃO pode fazer a ação.

Boas práticas de escrita, que todos os cenários devem seguir:
- Um comportamento por cenário: um único Quando e um resultado.
- Estilo declarativo, na língua do negócio. Descreva o que a pessoa faz e o
  que o sistema garante. Nada de clique, botão, campo, URL ou seletor.
  Em vez de "Quando clico em Inscrever-se", escreva "Quando me inscrevo no
  minicurso".
- Dado é o estado já montado, com dados concretos; Quando é a ação; Então é um
  resultado observável (mensagem, item numa lista, contagem, status). Nunca
  estado interno, como "o banco é atualizado".
- Exemplos concretos: "um minicurso com 2 vagas e 2 inscrições", não "um
  minicurso lotado".
- O título diz a regra e o resultado: "Recusar inscrição em minicurso sem
  vagas", não "Teste de inscrição 2".
- Cenários independentes: cada um monta a própria pré-condição.
- Curtos, de 3 a 5 passos. Pré-condição comum vai para o Contexto. A mesma
  regra com dados diferentes vira Esquema do Cenário com Exemplos.
- Agrupe por Regra, para manter a ligação com o critério de aceite.
- Use sempre os mesmos termos da história.

Limites:
- Use só as regras, mensagens e status HTTP que estão na história. Se o
  resultado esperado de um cenário não estiver definido, não escreva o
  cenário: liste a dúvida ao final, como pergunta para o PO.
- Não escreva cenário só para fazer número. Cada um confere uma regra ou um
  risco.
- Os dados são de exemplo. Não use dados de pessoas reais.

Formato da resposta:
1. O arquivo .feature, começando com "# language: pt", com Funcionalidade,
   Regra, Contexto (se houver), Cenário e Esquema do Cenário.
2. Os mesmos cenários em um bloco CSV separado por ponto e vírgula, uma linha
   por cenário ou por linha de Exemplos, com as duas últimas colunas vazias:
   id;historia;regra;tecnica;cenario;dado;quando;entao;dados;resultado_obtido;status
3. Matriz de rastreabilidade: Regra | Técnica | IDs dos casos. Marque as
   regras que ficaram sem caso.
4. Perguntas para o PO.

<historia>
<<cole aqui a sua história>>
</historia>
```

## Prompt B · Plano de teste com estratégia

Use na mesma conversa, depois do Prompt A.

```text
Agora monte o plano de teste desta história. O ambiente é a homologação em
https://inscrevi.vercel.app, compartilhada com outras pessoas. Tenho
<<quanto tempo você tem, por exemplo 40 minutos>> para executar.

1. Estratégia. Diga qual combinação você recomenda para esta história e por
   quê:
   - analítica, baseada em risco: o risco decide o que testar e em que ordem;
   - baseada em requisitos: cobrir todos os critérios de aceite;
   - reativa (exploratória): sessões com charter, para o que os casos não
     previram;
   - metódica: checklists, como acessibilidade e mensagens;
   - aversa à regressão: reexecutar e automatizar o que já funcionava.

2. Distribuição do esforço.
   - Níveis de teste e pirâmide: a regra de negócio é conferida no nível mais
     baixo em que dá para observá-la. Diga, para cada caso, se vai pela API,
     pela tela ou pelas duas, e por quê.
   - Tipos de teste: funcional, e o não funcional que a história pede
     (permissão e dados de outra pessoa, usabilidade e acessibilidade), mais
     teste de confirmação e de regressão depois de uma correção.
   - Automação: quais cenários entram na regressão automatizada (regra
     crítica, repetição alta, estável) e quais ficam manuais.

3. Riscos. Separe riscos de produto (o que pode dar errado para a pessoa
   usuária ou para o negócio) de riscos de projeto (ambiente compartilhado,
   tempo, dependências). Para cada um: impacto e probabilidade em Alta, Média
   ou Baixa, com uma frase de justificativa, e o nível resultante. A resposta
   a cada risco de produto é um teste concreto, citando o ID do caso.

4. Ordem de execução pelo nível de risco. Se o tempo não der para tudo, diga
   o que fica de fora e qual risco isso deixa sem cobertura.

5. Critérios de entrada e de saída. Os de saída precisam ser mensuráveis
   (percentual de casos executados, cobertura das regras, nenhum defeito
   crítico ou alto aberto). "Testes concluídos" não é critério.

Entregue preenchendo este modelo, com a estratégia e a distribuição do
esforço em "Abordagem e tipos de teste":

Plano:                                  Data:
História / versão:
Objetivo:
Escopo (o que será testado):
Fora de escopo:
Riscos e prioridades:
| Risco | Tipo | Impacto | Probabilidade | Prioridade | Resposta |
Abordagem e tipos de teste:
Ambiente e configuração:
Dados e pré-condições:
Casos de teste relacionados:
Evidências esperadas:
Critérios de entrada:
Critérios de saída:
Bloqueios e dependências:

Limites: os riscos precisam ser desta história, citando a regra que os
origina. Risco que serviria para qualquer sistema não entra. Um plano é uma
decisão baseada em risco, não a lista de todos os testes possíveis.
```

## Confira antes de usar

Cenários:

- [ ] Toda regra da história tem pelo menos um cenário?
- [ ] Os valores limite estão certos? (de 8 a 64 → 7, 8, 64 e 65)
- [ ] Cada cenário tem um `Quando` só?
- [ ] Algum passo fala de clique, botão ou campo? Reescreva na língua do negócio.
- [ ] Algum `Então` traz mensagem ou status que não está no backlog?
- [ ] O título diz a regra e o resultado?
- [ ] Outra pessoa executaria o cenário sem te perguntar nada?

Plano:

- [ ] A estratégia foi justificada pela história, ou é genérica?
- [ ] Os riscos citam regras desta história?
- [ ] Está claro o que vai pela API e o que vai pela tela?
- [ ] Os critérios de saída dão para medir?
- [ ] O plano cabe no tempo que você tem, e diz o que ficou de fora?

## Para continuar a conversa

```text
Revise os meus cenários abaixo contra as boas práticas de BDD (um
comportamento por cenário, estilo declarativo, Então observável, exemplos
concretos, título que diz a regra, independência). Para cada problema, cite o
cenário, explique e mostre a versão corrigida. Não mude a regra que o cenário
confere.

<<cole os seus cenários>>
```

```text
Monte a tabela de decisão das regras desta história: condições nas linhas,
combinações nas colunas e o resultado esperado de cada uma. Quais combinações
ainda não têm cenário?
```

```text
Gere a massa de dados para os casos CT-<<n>> a CT-<<n>> em JSON, com os campos
de entrada e a partição ou o limite que cada item cobre.
```
