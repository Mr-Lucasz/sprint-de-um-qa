---
name: qa-execucao
description: Executa os casos de teste de uma história no Inscrevi pela interface, com navegador de verdade, registra passou/falhou/bloqueado com evidência e conduz uma sessão exploratória pelo charter da história. Use quando pedirem para executar casos de teste, rodar os cenários manuais, fazer teste exploratório ou preencher o status do CSV (ex.: "executa os meus casos da US04", "faz uma sessão exploratória do charter 2").
---

# Execução de testes funcionais

Base: CTFL v4.0.1, 4.4 (técnicas baseadas na experiência) e 5.5.

## Entrada

- O arquivo de casos de teste (CSV no formato de
  `dia-1/03-casos-de-teste/casos-de-teste.csv`) ou os cenários colados.
- Ambiente: homologação (https://inscrevi.vercel.app) por padrão; local
  (http://localhost:3000, após `npm start`) se pedirem ou se a homologação
  estiver fora do ar. Registre qual foi usado.

## Antes de executar

1. Abra o app no navegador disponível na sessão e anote **ambiente** e
   **versão** do rodapé (`rodape-ambiente`, `rodape-versao`).
2. Ordene os casos pelo risco definido no plano. Sem plano, comece pelas
   regras de negócio que protegem vaga, acesso e dados de outras pessoas.
3. A homologação é compartilhada: crie contas e cursos próprios para a
   execução (e-mails `nome.sufixo@teste.dev`) em vez de depender dos dados que
   já estão lá. Use as contas de exemplo do `README.md` só quando o caso pedir.

## Para cada caso

1. Monte a pré-condição (o `dado`) e **confira** que ela vale antes de agir.
2. Execute a ação (o `quando`) com os dados do caso.
3. Compare o que aconteceu com o `entao`, olhando a tela e a chamada de rede
   correspondente (método, rota, status e corpo).
4. Registre:

   | Status | Quando usar |
   |---|---|
   | Passou | O obtido é igual ao esperado |
   | Falhou | O obtido é diferente do esperado |
   | Bloqueado | Não deu para executar: pré-condição impossível, ambiente fora do ar, outro defeito no caminho |

5. Em caso de falha, capture a evidência na hora: print e a requisição com
   status e corpo. Depois repita uma vez, com a pré-condição conferida, para
   separar falha do produto de falha do ambiente.

## Sessão exploratória

Quando pedirem exploração, pegue o charter da história na tabela de
`dia-1/04-execucao-de-testes/02-funcional/README.md` e explore por tempo fixo:
bordas e logo depois delas; campos vazios, só com espaços, com acento e emoji;
a mesma ação duas vezes; botão Voltar e endereço digitado à mão; a mesma
operação com outra conta ou sem login. Ao final separe **defeitos**, **dúvidas
para o PO** e **ideias de teste**.

## Regras

- O esperado vem do backlog (`sprint/backlog.md`), não do que o sistema faz.
  Se o sistema diverge do backlog, é falha, mesmo que pareça razoável.
- Não ajuste o caso para ele passar. Caso mal escrito é relatado como
  observação, com o status que ele realmente teve.
- Não chame `POST /api/test/reset` na homologação, nem apague dados que não
  foram criados nesta execução.
- Descreva fatos. Hipótese sobre a causa fica fora do resultado obtido.

## Saída

1. O CSV com `resultado_obtido` e `status` preenchidos (arquivo novo ou o da
   pessoa, se ela pedir).
2. Resumo: total, passou, falhou, bloqueado; ambiente, versão, navegador.
3. Para cada falha: caso, esperado, obtido e evidência, pronto para virar bug
   com a skill `qa-bug`.
4. Achados da sessão exploratória, se houve.
