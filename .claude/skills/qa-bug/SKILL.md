---
name: qa-bug
description: Escreve ou revisa um relato de defeito do Inscrevi no formato do template de issue do repositório, com passos reproduzíveis, esperado ligado ao critério de aceite, severidade e prioridade justificadas. Use quando pedirem para reportar, abrir, escrever ou melhorar um bug, ou quando descreverem algo que "deu errado" num teste (ex.: "abre um bug disso", "meu relato está bom?", "a inscrição passou mesmo sem vaga").
---

# Reporte de bug

Base: CTFL v4.0.1, 5.5. Um bom relato deixa quem não viu o teste reproduzir o
problema só com o que está escrito.

## Entrada

Anotações da pessoa, um caso de teste que falhou, uma resposta da API, um
print ou o resultado de uma execução. Para revisar, o relato já escrito.

## Antes de escrever

1. Identifique a história e o critério de aceite violado em
   `sprint/backlog.md`. Se nada no backlog sustenta o esperado, diga isso: pode
   ser dúvida para o PO, e não defeito.
2. Confira o que falta para reproduzir: dados usados, conta, pré-condição,
   ambiente e versão (rodapé do app). **Pergunte o que faltar; não preencha
   com suposição.**
3. Procure duplicata nas issues do repositório
   (`gh issue list --label defeito --search "<termos>"`). Se existir, proponha
   um comentário com o que há de novo em vez de outra issue.

## O relato

Campos do `.github/ISSUE_TEMPLATE/bug_report.yml`, nesta ordem:

```
Título: [Bug] [área] - [comportamento observado] - [condição]

Descrição breve:
Pré-condições:
História relacionada:
Onde a falha aparece: API | Interface (front) | As duas
Passos para reproduzir:
1.
Resultado esperado:
Resultado obtido:
Severidade:            Prioridade sugerida:
Ambiente:
Evidências:
Informações adicionais:
Caso de teste ou charter de origem:
```

- **Título**: o comportamento observado, não a causa. `[Bug] Inscrição - aceita aluno - quando o curso está sem vagas`.
- **Passos**: numerados, a partir de um estado conhecido, com os dados reais
  (e-mail, curso, valores). O menor caminho que reproduz.
- **Esperado**: cita a história e a regra (`US04, Regra 2`).
- **Obtido**: fato observado, com mensagem, status HTTP e corpo. Sem hipótese
  sobre a causa e sem adjetivo.
- **Severidade** (impacto técnico) e **prioridade** (urgência para o negócio)
  são decididas separadamente, cada uma com uma frase de justificativa.

  | Severidade | Referência |
  |---|---|
  | Crítica | Perda ou exposição de dados, falha de segurança, fluxo principal impossível sem contorno |
  | Alta | Regra de negócio importante violada, ou fluxo principal com contorno difícil |
  | Média | Função secundária incorreta, ou contorno simples |
  | Baixa | Texto, aparência, inconsistência que não impede o uso |

  A prioridade é sugestão: quem decide é o PO.
- Um defeito por relato. Dois comportamentos errados viram dois relatos.

## Revisando um relato pronto

Passe pelo checklist de `dia-2/01-execucao-e-defeitos/README.md` e aponte, item
a item, o que passa e o que falta, citando o trecho. Depois entregue a versão
reescrita, **sem mudar os fatos**: não suavize, não acrescente passo que a
pessoa não fez, não troque o que foi observado.

## Abrindo a issue

Só crie a issue no GitHub quando pedirem explicitamente. Mostre o relato
final, confirme e então use
`gh issue create --label defeito --label triagem` com o corpo nos mesmos
campos. Sem isso, entregue o texto pronto para colar no formulário
**Issues → New issue → Reportar bug**.

Nunca inclua senha real, token ou dado pessoal de terceiros na evidência.
