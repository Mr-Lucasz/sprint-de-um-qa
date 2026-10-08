# Dia 1 · Fundamentos, requisitos e testes manuais

Você entra num time que está no meio de uma Sprint. Neste dia você aprende a
analisar uma história, planejar os testes, executar à mão e relatar o que
encontrar.

Cada fase tem duas partes:

- **Aprenda** (o `README.md` da fase): a teoria e um exemplo resolvido no
  [Sauce Demo](https://www.saucedemo.com), para acompanhar fazendo junto.
- **Desafio** (o `DESAFIO.md` da fase): a mesma coisa, sozinho, no Inscrevi.

| Fase | Aprenda (Sauce Demo) | Desafio (Inscrevi) | Você entrega |
|---|---|---|---|
| 01 | [Fundamentos de teste](01-fundamentos/) | [Reconhecimento do produto](01-fundamentos/DESAFIO.md) | Smoke test e mapa do produto |
| 02 | [Requisitos, INVEST e técnicas de teste](02-requisitos/) | [QA de plantão no refinamento](02-requisitos/DESAFIO.md) | Ficha INVEST de uma história |
| 03 | [Casos de teste em BDD e plano de teste](03-casos-de-teste/) | [Cenários e plano da sua história](03-casos-de-teste/DESAFIO.md) | CSV de casos e plano de teste |
| 04 | [Execução funcional](04-execucao-de-testes/02-funcional/) e [execução de API](04-execucao-de-testes/01-api/) | [Executar e explorar](04-execucao-de-testes/02-funcional/DESAFIO.md) e [testar pela API](04-execucao-de-testes/01-api/DESAFIO.md) | Casos com status, ficha da sessão e evidências |
| 05 | [Gestão de defeitos](05-defeitos/) | [Relatar os defeitos](05-defeitos/DESAFIO.md) | Uma issue por defeito |

## O fio que liga as fases

No **Aprenda**, a mesma história atravessa o dia: a
[SD01 · Finalizar compra](02-requisitos/exemplo-saucedemo.md) é refinada na
fase 02, ganha casos e plano na 03, é executada na 04 e gera um relato de bug
na 05.

No **Desafio**, você escolhe **uma história do Inscrevi** na fase 02 e segue
com ela até o fim do dia 2.

## Regras dos desafios

- **Não abra a pasta `app/` no dia 1.** Um QA testando em caixa-preta não vê o
  código. No dia 2 ela fica liberada.
- **O esperado vem da história**, na versão refinada do
  [backlog](../sprint/backlog.md). Se o sistema se comporta diferente, é
  defeito.
- **Guarde as entregas na pasta `minha-sprint/`**, na raiz do seu fork.

A lição de API é a exceção ao Sauce Demo: a loja não tem API pública, então o
exemplo usa as rotas de login do Inscrevi.

Próximo: [dia 2](../dia-2/).
