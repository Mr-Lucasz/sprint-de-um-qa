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

Cada pessoa pega **o charter da sua história** (a tabela abaixo diz qual).
Ferramentas permitidas: navegador, DevTools e a documentação da API apenas para
observar as chamadas feitas pela interface.

| Sua história | Charter |
|---|---|
| US01 | 1 |
| US04 | 2 e 3 |
| US03, US06 | 4 |
| US05 | 5 |
| US02, US08, US09, US10 | 6 |
| US07 | 7 |
| US11, US12 | 8 |
| US13, US14 | 9 |
| US15, US16 | 10 |

**Charter 1 · Limites de cadastro**
Explore o cadastro de usuário com dados nas bordas e fora delas, para descobrir se as regras da US01 são respeitadas pela tela e pela API.

**Charter 2 · Disputa por vagas**
Explore a inscrição em cursos com poucas vagas usando várias contas, para descobrir se o limite de vagas da US04 é respeitado em todos os caminhos.
_Dica: a Oficina de acessibilidade web tem só 2 vagas. Como a turma inteira usa o mesmo sistema, ela pode já estar cheia: confira antes de começar e, se precisar, peça ao instrutor para reiniciar os dados._

**Charter 3 · Agenda da pessoa estudante**
Explore inscrições em cursos de datas e horários variados, para descobrir se as regras de duplicidade e de conflito de horário da US04 se sustentam.

**Charter 4 · Ciclo de vida da vaga**
Explore inscrever, cancelar e voltar a se inscrever, observando a programação e "Minhas inscrições", para descobrir se a contagem de vagas (US03 e US06) fica sempre correta.

**Charter 5 · Privacidade**
Explore o que uma pessoa logada consegue ver e fazer com dados de outras pessoas, para descobrir se a US05 e a US06 protegem as informações.
_Dica: observe as URLs da API na aba Network do DevTools._

**Charter 6 · Acesso à conta**
Explore entrar, sair, recuperar a senha e corrigir o nome, para descobrir se a conta de uma pessoa fica protegida e correta do começo ao fim (US02, US08, US09 e US10).
_Dica: os e-mails não são enviados de verdade. Entre com a conta de administrador de exemplo e abra "E-mails enviados" para achar o link de redefinição._

**Charter 7 · Fila pela vaga**
Explore a lista de espera de um minicurso lotado com várias contas, entrando, saindo e cancelando inscrições, para descobrir se a vaga liberada vai para a pessoa certa (US07).
_Dica: experimente uma pessoa da fila que já tem outro minicurso no mesmo horário._

**Charter 8 · Encontrar e conhecer um minicurso**
Explore a busca da programação e a página de detalhes com termos variados, endereços digitados à mão e minicursos em situações diferentes, para descobrir se a pessoa sempre chega à informação certa (US11 e US12).

**Charter 9 · Administração da programação**
Explore o cadastro e a exclusão de minicursos com dados nas bordas e fora delas, e com contas de perfis diferentes, para descobrir se só quem pode consegue mexer na programação (US13 e US14).
_Dica: use a conta de administrador de exemplo e compare com o que uma conta de estudante consegue fazer pela API._

**Charter 10 · Da presença ao certificado**
Explore o registro de presença e o download do certificado, com e sem presença e com contas diferentes, para descobrir se o certificado só chega a quem participou e com os dados certos (US15 e US16).

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
