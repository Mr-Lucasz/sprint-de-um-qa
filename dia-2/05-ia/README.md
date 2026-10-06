# 05 · IA no dia a dia de QA

A IA acelera, mas **não substitui o julgamento**. Toda saída é tratada como sugestão de um colega júnior muito rápido: revise, questione e confira contra o backlog.

> 💬 **Visão do instrutor:** _como uso IA no meu fluxo de QA._

## Onde a IA ajuda

| Tarefa | Ganho | Cuidado |
|---|---|---|
| Gerar cenários a partir de uma história | Cobertura inicial rápida | Inventa regras que não existem |
| Encontrar ambiguidades num requisito | Ótima "segunda leitura" | Confira se a ambiguidade é real |
| Gerar massa de teste | Variedade de dados | Dados "bonitos demais", sem bordas |
| Rascunhar código de teste | Menos digitação | Locators frágeis, esperas fixas, asserções fracas |
| Melhorar um relato de defeito | Clareza | Pode "suavizar" ou mudar o fato |

**Nunca cole dados reais ou sigilosos** (de clientes, senhas, tokens) numa IA externa.

## Prompts prontos

**1. Cenários a partir de uma história**
```
Você é um analista de testes experiente. A partir da história e dos critérios
de aceite abaixo, liste cenários de teste em Gherkin (português, # language: pt).
Inclua caminho feliz, valores limite, partições inválidas e combinações de regras.
Para cada cenário, indique a técnica usada (particionamento, valor limite,
tabela de decisão ou transição de estado). NÃO invente regras: se algo não
estiver especificado, liste como pergunta para o PO ao final.

<cole aqui a US04 do sprint/backlog.md>
```

**2. Caçar ambiguidades**
```
Revise esta história como um QA num refinamento. Aponte palavras vagas,
regras ausentes, conflitos com as outras histórias e critérios não testáveis.
Para cada ponto, sugira uma pergunta objetiva ao PO.

<cole aqui a US07 de dia-1/02-requisitos>
```

**3. Massa de teste**
```
Gere um JSON com dados de cadastro para testar as regras abaixo. Para cada item
inclua os campos nome, email, senha, "particao" (qual partição ou limite está
sendo testado) e "esperado" (201, 400 ou 409). Cubra todos os limites.

Regras: <cole os critérios da US01>
```

**4. Revisar um teste automatizado**
```
Revise este teste Playwright seguindo as boas práticas oficiais
(https://playwright.dev/docs/best-practices): locators voltados à pessoa
usuária, asserções web-first, isolamento e nomes claros. Aponte problemas
e explique cada sugestão antes de reescrever.

<cole o teste>
```

## Massa de teste com Faker

```bash
npm run massa          # 5 usuários válidos + casos de borda
npm run massa -- 20    # 20 usuários válidos + casos de borda
```

O script [gerar-massa.js](gerar-massa.js) usa uma **semente fixa**, então gera sempre a mesma massa: isso torna o teste reprodutível.

## Exercício (15 min)

1. Use o prompt 1 com a US04. Compare a saída com a tabela de decisão de [dia-1/02-requisitos](../../dia-1/02-requisitos/). O que a IA acertou, esqueceu ou inventou?
2. Use o prompt 3 e compare com o `gerar-massa.js`. Adicione ao script um caso de borda que a IA sugeriu e que faça sentido.
