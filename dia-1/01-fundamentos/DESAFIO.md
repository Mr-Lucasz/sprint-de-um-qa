# Desafio 01 · Reconhecimento do Inscrevi

Lição desta fase: [Fundamentos de teste](README.md).

Você acabou de entrar no time do **Inscrevi**, um sistema de inscrição em
minicursos, no meio de uma Sprint. Antes de testar qualquer história, um QA
conhece o produto. O Inscrevi tem defeitos **de propósito**, e você ainda não
sabe onde.

## Preparação

Suba o Inscrevi na sua máquina (`npm install` e `npm start`, na raiz do
repositório) e abra http://localhost:3000. As contas de exemplo estão no
[README principal](../../README.md#contas-de-exemplo).

> **Regra dos desafios do dia 1:** não abra a pasta `app/`. Você está testando
> em caixa-preta.

## Tarefas (20 min)

1. **Smoke test.** Em 5 minutos, percorra o caminho principal: criar uma conta,
   entrar, ver a programação, inscrever-se num minicurso e conferir em "Minhas
   inscrições". Anote o que funcionou e o que não funcionou. O sistema está em
   condições de receber testes mais profundos?
2. **Mapa do produto.** Liste as telas que você encontrou e, para cada uma, o
   que a pessoa consegue fazer nela. Abra também http://localhost:3000/docs e
   veja quais rotas a API oferece.
3. **Níveis e tipos.** Para cada item, diga o nível e o tipo de teste:
   - conferir, pela tela, se a inscrição respeita o limite de vagas;
   - chamar `POST /api/login` direto e conferir o status;
   - medir quanto tempo a programação leva para abrir;
   - navegar pelo cadastro usando só o teclado.
4. **Erro, defeito e falha.** Se algo estranho apareceu no smoke test, descreva
   a **falha** que você viu. Qual **defeito** poderia causá-la? Que **erro**
   humano poderia ter levado a ele? (São hipóteses: num relato de bug entra só
   a falha.)
5. **Princípios.** Responda em uma frase cada:
   - Encontrar 10 falhas no Inscrevi prova que ele tem qualidade baixa? E não
     encontrar nenhuma prova que tem qualidade alta?
   - Onde você investiria mais tempo de teste neste sistema, e por quê?

## O que você entrega

Um arquivo de anotações seu (por exemplo `minha-sprint/01-reconhecimento.md`)
com o resultado do smoke test, o mapa do produto e as respostas.

## Confira antes de seguir

- [ ] O smoke test tem um veredito claro (segue ou não segue para os testes)?
- [ ] O mapa cita telas **e** rotas da API?
- [ ] Na tarefa 4, a falha é um fato observado, e defeito e erro estão marcados
      como hipótese?

Próxima fase: [02 · Análise de requisitos](../02-requisitos/).
