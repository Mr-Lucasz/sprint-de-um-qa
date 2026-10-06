# Backlog da Sprint · Inscrevi

**Produto:** Inscrevi, sistema de inscrição em minicursos de eventos acadêmicos.
**Objetivo da Sprint:** permitir que estudantes criem conta, vejam a programação e gerenciem as próprias inscrições com segurança.
**Ambiente de teste (homologação):** `https://inscrevi.vercel.app/t/<ambiente>/` · API: `/t/<ambiente>/api` · Documentação: `/t/<ambiente>/docs`
**Ambiente local:** http://localhost:3000 · API: http://localhost:3000/api · Documentação: http://localhost:3000/docs

As histórias seguem o formato dos 3 Cs (cartão, conversa e confirmação) descrito no syllabus CTFL v4.0, seção 4.5.1. Os critérios de aceite estão em formato de regras, e alguns também em cenários Gherkin.

---

## US01 · Cadastro de usuário

**Como** estudante
**Quero** criar uma conta
**Para** poder me inscrever nos minicursos

**Critérios de aceite**

1. Nome, e-mail e senha são obrigatórios.
2. O nome deve ter entre 3 e 80 caracteres, desconsiderando espaços no início e no fim.
3. O e-mail deve ter formato válido: `nome@dominio.extensao`, com extensão de pelo menos 2 letras.
4. O e-mail é único no sistema, sem diferenciar maiúsculas e minúsculas.
5. A senha deve ter entre 8 e 64 caracteres.
6. Em caso de sucesso a API responde **201** e não devolve a senha.
7. Dados inválidos retornam **400**; e-mail já cadastrado retorna **409**.
8. Na tela, toda recusa mostra uma mensagem que **explica o que corrigir**.

## US02 · Login

**Como** estudante cadastrado
**Quero** entrar na minha conta
**Para** acessar minhas inscrições

**Critérios de aceite**

1. Com e-mail e senha corretos, a API responde **200** com um token.
2. Com credenciais erradas, responde **401** com a mensagem "E-mail ou senha incorretos.", sem indicar qual dos dois está errado.
3. Após entrar, o menu mostra "Minhas inscrições" e a saudação com o primeiro nome.

## US03 · Programação de minicursos

**Como** visitante ou estudante
**Quero** ver os minicursos disponíveis
**Para** escolher em quais me inscrever

**Critérios de aceite**

1. A programação é pública e agrupada por data, em ordem cronológica.
2. Cada curso mostra título, descrição, horário, local e "X de Y vagas disponíveis".
3. Curso sem vagas mostra o botão "Esgotado" desabilitado.
4. O número de vagas disponíveis nunca é negativo e nunca passa do total.

## US04 · Inscrição em minicurso

**Como** estudante logado
**Quero** me inscrever em um minicurso
**Para** garantir minha vaga

**Critérios de aceite**

1. Só é possível se inscrever estando logado (**401** caso contrário).
2. Uma inscrição bem-sucedida retorna **201** e reduz as vagas disponíveis em 1.
3. Um curso **não aceita mais inscrições do que seu número de vagas**. Quando lotado, retorna **409** com "Curso sem vagas disponíveis.".
4. Cada pessoa pode se inscrever **uma única vez** por curso (**409**: "Você já está inscrito neste curso.").
5. Não é permitido se inscrever em dois cursos com **horários sobrepostos** no mesmo dia (**409**: "Conflito de horário com o curso ...").
6. Curso inexistente retorna **404**.

```gherkin
# language: pt
Regra: Um curso não aceita mais inscrições do que o número de vagas

  Cenário: Curso lotado
    Dado que existe um curso com 2 vagas e 2 pessoas inscritas
    Quando eu me inscrevo nesse curso
    Então a inscrição deve ser recusada com a mensagem "Curso sem vagas disponíveis."
```

## US05 · Minhas inscrições

**Como** estudante logado
**Quero** ver a lista das minhas inscrições
**Para** me organizar

**Critérios de aceite**

1. A tela "Minhas inscrições" lista os cursos em que estou inscrito, com data, horário e local.
2. Sem inscrições, a tela mostra um convite para ver a programação.
3. **Cada pessoa só pode ver as próprias inscrições.** Tentar ver as de outra pessoa pela API retorna **403**. Apenas administradores veem as de qualquer pessoa.

## US06 · Cancelamento de inscrição

**Como** estudante logado
**Quero** cancelar uma inscrição
**Para** liberar a vaga para outra pessoa

**Critérios de aceite**

1. O cancelamento retorna **204** e a vaga volta a ficar disponível.
2. Após cancelar, a programação mostra o número de vagas **atualizado**, sem precisar recarregar a página.
3. Cancelar uma inscrição inexistente retorna **404**.
4. Ninguém pode cancelar a inscrição de outra pessoa (**403**), exceto administradores.

---

## Rascunho em refinamento (não implementado)

A **US07** está em [dia-1/02-requisitos](../dia-1/02-requisitos/) e é usada no exercício de análise de requisitos.
