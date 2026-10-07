---
name: qa-plano-de-teste
description: Gera cenários de teste em BDD bem escritos (Gherkin declarativo, no formato do casos-de-teste.csv) e o plano de teste de uma história, com estratégia de teste explícita e priorização por risco. Use quando pedirem plano de teste, estratégia de teste, casos de teste, cenários, Gherkin, cobertura ou "o que eu testo nessa história" (ex.: "monta o plano da US06", "gera os cenários da US04 com valor limite", "qual estratégia eu uso para a US07?").
---

# Cenários em BDD e plano de teste

Base: CTFL v4.0.1, 2.1.3 (BDD), 4.2 (técnicas caixa-preta), 4.5 (abordagens
colaborativas), 5.1 (planejamento) e 5.2 (gestão de risco).

## Entrada

- A história (`USxx` ou texto colado). Para um identificador, leia a seção
  correspondente de `sprint/backlog.md`, que é a versão refinada e a
  referência do que o sistema deve fazer. Leia também as histórias do mesmo
  épico: regras de uma afetam os cenários da outra.
- Se já existir um CSV de casos da pessoa, parta dele: revise e complete em
  vez de recomeçar.
- O tempo disponível para executar, se informado. Ele define o corte do plano.

## Parte 1 · Cenários em BDD

### De onde vêm os cenários

1. Liste as regras da história (cada `Regra N:` dos critérios de aceite).
2. Para cada regra, aplique a técnica que cabe e derive os exemplos dela:

   | Técnica | Quando usar | O que gera |
   |---|---|---|
   | Particionamento de equivalência | Entrada com grupos tratados igual | Um exemplo por partição, válida e inválidas |
   | Valor limite (2 valores) | Faixa numérica, tamanho, quantidade, data | O limite e o vizinho do outro lado (8 a 64 → 7, 8, 64, 65) |
   | Tabela de decisão | Resultado depende da combinação de condições | Um exemplo por coluna da tabela |
   | Transição de estado | O item tem ciclo de vida | Transições válidas e as inválidas |
   | Suposição de erro | Sempre, como complemento | Vazio, só espaços, repetição, outra conta, sem login |

3. Cubra, por regra: o caminho feliz, os negativos e as bordas. Quando a
   regra envolve acesso, inclua quem **não** pode fazer a ação.

### Como escrever um bom cenário

- **Um comportamento por cenário.** Um `Quando`, um resultado. Se o cenário
  tem dois `Quando`, são dois cenários.
- **Declarativo, não imperativo.** Descreva o que a pessoa faz e o que o
  sistema garante, na língua do negócio. Nada de clique, campo, botão, URL ou
  seletor.

  | Evite (imperativo) | Prefira (declarativo) |
  |---|---|
  | Quando clico em "Inscrever-se" e espero o alerta verde | Quando me inscrevo no minicurso |
  | Dado que digito o e-mail e a senha e clico em "Entrar" | Dado que estou autenticada como estudante |

- **`Dado` é estado, `Quando` é ação, `Então` é resultado observável.** O
  `Dado` descreve o contexto já montado, com dados concretos; o `Então`
  descreve o que dá para ver ou medir (mensagem, item numa lista, contagem,
  status), nunca estado interno ("o banco é atualizado").
- **Exemplo concreto.** "Um minicurso com 2 vagas e 2 inscrições" em vez de
  "um minicurso lotado"; o valor exato na borda em vez de "uma senha curta".
- **Título que diz a regra e o resultado.** "Recusar inscrição em minicurso
  sem vagas", não "Teste de inscrição 2" nem "Validar inscrição".
- **Independente.** Cada cenário monta a própria pré-condição e não depende
  de outro ter rodado antes. O ambiente é compartilhado.
- **Curto.** Três a cinco passos. Pré-condição comum a todos vai para o
  `Contexto`. A mesma regra com dados diferentes vira `Esquema do Cenário`
  com `Exemplos`, em vez de cenários copiados.
- **Agrupado por regra.** Use `Regra:` para manter a rastreabilidade com o
  critério de aceite.
- **Vocabulário único.** O mesmo termo para a mesma coisa em todos os
  cenários, igual ao do backlog (minicurso, inscrição, vaga).

### Saída da Parte 1

1. O arquivo `.feature` com `# language: pt`, `Funcionalidade`, `Regra`,
   `Contexto` quando houver, `Cenário` e `Esquema do Cenário`.
2. Os mesmos cenários no formato de
   `dia-1/03-casos-de-teste/casos-de-teste.csv`, separado por ponto e vírgula,
   com `resultado_obtido` e `status` vazios. Cada linha de `Exemplos` vira um
   caso:

   ```
   id;historia;regra;tecnica;cenario;dado;quando;entao;dados;resultado_obtido;status
   ```

3. Matriz de rastreabilidade: regra → técnica → IDs dos casos. Regra sem caso
   é lacuna e aparece marcada.

Antes de entregar, releia cada cenário contra a lista acima e corrija o que
não passar.

## Parte 2 · Plano de teste

O plano responde: o que testar, em que ordem, como, com o quê, e quando parar.

### Estratégia

Declare a estratégia e justifique pela história. O normal é combinar:

| Estratégia | O que significa | Quando pesa mais |
|---|---|---|
| Analítica, baseada em risco | O risco decide o que testar e em que ordem | Sempre: é a base do plano |
| Baseada em requisitos | Cobrir todo critério de aceite | Regras bem definidas no backlog |
| Reativa (exploratória) | Sessões com charter, guiadas pelo que se descobre | Complementar os casos; pouco tempo; regra nova |
| Metódica | Checklists e heurísticas fixas | Acessibilidade, mensagens, itens da Definition of Done |
| Aversa à regressão | Reexecutar e automatizar o que já funcionava | Depois de uma correção; histórias que mexem em regra compartilhada |

Depois distribua o esforço:

- **Níveis e pirâmide de teste.** Regra de negócio se confere no nível mais
  baixo em que ela é observável: o que a API garante vai pela API (mais
  rápido e estável); a interface fica para o fluxo da pessoa usuária, as
  mensagens e o que só existe na tela. Diga, por caso, se vai pela API, pela
  tela ou pelas duas.
- **Tipos de teste.** Funcional sempre; e o não funcional que a história
  pede: segurança e permissão (dados de outra pessoa), usabilidade e
  acessibilidade (teclado, rótulos), confirmação e regressão após correção.
- **Shift-left.** O que foi resolvido no refinamento e as dúvidas que ainda
  bloqueiam cenários.
- **Automação.** Quais cenários entram na regressão automatizada e por quê
  (regra crítica, repetição alta, estável); quais ficam manuais.

### Risco

- Liste riscos de **produto** (o que pode dar errado para a pessoa usuária ou
  para o negócio) separados dos de **projeto** (ambiente compartilhado,
  tempo, dependência de outra história).
- Nível do risco = impacto × probabilidade, cada um em Alta, Média ou Baixa,
  com uma frase que justifica.
- A resposta a cada risco de produto é um teste concreto, citando os IDs. A
  ordem de execução segue o nível do risco.
- Se o tempo não dá para tudo, diga o que fica de fora e qual risco isso
  deixa sem cobertura.

### Critérios

- **Entrada**: o que precisa estar pronto para começar (história refinada,
  ambiente no ar com versão identificada, massa preparada, acesso às contas).
- **Saída**: mensuráveis e alinhados a `sprint/definition-of-done.md`
  (percentual de casos executados, cobertura de regras, nenhum defeito
  crítico ou alto aberto). "Testes concluídos" não é critério.

### Saída da Parte 2

Preencha o template de `dia-1/03-casos-de-teste/plano-de-teste.md`, com a
estratégia em "Abordagem e tipos de teste":

- Ambiente: homologação em https://inscrevi.vercel.app, com versão do rodapé;
  dados compartilhados pela turma, o que é um risco de projeto.
- Dados e pré-condições: a massa que cada grupo de casos precisa e quem a cria.
- Evidências: o que guardar por caso (print, método, rota, status, corpo).
- Charter exploratório da história, de
  `dia-1/04-execucao-de-testes/02-funcional/README.md`.

## Regras

- Não invente regra. Resultado esperado que não está no backlog vira pergunta
  para o PO, listada ao final, e o cenário fica fora do CSV.
- Mensagens e status no `Então` só quando o backlog os define.
- Não escreva cenário para inflar número: cenário que não confere uma regra
  ou um risco sai.
- Um plano é uma decisão baseada em risco, não a lista de todos os testes
  possíveis.

Se pedirem para salvar, grave em arquivos novos com o nome da história
(`us06-cancelamento.feature`, `us06-casos-de-teste.csv`,
`us06-plano-de-teste.md`), sem sobrescrever os modelos.
