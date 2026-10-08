# 04 · Execução de testes

[Trilha](../../README.md#a-trilha) › [Dia 1](../README.md)

Nesta fase o plano vira execução. Há dois caminhos para executar os cenários de
uma história, e cada um tem a sua lição e o seu desafio:

| Caminho | Lição | Desafio no Inscrevi |
|---|---|---|
| Pela interface | [02-funcional](02-funcional/): casos roteirizados e sessão exploratória, no Sauce Demo | [02-funcional/DESAFIO.md](02-funcional/DESAFIO.md) |
| Pela API | [01-api](01-api/): lendo uma resposta HTTP no Postman | [01-api/DESAFIO.md](01-api/DESAFIO.md) |

Comece pela interface: o Sauce Demo não tem API pública, então a lição de API
já usa as rotas de login do Inscrevi como exemplo.

Os dois caminhos usam os mesmos critérios de aceite e precisam de evidências
concretas. Um teste pode passar na API e a interface ainda apresentar uma
falha, ou o contrário.

## O que vale para os dois caminhos

**Três status, e só três:**

| Status | Quando usar |
|---|---|
| Passou | O resultado obtido é igual ao esperado |
| Falhou | O resultado obtido é diferente do esperado |
| Bloqueado | Não foi possível executar (pré-condição impossível, ambiente fora do ar, outro defeito no caminho) |

**Confira a pré-condição antes de agir.** Se o `Dado` não é verdade, o
resultado não quer dizer nada.

**Guarde a evidência na hora.** Print da tela, status HTTP e corpo da resposta.
Reproduzir depois nem sempre dá certo.

**Anote onde testou.** Ambiente, versão, navegador. No Inscrevi, o ambiente e a
versão ficam no rodapé de todas as telas.

**Falhou? Não conserte o esperado.** O esperado vem da história. Se ele estiver
errado, isso é uma dúvida para o PO, não um ajuste silencioso no caso de teste.

## Onde testar o Inscrevi

| Ambiente | Endereço | Quando usar |
|---|---|---|
| Local | http://localhost:3000 (`npm start` na raiz) | O padrão para estudar sozinho: os dados são só seus e voltam ao estado inicial quando você reinicia o app |
| Homologação | https://inscrevi.vercel.app | Para sentir um ambiente compartilhado: outras pessoas criam contas e ocupam vagas ao mesmo tempo que você |

Num ambiente compartilhado, crie as suas próprias contas, não conte com o
estado inicial (uma vaga livre pode ter sido ocupada um minuto antes) e separe
falha de ambiente de falha do produto antes de abrir um bug.

Depois de executar, os defeitos encontrados são relatados na fase
[05 · Gestão de defeitos](../05-defeitos/).
