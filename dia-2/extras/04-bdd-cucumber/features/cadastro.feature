# language: pt
# Referência de Gherkin: https://cucumber.io/docs/gherkin/reference/

Funcionalidade: Cadastro de usuário (US01)
  Como estudante
  Quero criar uma conta no Inscrevi
  Para poder me inscrever nos minicursos

  Regra: A senha deve ter entre 8 e 64 caracteres

    Esquema do Cenário: Validar o tamanho da senha nos limites
      Dado que sou uma pessoa ainda não cadastrada
      Quando eu me cadastro com uma senha de <tamanho> caracteres
      Então o cadastro deve ser <resultado>

      Exemplos:
        | tamanho | resultado |
        | 7       | recusado  |
        | 8       | aceito    |
        | 64      | aceito    |
        | 65      | recusado  |

  Regra: O e-mail deve ser único e ter formato válido

    Cenário: Recusar e-mail já cadastrado
      Dado que já existe uma conta com o e-mail "maria@inscrevi.dev"
      Quando eu me cadastro com o e-mail "maria@inscrevi.dev"
      Então o cadastro deve ser recusado
      E devo ver a mensagem "Este e-mail já está cadastrado."

    Esquema do Cenário: Recusar e-mails em formato inválido
      Dado que sou uma pessoa ainda não cadastrada
      Quando eu me cadastro com o e-mail "<email>"
      Então o cadastro deve ser recusado

      Exemplos:
        | email       |
        | ana         |
        | ana@        |
        | ana@empresa |
