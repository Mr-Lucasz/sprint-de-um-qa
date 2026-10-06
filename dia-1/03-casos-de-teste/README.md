# 03 · Casos de teste e plano de teste

Base: CTFL v4.0.1, seções **1.4.3** (testware), **2.1.3** (BDD) e **4.2**.

Neste exercício, os casos de teste seguem a abordagem ágil de **Behavior-Driven
Development (BDD)**. O caso é um exemplo concreto do comportamento esperado,
escrito com a estrutura do Gherkin:

- **Dado (Given):** estado inicial e contexto, com dados concretos.
- **Quando (When):** uma ação ou evento do usuário.
- **Então (Then):** resultado observável e verificável.

BDD não é apenas trocar o nome dos campos. O cenário deve ser compreensível
para negócio, desenvolvimento e teste, e servir como critério de aceite e como
base para uma execução manual ou automatizada.

## Template

Use o arquivo [casos-de-teste.csv](casos-de-teste.csv): ele abre no Excel, no
Google Planilhas ou no próprio VS Code. Os 3 primeiros casos são exemplos.

As colunas `dado`, `quando` e `entao` representam o cenário BDD. A coluna
`regra` mantém a rastreabilidade com a regra de negócio e `tecnica` registra a
técnica complementar usada (por exemplo, valor limite ou tabela de decisão).
As colunas `resultado_obtido` e `status` são preenchidas somente após a
execução.

### Exemplo de cenário

```gherkin
Cenário: Aceitar senha com exatamente 8 caracteres
  Dado que estou na tela "Criar conta" e ainda não possuo uma conta
  Quando informo nome, e-mail e uma senha com 8 caracteres
  Então a conta é criada e sou redirecionado para "Entrar"
```

## Exercício (25 min)

1. Escolha uma história da Sprint atual (**US01 a US06**), na versão refinada
   do [backlog](../../sprint/backlog.md), e escreva pelo menos 5 cenários no CSV.
   As histórias US07 a US16 ainda não têm versão refinada publicada.
2. Para cada cenário, use uma única ação em `quando` e um resultado
   observável em `entao`.
3. Inclua exemplos positivos, negativos e valores de fronteira quando a regra
   exigir.
4. Troque de arquivo com a dupla do lado e **execute os cenários dela** no
   Inscrevi.
5. Preencha `resultado_obtido` e `status` (`Passou`, `Falhou` ou `Bloqueado`).
6. Todo cenário com status **Falhou** vira um relato de defeito no bloco 05.

> O passo 4 é de propósito: se a sua dupla não conseguiu executar o cenário
> sem te perguntar nada, o `Dado`, o `Quando` ou o `Então` precisa de ajuste.

## Plano de teste

Depois de escrever os casos, organize a estratégia de validação no
[plano de teste](plano-de-teste.md). Casos de teste e plano de teste fazem
parte da mesma dinâmica: os casos dizem **o que verificar** e o plano registra
**como, onde, com quais dados, riscos e critérios de saída** a validação será
conduzida.

Na mesma dupla:

1. defina o objetivo, escopo e fora de escopo;
2. priorize os riscos da história;
3. escolha a abordagem e os tipos de teste;
4. registre ambiente, dados, dependências e evidências;
5. defina critérios de entrada e saída;
6. troque o plano com outra dupla e revise os pontos ambíguos.
