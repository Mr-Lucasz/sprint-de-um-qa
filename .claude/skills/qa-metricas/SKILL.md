---
name: qa-metricas
description: Calcula os indicadores de qualidade da Sprint a partir dos casos de teste executados, das issues de defeito e dos resultados da automação, e monta um resumo com leitura e recomendação de go/no-go contra a Definition of Done. Use quando pedirem métricas, KPIs, indicadores, relatório de qualidade, status de teste ou "a história está pronta?" (ex.: "gera as métricas da US04", "como está a qualidade da Sprint?").
---

# Métricas e KPIs de qualidade

Base: CTFL v4.0.1, 5.3 (monitoramento e controle). Métrica serve para tomar
decisão; número sem leitura não ajuda ninguém.

## Fontes

Use o que existir e diga o que não encontrou:

| Fonte | Onde |
|---|---|
| Casos executados | CSV no formato de `dia-1/03-casos-de-teste/casos-de-teste.csv` (colunas `historia`, `regra`, `status`) |
| Defeitos | `gh issue list --label defeito --state all --limit 500 --json number,title,state,labels,createdAt,closedAt,body` |
| Regras da história | Linhas `Regra N:` de `sprint/backlog.md` |
| Automação | Saída do `npx cypress run`, do `npm run test:postman` ou do Playwright |

A história, a severidade e a prioridade de cada defeito estão no corpo da
issue (campos do formulário de bug). Defeito sem esses campos conta como "não
classificado", não é chutado.

## Indicadores

| Indicador | Fórmula |
|---|---|
| Progresso da execução | casos executados ÷ casos planejados |
| Taxa de aprovação | casos que passaram ÷ casos executados |
| Casos bloqueados | bloqueados ÷ planejados (e o motivo) |
| Cobertura de requisitos | regras com pelo menos um caso executado ÷ regras da história |
| Defeitos por história | contagem por `USxx` |
| Distribuição por severidade | Crítica, Alta, Média, Baixa |
| Abertos × fechados | por estado; críticos e altos abertos em destaque |
| Tempo médio de correção | média de (`closedAt` − `createdAt`) dos fechados |
| Efetividade dos casos | defeitos achados por caso roteirizado ÷ total de defeitos (o resto veio da exploração) |
| Cobertura de automação | cenários automatizados ÷ cenários planejados |
| Aprovação da automação | testes verdes ÷ testes rodados |

Mostre numerador e denominador junto com o percentual (`7/9 · 78%`).
Denominador zero aparece como "sem dados", nunca como 0% ou 100%.

## Leitura

Para cada indicador que chama atenção, uma frase com o que ele significa
**neste contexto**. Cuidados:

- Poucos defeitos com baixa cobertura não é qualidade, é falta de teste.
- 100% de aprovação com casos só de caminho feliz não diz nada sobre bordas.
- Teste automatizado vermelho que aponta defeito conhecido está fazendo o
  trabalho dele; separe-o de teste quebrado.
- Na homologação compartilhada, parte das falhas é de ambiente. Não as conte
  como defeito do produto.
- Não use métrica para comparar pessoas.

## Go/no-go

Confira cada item de `sprint/definition-of-done.md` com a evidência que o
sustenta: atende, não atende ou sem evidência. Critério sem evidência não está
atendido. A recomendação final é uma de três: **pronta**, **pronta com
ressalvas** (liste) ou **não pronta** (o que falta).

## Saída

1. Cabeçalho: escopo (história ou Sprint), data, ambiente e versão, fontes usadas.
2. Tabela dos indicadores com valor e leitura.
3. Top riscos: os 3 pontos que mais pesam na decisão.
4. Checklist da Definition of Done e a recomendação.
5. O que não foi possível medir e que dado faltou.

Se pedirem dashboard ou gráfico, gere um HTML único com os mesmos números;
nesse caso os dados da tabela continuam sendo a fonte, e o gráfico não mostra
nada que a tabela não tenha.
