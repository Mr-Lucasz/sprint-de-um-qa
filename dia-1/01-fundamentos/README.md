# 01 · Fundamentos de teste

Base: syllabus **ISTQB CTFL v4.0.1**, capítulos 1, 2 e 5. As seções citadas permitem aprofundar no documento oficial (versão em português publicada pelo BSTQB).

> 💬 **Visão do instrutor sobre qualidade**
>
> _Espaço para o Lucas: o que qualidade significa na prática, histórias de projetos reais, o que o mercado espera de um QA._

---

## O que é testar (CTFL 1.1)

Testar é um conjunto de atividades para **encontrar defeitos e avaliar a qualidade** de um produto. Não é só executar o software: analisar requisitos, revisar documentos e planejar também são teste. Por isso o syllabus separa:

- **Teste dinâmico:** executa o software.
- **Teste estático:** avalia artefatos sem executar (revisão de histórias, de código, de protótipos).

**Testar não é depurar (1.1.2).** O teste mostra que algo falha; a depuração encontra a causa no código e corrige. Depois da correção vem o **teste de confirmação**.

## Erro, defeito e falha (CTFL 1.2.3)

| Termo | O que é | Exemplo no Inscrevi |
|---|---|---|
| **Erro (engano)** | Uma ação humana equivocada | A dev entendeu "até 42 vagas" como "mais de 42 bloqueia" |
| **Defeito** | O problema que ficou no artefato (código, requisito) | A comparação usa `>` em vez de `>=` |
| **Falha** | O comportamento errado observado ao executar | A 43ª pessoa consegue se inscrever |

A **causa raiz** é o motivo fundamental do erro (pressa, requisito ambíguo, falta de revisão). Atacar a causa raiz evita defeitos parecidos no futuro.

> 💬 **Visão do instrutor:** _causa raiz na prática, exemplos de RCA._

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

- **Funcional:** o que o sistema faz (as regras da US04).
- **Não funcional:** como faz (desempenho, usabilidade, segurança, acessibilidade).
- **Caixa-preta:** baseado na especificação, sem olhar o código. É o que faremos hoje.
- **Caixa-branca:** baseado na estrutura interna (código).

**Confirmação e regressão (2.2.3):** depois de uma correção, o teste de confirmação verifica se o defeito sumiu; o de regressão verifica se a mudança não quebrou outra coisa. Regressão é a candidata número 1 à automação, como veremos no dia 2.

## QA dentro da Sprint

- **Abordagem de equipe inteira (1.5.2):** qualidade é responsabilidade do time, não só do QA.
- **Shift-left (2.1.5):** testar o mais cedo possível, começando pelo refinamento das histórias.
- **Três amigos (4.5.1):** negócio, desenvolvimento e teste conversam juntos sobre cada história.
- **Pirâmide de testes (5.1.7):** muitos testes rápidos na base (unidade), menos no meio (API/serviço) e poucos no topo (interface).
- **Quadrantes de teste (5.1.8):** organizam os testes por foco (negócio ou tecnologia) e objetivo (apoiar o time ou criticar o produto).

```
            Voltado ao negócio
     Q2 testes funcionais,  │  Q3 exploratório,
        exemplos, histórias │     usabilidade, aceite
  Apoia ────────────────────┼──────────────────── Critica
  o time  Q1 unidade,       │  Q4 desempenho,     o produto
          componente        │     segurança, carga
            Voltado à tecnologia
```

> 💬 **Visão do instrutor:** _como é a rotina de um QA numa Sprint real._

## Para revisar

1. Encontrar 10 falhas no Inscrevi prova que ele tem qualidade baixa? E não encontrar nenhuma prova que tem qualidade alta? Qual princípio responde?
2. A pessoa dev corrigiu o limite de vagas. Que dois tipos de teste você executa em seguida?
3. Em qual quadrante fica o teste exploratório que faremos daqui a pouco?
