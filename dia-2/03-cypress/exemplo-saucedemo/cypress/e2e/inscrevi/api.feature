# language: pt
Funcionalidade: API do Inscrevi
  Passos genéricos de API: servem para qualquer rota de qualquer história.

  Cenário: Login com credenciais válidas
    # método e rota são parâmetros; o corpo vem no bloco entre aspas triplas
    Quando envio um POST para "/api/login" com o corpo:
      """
      { "email": "maria@inscrevi.dev", "senha": "Senha@123" }
      """
    # confere o status HTTP
    Então a API responde 200
    # confere que o corpo da resposta tem esse campo
    E a resposta traz o campo "token"

  Cenário: Login com a senha errada
    Quando envio um POST para "/api/login" com o corpo:
      """
      { "email": "maria@inscrevi.dev", "senha": "senha-errada" }
      """
    # 401: não autenticado
    Então a API responde 401
    # confere o texto do campo "mensagem" do corpo
    E a resposta traz a mensagem "E-mail ou senha incorretos."

  Cenário: Rota protegida sem login
    # GET sem corpo e sem token
    Quando envio um GET para "/api/usuarios/me"
    Então a API responde 401

  Cenário: Rota protegida com login
    # pega um token antes; os próximos envios deste cenário vão com ele
    Dado que tenho um token de acesso
    Quando envio um GET para "/api/usuarios/me"
    Então a API responde 200
    E a resposta traz o campo "email"
