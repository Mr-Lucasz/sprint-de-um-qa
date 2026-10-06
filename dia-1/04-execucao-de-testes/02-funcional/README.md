# 04.2 · Execução de testes funcionais

Base: CTFL v4.0.1, seção **4.4** (técnicas baseadas na experiência).

Na execução funcional, você valida o comportamento observável do produto pela
interface. A sessão é exploratória: você **aprende, projeta e executa ao mesmo
tempo**, guiado por uma missão. Ela complementa os casos roteirizados e costuma
encontrar o que ninguém pensou em escrever.

Vamos usar **sessões com tempo fixo** (*session-based testing*): cada sessão tem um **charter** (missão), um tempo limite e anotações.

## Como conduzir uma sessão

1. Leia o charter e as histórias relacionadas no [backlog](../../../sprint/backlog.md).
2. Ligue um cronômetro de **20 minutos**.
3. Explore e anote tudo na ficha abaixo: o que testou, o que achou estranho, perguntas.
4. Ao final, reveja as anotações e separe **defeitos**, **dúvidas para o PO** e **ideias de teste**.

Use também a **suposição de erro** (4.4.1): pense nos erros que um dev cometeria e vá atrás deles.

## Charters

Cada dupla pega **um** charter. Ferramentas permitidas: navegador, DevTools e a
documentação da API apenas para observar as chamadas feitas pela interface.

**Charter 1 · Limites de cadastro**
Explore o cadastro de usuário com dados nas bordas e fora delas, para descobrir se as regras da US01 são respeitadas pela tela e pela API.

**Charter 2 · Disputa por vagas**
Explore a inscrição em cursos com poucas vagas usando várias contas, para descobrir se o limite de vagas da US04 é respeitado em todos os caminhos.
_Dica: a Oficina de acessibilidade web tem só 2 vagas._

**Charter 3 · Agenda da pessoa estudante**
Explore inscrições em cursos de datas e horários variados, para descobrir se as regras de duplicidade e de conflito de horário da US04 se sustentam.

**Charter 4 · Ciclo de vida da vaga**
Explore inscrever, cancelar e voltar a se inscrever, observando a programação e "Minhas inscrições", para descobrir se a contagem de vagas (US03 e US06) fica sempre correta.

**Charter 5 · Privacidade**
Explore o que uma pessoa logada consegue ver e fazer com dados de outras pessoas, para descobrir se a US05 e a US06 protegem as informações.
_Dica: observe as URLs da API na aba Network do DevTools._

## Ficha da execução

```
Charter:
Testadores:                          Início:        Duração:
Ambiente (navegador, SO):

Notas (o que testei, o que observei):
-
-

Defeitos encontrados:
-

Dúvidas para o PO:
-

Ideias de teste para depois:
-
```
