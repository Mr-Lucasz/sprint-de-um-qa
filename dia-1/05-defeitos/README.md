# 05 · Gestão de defeitos

Base: CTFL v4.0.1, seção **5.5**.

Um relato de defeito serve para três coisas: dar a quem corrige **informação suficiente para reproduzir**, permitir **acompanhar** a qualidade do produto e gerar **ideias de melhoria** do processo.

## O que um bom relato contém

Alinhado ao conteúdo sugerido pelo syllabus:

| Campo | Para quê |
|---|---|
| Identificador e título | Achar e entender o problema só pelo título |
| Objeto de teste e ambiente | Saber **onde** e **em que versão/configuração** aconteceu. No Inscrevi, o ambiente e a versão estão no rodapé |
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
| Nome do evento com erro de digitação na página inicial na véspera da abertura | Baixa | Alta |
| Falha rara num relatório administrativo que ninguém usa este mês | Alta | Baixa |

## Ciclo de vida (exemplo)

```
Novo → Em triagem → Aberto → Em correção → Pronto para teste → Fechado
                 ↘ Rejeitado / Duplicado              ↘ Reaberto
```

## Escrevendo bem

| Evite | Prefira |
|---|---|
| "Inscrição não funciona" | "Inscrição aceita quando o curso já não tem vagas" |
| "Deu erro" | "A tela mostra 'Erro' sem dizer o que corrigir" |
| "Testei e quebrou" | Passos numerados com os dados usados |
| Opinião ("o dev esqueceu de validar") | Fato observado (o que fez, o que esperava, o que aconteceu) |

## Exercício (25 min)

1. No repositório da turma no GitHub, abra **Issues → New issue → Relatar defeito**.
2. Registre os defeitos que você encontrou nos casos de teste e no exploratório.
3. Antes de criar, procure se alguém já relatou o mesmo. Se sim, comente com informações novas em vez de duplicar.
4. Revise o relato de uma dupla vizinha: dá para reproduzir só com o que está escrito?
