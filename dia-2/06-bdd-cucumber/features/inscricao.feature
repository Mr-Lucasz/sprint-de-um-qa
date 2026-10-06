# language: pt

Funcionalidade: Inscrição em minicurso (US04)
  Como estudante cadastrado
  Quero me inscrever em minicursos
  Para garantir minha vaga

  Contexto:
    Dado que estou logado como uma pessoa nova

  Regra: Um curso não aceita mais inscrições do que o número de vagas

    Cenário: Última vaga disponível
      Dado que existe um curso com 2 vagas e 1 pessoa inscrita
      Quando eu me inscrevo nesse curso
      Então a inscrição deve ser confirmada
      E o curso deve ficar com 0 vagas disponíveis

    Cenário: Curso lotado
      Dado que existe um curso com 2 vagas e 2 pessoas inscritas
      Quando eu me inscrevo nesse curso
      Então a inscrição deve ser recusada com a mensagem "Curso sem vagas disponíveis."

  Regra: Cada pessoa se inscreve uma única vez por curso

    Cenário: Tentar se inscrever duas vezes
      Dado que existe um curso com 10 vagas e 0 pessoas inscritas
      E eu já estou inscrito nesse curso
      Quando eu me inscrevo nesse curso
      Então a inscrição deve ser recusada com a mensagem "Você já está inscrito neste curso."
