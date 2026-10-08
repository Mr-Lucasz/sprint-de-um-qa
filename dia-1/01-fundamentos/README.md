# 01 · Fundamentos de teste

Base: syllabus **ISTQB CTFL v4.0.1**, capítulos 1, 2 e 5. As seções citadas permitem aprofundar no documento oficial (versão em português publicada pelo BSTQB).

---

## O que é testar (CTFL 1.1)

Testar é um conjunto de atividades para **encontrar defeitos e avaliar a qualidade** de um produto. Não é só executar o software: analisar requisitos, revisar documentos e planejar também são teste. Por isso o syllabus separa:

- **Teste dinâmico:** executa o software.
- **Teste estático:** avalia artefatos sem executar (revisão de histórias, de código, de protótipos).

**Testar não é depurar (1.1.2).** O teste mostra que algo falha; a depuração encontra a causa no código e corrige. Depois da correção vem o **teste de confirmação**.

## Erro, defeito e falha (CTFL 1.2.3)

| Termo | O que é | Exemplo numa loja virtual |
|---|---|---|
| **Erro (engano)** | Uma ação humana equivocada | Ao escrever a história do checkout, ninguém pensou no carrinho vazio, e a dev implementou só o caminho com itens |
| **Defeito** | O problema que ficou no artefato (código, requisito) | O botão **Checkout** não confere se há itens no carrinho |
| **Falha** | O comportamento errado observado ao executar | A pessoa conclui um pedido sem nenhum produto, com total de $0.00 |

A **causa raiz** é o motivo fundamental do erro (pressa, requisito ambíguo, falta de revisão). Atacar a causa raiz evita defeitos parecidos no futuro.

## Os 7 princípios de teste (CTFL 1.3)

| # | Princípio | Na prática |
|---|---|---|
| 1 | O teste mostra a presença de defeitos, não a ausência | "Passou em todos os testes" não quer dizer "não tem defeito" |
| 2 | Teste exaustivo é impossível | Por isso usamos técnicas (partições, limites) e priorização por risco |
| 3 | Testar cedo economiza tempo e dinheiro | Uma pergunta no refinamento custa menos que um bug em produção |
| 4 | Defeitos se agrupam | Poucos módulos concentram a maioria dos problemas: invista mais teste neles |
| 5 | Testes se desgastam | Repetir os mesmos testes encontra cada vez menos defeitos novos |
| 6 | Teste depende do contexto | Testar um app bancário é diferente de testar um jogo |
| 7 | Falácia da ausência de defeitos | Software sem defeitos que não atende à necessidade do usuário não tem qualidade |

## Níveis e tipos de teste (CTFL 2.2)

**Níveis** (onde testamos): componente, integração de componentes, sistema, integração de sistemas e aceite.

**Tipos** (o que avaliamos):

- **Funcional:** o que o sistema faz (as regras de negócio de uma história).
- **Não funcional:** como faz (desempenho, usabilidade, segurança, acessibilidade).
- **Caixa-preta:** baseado na especificação, sem olhar o código. É como você vai trabalhar nos desafios do dia 1.
- **Caixa-branca:** baseado na estrutura interna (código).

**Confirmação e regressão (2.2.3):** depois de uma correção, o teste de confirmação verifica se o defeito sumiu; o de regressão verifica se a mudança não quebrou outra coisa. Regressão é a candidata número 1 à automação, como veremos no dia 2.

## QA dentro da Sprint

- **Abordagem de equipe inteira (1.5.2):** qualidade é responsabilidade do time, não só do QA.
- **Shift-left (2.1.5):** mover o teste para o início do ciclo de desenvolvimento, antes da entrega final. Em vez de testar só ao fim, o time valida requisitos, critérios de aceite, cenários e riscos desde o refinamento das histórias.
- **Três amigos (4.5.1):** negócio, desenvolvimento e teste conversam juntos sobre cada história.
- **Pirâmide de testes (5.1.7):** muitos testes rápidos na base (unidade), menos no meio (API/serviço) e poucos no topo (interface).
- **Quadrantes de teste (5.1.8):** organizam os testes por foco (negócio ou tecnologia) e objetivo (apoiar o time ou criticar o produto).

### O que é Shift-left na prática?

Shift-left significa “deslocar para a esquerda” no calendário de desenvolvimento: quanto antes no processo, melhor. A ideia é prevenir defeitos antes que eles se transformem em retrabalho, custo e risco para a release. Em vez de esperar o código ficar pronto para começar a testar, o QA participa do refinamento, analisa critérios de aceite, sugere casos de teste, valida regras de negócio e ajuda a escrever cenários antes da implementação.

Isso traz benefícios claros:

- menos retrabalho e correção de bugs no fim do sprint;
- custo mais baixo para encontrar e corrigir problemas;
- melhor entendimento da funcionalidade antes do código ser entregue;
- menos chance de defeito passar despercebido para produção.

Exemplos simples de shift-left:

- revisar a história com o PO e a dev antes de codar;
- levantar dúvidas sobre regras e limites antes da implementação;
- escrever cenários de teste enquanto a funcionalidade ainda está sendo especificada;
- testar protótipos, mocks ou contratos de API antes da entrega final.

Em resumo, o objetivo do shift-left é tornar a qualidade parte do processo desde o começo, e não uma etapa tardia do fim do ciclo.

## Tester vs QA: diferença de escopo e responsabilidade

É comum ouvir os termos tester, QA e analista de qualidade como se fossem sinônimos, mas eles não são exatamente. A diferença mais importante está no escopo da atuação.

- **Tester**: normalmente foca em executar testes, validar se a funcionalidade atende ao comportamento esperado e registrar defeitos.
- **QA (Quality Assurance)**: tem um olhar mais amplo sobre a qualidade do produto e do processo. Ele participa de definição de critérios, revisão de requisitos, análise de risco, melhoria de processo, testes, automação e garantia de que a entrega está adequada para o cliente.

Em outras palavras, o tester executa a verificação; o QA trabalha para prevenir problemas e melhorar a capacidade de entregar software confiável.

### Como era o papel no modelo em cascata

No modelo em cascata, a qualidade era tratada quase como uma etapa final do projeto. A sequência era mais ou menos assim:

1. levantamento de requisitos;
2. análise e especificação;
3. desenvolvimento;
4. testes no fim;
5. entrega ou correção tardia.

Nesse contexto, o papel do analista/tester era muito mais reativo e final: o sistema já estava construído e o time de testes tinha a missão de encontrar falhas antes da entrega. Isso gerava alguns problemas comuns:

- defeitos descobertos tarde;
- custo alto para corrigir erros;
- pouca colaboração com a equipe de desenvolvimento;
- menos foco em prevenção e melhoria de processo;
- testes muitas vezes baseados em checklist rígido e documentação extensa.

### Como é hoje

Hoje, o papel evoluiu para um modelo mais colaborativo, com qualidade integrada ao processo. O QA ou QA Engineer participa desde o início da história, junto com produto, design e desenvolvimento. A atuação passou a incluir:

- revisão de requisitos e critérios de aceite;
- análise de risco e priorização;
- testes manuais e exploratórios;
- automação de testes;
- testes de API, integração e regressão;
- testes de usabilidade, acessibilidade e performance;
- métricas de qualidade, cobertura e confiabilidade;
- apoio ao time na decisão de liberar ou não uma entrega.

### Papéis que surgiram no mercado

No cenário atual, os títulos variam bastante e refletem a maturidade do time. Alguns dos perfis mais comuns são:

- **QA Analyst / Analista de Qualidade**: foco em análise de requisitos, testes manuais, critérios, riscos e garantia de qualidade.
- **QA Engineer / Engenheiro de Qualidade**: combina testes, automação, processo e colaboração técnica com o time.
- **Test Automation Engineer / Engenheiro de Automação de Testes**: foco em automação, pipelines e testes repetíveis em CI/CD.
- **Automation Engineer / Automação**: às vezes mais ligado à automação de processos e testes, dependendo do contexto da empresa.
- **SDET (Software Development Engineer in Test)**: perfil híbrido entre desenvolvimento e testes, criando frameworks, ferramentas e automação com linguagem de programação.
- **QA Lead / Líder de QA**: coordena estratégia, métricas, revisão de testes e trabalho da equipe.
- **DevOps QA / QA no pipeline de entrega**: atua mais próximo de automação em integração contínua, testes em ambiente e release quality gates.

### Visão prática

A mudança fundamental não foi só o nome do cargo. Foi a forma de pensar qualidade. Antes, o teste era um “filtro no fim”; hoje, o papel é mais proativo: a qualidade é construída ao longo do processo, com colaboração, automação e análise de risco desde o início.

Esse é um dos principais motivos que justificam o shift-left: testar cedo e em conjunto com o time reduz retrabalho e aumenta a confiança na entrega.

```
            Voltado ao negócio
     Q2 testes funcionais,  │  Q3 exploratório,
        exemplos, histórias │     usabilidade, aceite
  Apoia ────────────────────┼──────────────────── Critica
  o time  Q1 unidade,       │  Q4 desempenho,     o produto
          componente        │     segurança, carga
            Voltado à tecnologia
```

## Fluxo atual de qualidade em uma Sprint

Em uma equipe moderna, o QA não fica só na etapa final. O fluxo de qualidade costuma ser contínuo e acompanhar o ciclo de desenvolvimento desde o início da história até a validação da entrega. A prática pode variar conforme o time, mas a base costuma ser esta:

### 1) Refinamento e Shift-left

Antes de entrar em desenvolvimento, o QA participa do refinamento com produto, design e desenvolvimento para validar:

- se a história está bem entendida;
- se os critérios de aceite estão claros;
- se existem ambiguidades, regras ocultas ou casos de borda;
- quais riscos e cenários críticos podem impactar o cliente;
- o que precisa ser coberto por testes manuais e automáticos.

Essa etapa é o principal exemplo de shift-left: a qualidade é pensada antes do código ser entregue. Isso reduz retrabalho, evita bugs simples e melhora a previsibilidade da sprint.

### 2) Planejamento de testes

Depois do refinamento, o QA organiza o plano de teste de acordo com o tipo de funcionalidade. Em geral, a estratégia considera:

- **API / services**: validar contratos, regras de negócio, integrações, erro e sucesso, dados de entrada e saída, autenticação e status HTTP;
- **UI / interface integrada**: validar fluxo principal, navegação, elementos visuais, mensagens ao usuário, estados de carregamento, campos obrigatórios e regras de negócio em tela;
- **fluxos críticos e de risco alto**: login, cadastro, compra, inscrição, pagamento, autorização e regras que afetam o cliente.

O objetivo do planejamento é responder: o que testar, em qual ordem, com quais dados, em que ambiente e qual nível de risco ou prioridade cada cenário tem.

### 3) Execução dos testes

A execução acontece em um ambiente de teste adequado e organizado. Isso pode incluir:

- ambiente local ou de desenvolvimento;
- ambiente de homologação;
- ambiente de staging/pré-produção;
- dados de teste controlados;
- testes em diferentes navegadores, dispositivos ou plataformas.

Em alguns times, também há uma etapa de homologação com cliente, produto ou stakeholders para validação de comportamento e aceitação antes do deploy final.

### 4) Registro de defeitos dentro do ciclo de execução

Durante a execução, o QA registra falhas, inconsistências e comportamento fora do esperado. Isso pode ser entendido como um defeito do ciclo de execução ou um bug interno do processo de validação. O registro normalmente inclui:

- cenário/teste executado;
- passo a passo da reprodução;
- resultado esperado;
- resultado obtido;
- evidências (print, vídeo, log, resposta de API, link do ambiente);
- severidade, prioridade e impacto para o usuário ou negócio.

Esse tipo de defeito é essencial para o time melhorar continuamente, porque ele aparece antes da entrega final e ainda pode ser corrigido no ciclo atual da sprint.

### 5) Análise de causa raiz

Depois que um defect é identificado, o time não deve se limitar a “corrigir o sintoma”. O ideal é analisar a causa raiz, ou seja, descobrir por que o problema ocorreu.

Algumas causas comuns:

- requisito ambíguo ou incompleto;
- regra de negócio mal interpretada;
- validação insuficiente no código;
- falha de integração entre sistemas;
- ausência de testes de regressão;
- mudança de regra sem atualização de documentação ou critério.

A análise de causa raiz ajuda a evitar que o mesmo erro aconteça em outros fluxos. Em muitos times, isso é feito junto com o time técnico, com simples ações como 5 porquês, revisão de PR, revisão de requisitos e análise do padrão do defeito.

### 6) Defeito em homologação vs defeito em produção

Esses dois tipos de defeito têm diferença importante:

- **Defeito em homologação / ambiente de teste**: identificado antes da entrega. Normalmente ainda há tempo para corrigir sem impacto crítico para o cliente. A prioridade costuma ser ajustar antes do release.
- **Defeito em produção**: encontrado depois que o sistema já está acessível ao usuário. Esse caso é mais sensível, porque impacta o cliente real e pode causar perda de confiança, operação, faturamento ou conformidade.

Em produção, o defeito costuma receber atenção especial em termos de:

- urgência da correção;
- comunicação para o cliente ou stakeholders;
- rollback, hotfix ou mitigação;
- análise pós-incidente;
- revisão da política de testes e de release.

A diferença central é que, em homologação, o problema ainda está no ciclo de validação; em produção, ele já virou um risco real para o usuário final.

### 7) Métricas de qualidade

Ao longo da sprint, o QA acompanha indicadores que ajudam a medir a qualidade do software e da entrega. Alguns exemplos importantes são:

- quantidade de defeitos por história ou módulo;
- taxa de bugs abertos x corrigidos;
- defeitos críticos e bloqueadores;
- tempo médio para correção;
- cobertura de testes automatizados;
- percentual de testes executados com sucesso;
- defeitos encontrados em produção;
- retrabalho e custo de correção.

Essas métricas ajudam a entender se o time está entregando com segurança e onde há risco de regressão ou falta de maturidade.

### 8) Teste de usabilidade

Teste de usabilidade avalia se o produto é fácil de usar, compreensível e eficiente para o usuário. Não basta o sistema “funcionar”; ele precisa funcionar bem na prática.

Exemplos de questões de usabilidade:

- o usuário consegue achar o botão correto com facilidade?
- a mensagem é clara?
- o fluxo é intuitivo?
- a tela funciona em diferentes tamanhos e contextos?
- o processo gera confusão ou fricção?

A usabilidade é especialmente importante em sistemas com alto volume de usuários, processos sensíveis ou tarefas frequentes do dia a dia.

### 9) Smoke test

O smoke test é uma validação rápida e enxuta do build ou da release para verificar se os pontos críticos estão funcionando antes de iniciar testes mais profundos.

Ele normalmente cobre cenários essenciais como:

- abrir a aplicação;
- autenticar;
- acessar o fluxo principal;
- realizar uma ação crítica;
- verificar se não há falha grave de integração ou de deploy.

Se o smoke test falha, o build normalmente é rejeitado para correção antes de seguir para regressão, testes manuais completos ou homologação.

### 10) Testes não funcionais

Além dos testes funcionais, existem testes que avaliam qualidade do sistema em termos de comportamento e estabilidade. Entre os mais importantes estão:

- **performance**: tempo de resposta, carga, throughput e concorrência;
- **segurança**: acesso indevido, autenticação, autorização e dados sensíveis;
- **acessibilidade**: uso com teclado, contraste, leitura por tela, semântica e navegação;
- **confiabilidade**: estabilidade do sistema e ausência de falhas recorrentes;
- **compatibilidade**: funcionamento em navegadores, sistemas operacionais e dispositivos diferentes.

### 11) Testes de responsividade e mobile

Hoje, a qualidade também precisa considerar dispositivos e contextos diferentes. Nesse cenário entram:

- **testes de responsividade**: verificar se a interface se adapta a telas pequenas, médias e grandes sem quebrar layout ou funcionalidade;
- **testes mobile**: validar apps nativos, híbridos ou responsivos em iOS e Android;
- **testes em app e web mobile**: navegação, toque, zoom, orientação da tela, feedback visual e estabilidade em celular;
- **contexto real do usuário**: conexão lenta, notificação, interrupção, sensores e comportamento de uso em mobile.

Esses testes são fundamentais porque a experiência do usuário pode mudar bastante entre desktop, tablet e celular.

### Resumo do fluxo atual

Em resumo, o fluxo atual de qualidade em times modernos costuma seguir uma lógica de prevenção e validação contínua:

1. refinamento com foco em regras e risco;
2. planejamento de teste por tipo de entrega e impacto;
3. execução em ambiente de teste ou homologação;
4. registro e priorização de defeitos;
5. análise de causa raiz;
6. revisão de qualidade por métricas e riscos;
7. validação em cenários de usabilidade, smoke, não funcionais e mobile.

Essa visão mostra que a qualidade deixou de ser apenas uma “etapa final” e passou a ser um processo contínuo, compartilhado por toda a equipe.

## Vendo os conceitos no Sauce Demo

O [Sauce Demo](https://www.saucedemo.com) é uma loja de mentira, pública, feita
para praticar teste. Todas as lições deste repositório usam essa loja como
exemplo. As contas ficam na própria tela de login (a senha de todas é
`secret_sauce`).

Entre com `standard_user`, coloque um produto no carrinho e finalize a compra.
Depois saia e repita com `problem_user`. Com o que você viu, responda:

1. O que você observou de errado com `problem_user` é um **erro**, um
   **defeito** ou uma **falha**? Por quê?
2. Você comprou um produto sem problemas com `standard_user`. Isso prova que o
   checkout não tem defeitos? Qual princípio responde?
3. Você testou a loja sem ver o código. Que **tipo** de teste foi esse? E em
   que **nível**?
4. Se a equipe corrigir as imagens de `problem_user`, que dois tipos de teste
   você executa em seguida?

<details>
<summary>Respostas</summary>

1. **Falha**: é o comportamento errado que aparece ao executar. O defeito está
   no código, que você não viu, e o erro foi de quem o escreveu.
2. Não. Princípio 1: o teste mostra a presença de defeitos, não a ausência.
3. Caixa-preta, no nível de sistema.
4. Teste de **confirmação** (as imagens voltaram?) e de **regressão** (o resto
   da loja continua funcionando?).

</details>

## Agora é com você

O [desafio desta fase](DESAFIO.md) leva as mesmas perguntas para o Inscrevi.
