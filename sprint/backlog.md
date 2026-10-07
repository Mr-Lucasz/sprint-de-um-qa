# Backlog da Sprint · Inscrevi

**Produto:** Inscrevi, sistema de inscrição em minicursos de eventos acadêmicos.
**Objetivo da Sprint:** permitir que estudantes criem conta, vejam a programação e gerenciem as próprias inscrições com segurança.
**Ambiente de teste (homologação):** https://inscrevi.vercel.app · API: https://inscrevi.vercel.app/api · Documentação: https://inscrevi.vercel.app/docs
**Ambiente local:** http://localhost:3000 · API: http://localhost:3000/api · Documentação: http://localhost:3000/docs
**Quadro da Sprint:** https://github.com/users/Mr-Lucasz/projects/4
**Protótipos de tela:** https://claude.ai/artifact/EppH87VQmyfY2aCtzQXuov

> **Versão refinada.** Estas histórias passaram pelo refinamento do time e são a referência para casos de teste, plano de teste, execução e relato de defeitos. Se o sistema se comportar diferente do que está aqui, é defeito.

As histórias seguem o formato dos 3 Cs (cartão, conversa e confirmação) descrito no syllabus CTFL v4.0, seção 4.5.1, com critérios de aceite em cenários Gherkin (seção 4.5.2). US01 a US06 estão implementadas nesta Sprint; as demais são candidatas às próximas.

## Épicos

| Épico | Objetivo | Histórias |
|---|---|---|
| EP01 · Conta e acesso | Permitir que cada estudante tenha uma conta própria e entre nela com segurança. | US01, US02, US08, US09, US10 |
| EP02 · Programação do evento | Mostrar os minicursos do evento de forma que qualquer pessoa consiga escolher o que cursar. | US03, US11, US12 |
| EP03 · Inscrições | Garantir a vaga de quem se inscreve e respeitar o limite de cada minicurso. | US04, US05, US06, US07 |
| EP04 · Gestão dos minicursos | Dar à organização do evento o controle sobre os minicursos oferecidos. | US13, US14 |
| EP05 · Participação e certificação | Registrar quem participou de cada minicurso e emitir o certificado. | US15, US16 |

---

# EP01 · Conta e acesso

## US01 · Cadastro de usuário

### Narrativa de negócio
A Semana Acadêmica recebe cerca de 400 estudantes por edição. Até o ano passado as inscrições nos minicursos eram feitas em planilhas compartilhadas, sem identificação confiável de quem se inscrevia.

### Problemática
Sem uma conta por pessoa, a organização não sabe quem ocupa cada vaga: na última edição, 1 em cada 5 nomes das planilhas estava duplicado ou incompleto.

### Solução proposta
Cada estudante cria a própria conta com nome, e-mail e senha. O e-mail identifica a pessoa e não se repete.

### História
**Como** estudante
**Quero** criar uma conta
**Para** poder me inscrever nos minicursos

### Critérios de aceite
```gherkin
# language: pt
Regra 1: Nome, e-mail e senha são obrigatórios

  Cenário: Campo obrigatório ausente
    Quando tento criar uma conta sem informar o nome, o e-mail ou a senha
    Então a API responde 400

Regra 2: O nome tem entre 3 e 80 caracteres, sem contar espaços no início e no fim

  Esquema do Cenário: Limites do nome
    Quando tento criar uma conta com um nome de <tamanho> caracteres
    Então a API responde <status>

    Exemplos:
      | tamanho | status |
      | 2       | 400    |
      | 3       | 201    |
      | 80      | 201    |
      | 81      | 400    |

Regra 3: O e-mail tem o formato nome@dominio.extensao, com extensão de pelo menos 2 letras

  Esquema do Cenário: Formato do e-mail
    Quando tento criar uma conta com o e-mail "<email>"
    Então a API responde <status>

    Exemplos:
      | email         | status |
      | ana@udesc.br  | 201    |
      | ana           | 400    |
      | ana@          | 400    |
      | ana@empresa   | 400    |
      | ana@empresa.b | 400    |

Regra 4: O e-mail é único, sem diferenciar maiúsculas e minúsculas

  Cenário: E-mail já cadastrado com outra caixa
    Dado que já existe uma conta com o e-mail "ana@udesc.br"
    Quando tento criar outra conta com o e-mail "ANA@UDESC.BR"
    Então a API responde 409 com "Este e-mail já está cadastrado."

Regra 5: A senha tem entre 8 e 64 caracteres

  Esquema do Cenário: Limites da senha
    Quando tento criar uma conta com uma senha de <tamanho> caracteres
    Então a API responde <status>

    Exemplos:
      | tamanho | status |
      | 7       | 400    |
      | 8       | 201    |
      | 64      | 201    |
      | 65      | 400    |

Regra 6: Em caso de sucesso a API responde 201 e não devolve a senha

  Cenário: Cadastro com dados válidos
    Quando crio uma conta com nome, e-mail e senha válidos
    Então a API responde 201 com id, nome, e-mail e perfil
    E a resposta não contém a senha

Regra 7: Dados inválidos retornam 400; e-mail já cadastrado retorna 409

Regra 8: Na tela, toda recusa mostra uma mensagem que explica o que corrigir

  Cenário: Senha curta pela tela
    Dado que estou na tela "Criar conta"
    Quando tento criar uma conta com uma senha de 7 caracteres
    Então vejo a mensagem "A senha deve ter entre 8 e 64 caracteres."
```

### Fora de escopo
Confirmação de e-mail e login com redes sociais.

### Dependências
Nenhuma.

## US02 · Login

### Narrativa de negócio
Com as contas criadas, cada estudante precisa entrar para ver e gerenciar as próprias inscrições. A coordenação pediu atenção à segurança: a tela não pode ajudar quem tenta adivinhar a conta de outra pessoa.

### Problemática
Sem login, qualquer pessoa poderia alterar a inscrição de outra. Em 2025 houve três relatos de inscrições canceladas por terceiros nas planilhas.

### Solução proposta
Login com e-mail e senha. Em caso de erro, a mensagem não indica qual dos dois campos está errado.

### História
**Como** estudante cadastrado
**Quero** entrar na minha conta
**Para** acessar minhas inscrições

### Critérios de aceite
```gherkin
# language: pt
Regra 1: Com e-mail e senha corretos, a API responde 200 com um token

  Cenário: Login com sucesso
    Dado que tenho uma conta com o e-mail "maria@inscrevi.dev"
    Quando informo o e-mail e a senha corretos
    Então a API responde 200 com um token e os meus dados, sem a senha

Regra 2: Com credenciais erradas, responde 401 sem indicar qual campo está errado

  Esquema do Cenário: Credenciais erradas
    Quando tento entrar com <situacao>
    Então a API responde 401 com "E-mail ou senha incorretos."

    Exemplos:
      | situacao                           |
      | e-mail cadastrado e senha errada   |
      | e-mail que não tem conta           |

Regra 3: Após entrar, o menu mostra "Minhas inscrições" e a saudação com o primeiro nome

  Cenário: Cabeçalho depois do login
    Quando entro como "Maria Souza"
    Então vejo a programação
    E o menu mostra "Minhas inscrições"
    E o cabeçalho mostra "Olá, Maria"
```

### Fora de escopo
Recuperação de senha (US09), "manter conectado" e login com conta Google.

### Dependências
US01.

## US08 · Sair da conta

### Narrativa de negócio
Boa parte dos estudantes acessa o Inscrevi nos computadores dos laboratórios, que são compartilhados entre turmas.

### Problemática
Quem esquece a conta aberta deixa as próprias inscrições à mercê da próxima pessoa que sentar no computador.

### Solução proposta
Um botão "Sair" no cabeçalho encerra a sessão no navegador e no servidor.

### História
**Como** estudante logado
**Quero** sair da minha conta
**Para** ninguém usar a minha conta num computador compartilhado

### Critérios de aceite
```gherkin
# language: pt
Regra 1: Sair invalida a sessão no servidor

  Cenário: Token depois de sair
    Dado que estou logado
    Quando saio da conta
    Então a API responde 204 ao pedido de saída
    E o token que eu usava passa a receber 401

Regra 2: Depois de sair, a tela volta ao estado de visitante

  Cenário: Sair pelo cabeçalho
    Dado que estou logado
    Quando clico em "Sair"
    Então vejo a programação e a mensagem "Você saiu da sua conta."
    E o menu mostra "Entrar" e "Criar conta"
    E o cabeçalho não mostra mais a saudação

Regra 3: Páginas de pessoa logada pedem login de novo

  Cenário: Minhas inscrições depois de sair
    Dado que saí da conta
    Quando tento abrir "Minhas inscrições"
    Então sou levado para a tela "Entrar"
```

### Fora de escopo
Expiração automática por inatividade, encerrar sessões em outros dispositivos e troca de senha.

### Dependências
US02.

## US09 · Recuperar senha

### Narrativa de negócio
O evento acontece uma vez por ano. Quem criou a conta numa edição dificilmente lembra a senha na seguinte.

### Problemática
Hoje quem esquece a senha cria outra conta com outro e-mail, o que multiplica contas da mesma pessoa.

### Solução proposta
Na tela de login, o link "Esqueci minha senha" envia um e-mail com um link para definir uma senha nova. A resposta é a mesma para qualquer e-mail informado.

### História
**Como** estudante cadastrado
**Quero** redefinir a minha senha
**Para** voltar a acessar a minha conta

### Critérios de aceite
```gherkin
# language: pt
Regra 1: O pedido responde da mesma forma, exista ou não uma conta com o e-mail

  Esquema do Cenário: Pedido de redefinição
    Quando peço a redefinição para <email>
    Então a API responde 200
    E a tela mostra "Se o e-mail estiver cadastrado, você receberá o link para redefinir a senha."

    Exemplos:
      | email                    |
      | um e-mail com conta      |
      | um e-mail sem conta      |

Regra 2: O link vale por 30 minutos e só pode ser usado uma vez

  Cenário: Link usado duas vezes
    Dado que redefini a senha com um link
    Quando tento usar o mesmo link de novo
    Então a API responde 400 com "Link de redefinição inválido ou expirado."

  Cenário: Link vencido
    Dado que recebi um link há mais de 30 minutos
    Quando tento usá-lo
    Então a API responde 400 com "Link de redefinição inválido ou expirado."

Regra 3: A senha nova segue a regra do cadastro (8 a 64 caracteres)

  Esquema do Cenário: Limites da senha nova
    Dado que abri um link de redefinição válido
    Quando informo uma senha nova de <tamanho> caracteres
    Então a API responde <status>

    Exemplos:
      | tamanho | status |
      | 7       | 400    |
      | 8       | 204    |
      | 64      | 204    |
      | 65      | 400    |

Regra 4: Depois da redefinição só a senha nova funciona, e as sessões abertas são encerradas

  Cenário: Depois de redefinir
    Dado que redefini a minha senha
    Então entrar com a senha antiga responde 401
    E entrar com a senha nova responde 200
    E um token obtido antes da redefinição recebe 401
```

### Fora de escopo
Recuperação por SMS.

### Dependências
US02. O envio de e-mail é simulado: administradores veem as mensagens, com o link, em "E-mails enviados".

## US10 · Editar perfil

### Narrativa de negócio
O nome cadastrado é o que vai impresso na lista de presença e no certificado.

### Problemática
Quem digita o nome errado no cadastro não tem como corrigir e hoje pede a correção por e-mail à organização.

### Solução proposta
Uma tela "Meu perfil" para corrigir o nome. O e-mail aparece na tela, mas não pode ser alterado nesta história.

### História
**Como** estudante logado
**Quero** corrigir o meu nome
**Para** ele sair certo na lista de presença e no certificado

### Critérios de aceite
```gherkin
# language: pt
Regra 1: O nome segue a regra do cadastro (3 a 80 caracteres, sem contar espaços nas pontas)

  Esquema do Cenário: Limites do nome
    Dado que estou logado
    Quando altero o meu nome para um texto de <tamanho> caracteres
    Então a API responde <status>

    Exemplos:
      | tamanho | status |
      | 2       | 400    |
      | 3       | 200    |
      | 80      | 200    |
      | 81      | 400    |

Regra 2: O nome novo aparece logo em seguida

  Cenário: Corrigir o nome
    Dado que estou logado como "Maria Souza"
    Quando altero o meu nome para "Mariana Souza Lima"
    Então vejo "Nome atualizado."
    E o cabeçalho passa a mostrar "Olá, Mariana"

Regra 3: Só o nome pode ser alterado

  Cenário: Tentar alterar o e-mail pela API
    Dado que estou logado
    Quando envio um novo e-mail para PATCH /usuarios/me
    Então a API responde 400 com "Por enquanto só o nome pode ser alterado."

Regra 4: Só a própria pessoa, logada, altera o seu perfil

  Cenário: Sem login
    Quando tento alterar o perfil sem estar logado
    Então a API responde 401
```

### Fora de escopo
Alterar e-mail, senha e foto; excluir a conta.

### Dependências
US01.

---

# EP02 · Programação do evento

## US03 · Programação de minicursos

### Narrativa de negócio
A programação é a vitrine do evento. Muitos estudantes decidem se vão participar olhando a lista de minicursos antes mesmo de criar conta.

### Problemática
A programação era divulgada em PDF e ficava desatualizada: ninguém sabia quais minicursos ainda tinham vaga.

### Solução proposta
Uma página pública, que visitantes acessam sem login, com os minicursos e a situação das vagas.

### História
**Como** visitante ou estudante
**Quero** ver os minicursos disponíveis
**Para** escolher em quais me inscrever

### Critérios de aceite
```gherkin
# language: pt
Regra 1: A programação é pública e agrupada por data, em ordem cronológica

  Cenário: Visitante vê a programação
    Dado que não estou logado
    Quando abro a página "Programação"
    Então vejo os minicursos agrupados por data, da mais próxima para a mais distante
    E dentro de cada data, em ordem de horário de início

Regra 2: Cada minicurso mostra título, descrição, horário, local e "X de Y vagas disponíveis"

  Cenário: Informações do cartão
    Quando abro a página "Programação"
    Então cada minicurso mostra título, descrição, horário, local e "X de Y vagas disponíveis"

Regra 3: Minicurso sem vagas mostra o botão "Esgotado" desabilitado

  Cenário: Minicurso esgotado
    Dado que existe um minicurso com 1 vaga e 1 pessoa inscrita
    Quando abro a página "Programação"
    Então o minicurso mostra "0 de 1 vagas disponíveis"
    E o botão "Esgotado" está desabilitado

Regra 4: O número de vagas disponíveis nunca é negativo e nunca passa do total

  Cenário: Contador dentro dos limites
    Quando abro a página "Programação"
    Então em todo minicurso X fica entre 0 e Y em "X de Y vagas disponíveis"
```

### Fora de escopo
Busca e filtros (US12).

### Dependências
Nenhuma.

## US11 · Detalhes do minicurso

### Narrativa de negócio
A descrição curta da programação não basta para quem está em dúvida entre dois minicursos.

### Problemática
A organização recebe dezenas de perguntas por e-mail sobre pré-requisitos e sobre quem ministra cada minicurso.

### Solução proposta
Uma página por minicurso, aberta ao clicar no título na programação, com as informações completas e a mesma ação de inscrição da programação.

### História
**Como** visitante ou estudante
**Quero** ver os detalhes de um minicurso
**Para** decidir se vale a pena me inscrever

### Critérios de aceite
```gherkin
# language: pt
Regra 1: A página é pública e mostra as informações completas do minicurso

  Cenário: Abrir os detalhes
    Dado que estou na programação
    Quando clico no título de um minicurso
    Então vejo título, descrição, ministrante, pré-requisitos, data, horário e local
    E vejo "X de Y vagas disponíveis", como na programação

Regra 2: A página oferece as mesmas ações da programação

  Esquema do Cenário: Ação disponível
    Dado que estou logado
    Quando abro os detalhes de um minicurso <situacao>
    Então vejo <acao>

    Exemplos:
      | situacao                        | acao                                    |
      | com vagas                       | o botão "Inscrever-se"                  |
      | em que já estou inscrito        | o selo "Você está inscrito"             |
      | esgotado                        | o botão "Esgotado" desabilitado         |

Regra 3: Minicurso inexistente mostra uma mensagem, não uma página quebrada

  Cenário: Endereço de minicurso que não existe
    Quando abro os detalhes de um minicurso que não existe
    Então vejo "Minicurso não encontrado" e um botão "Ver programação"
    E a API responde 404 para esse minicurso
```

### Fora de escopo
Avaliações e comentários de participantes.

### Dependências
US03 e US04.

## US12 · Busca na programação

### Narrativa de negócio
A edição deste ano terá mais de 60 minicursos em cinco dias.

### Problemática
Com a lista longa, encontrar um assunto exige rolar a página inteira, e muita gente desiste antes.

### Solução proposta
Um campo de busca por texto na programação.

### História
**Como** visitante ou estudante
**Quero** buscar minicursos por assunto
**Para** encontrar o que me interessa

### Critérios de aceite
```gherkin
# language: pt
Regra 1: A busca procura o texto no título e na descrição

  Cenário: Buscar por palavra da descrição
    Dado que estou na programação
    Quando busco por "contraste"
    Então vejo apenas "Oficina de acessibilidade web"

Regra 2: A busca não diferencia maiúsculas nem acentos

  Esquema do Cenário: Variações do mesmo termo
    Quando busco por "<termo>"
    Então vejo "Oficina de acessibilidade web"

    Exemplos:
      | termo      |
      | prática    |
      | pratica    |
      | PRATICA    |

Regra 3: Com o campo vazio, a programação inteira aparece

  Cenário: Limpar a busca
    Dado que busquei por um termo
    Quando apago o texto do campo
    Então vejo todos os minicursos de novo

Regra 4: Sem resultado, a tela diz isso

  Cenário: Termo sem resultado
    Quando busco por "culinária"
    Então vejo 'Nenhum minicurso encontrado para "culinária".'

Regra 5: A mesma busca está disponível na API

  Cenário: Busca pela API
    Quando consulto GET /cursos?busca=contraste
    Então a API responde 200 só com os minicursos que têm o termo
```

### Fora de escopo
Filtros por data, local e ministrante; ordenação; favoritos.

### Dependências
US03.

---

# EP03 · Inscrições

## US04 · Inscrição em minicurso

### Narrativa de negócio
A inscrição é o coração do produto. Os laboratórios têm capacidade física limitada e a organização responde pela segurança de quem está na sala.

### Problemática
No ano passado duas salas receberam mais gente do que cabia, porque as planilhas aceitavam nomes depois de lotadas, e várias pessoas se inscreveram em minicursos que aconteciam ao mesmo tempo.

### Solução proposta
O estudante logado se inscreve com um clique. O sistema controla o limite de vagas, impede inscrição repetida e impede minicursos com horários sobrepostos.

### História
**Como** estudante logado
**Quero** me inscrever em um minicurso
**Para** garantir minha vaga

### Critérios de aceite
```gherkin
# language: pt
Regra 1: Só é possível se inscrever estando logado

  Cenário: Inscrição sem login
    Dado que não estou logado
    Quando tento me inscrever em um minicurso pela API
    Então a API responde 401

Regra 2: Uma inscrição bem-sucedida retorna 201 e reduz as vagas disponíveis em 1

  Cenário: Inscrição com vaga disponível
    Dado que estou logado
    E existe um minicurso com 3 vagas e nenhuma pessoa inscrita
    Quando eu me inscrevo nesse minicurso
    Então a API responde 201
    E o minicurso passa a mostrar "2 de 3 vagas disponíveis"

Regra 3: Um minicurso não aceita mais inscrições do que o número de vagas

  Cenário: Minicurso lotado
    Dado que existe um minicurso com 2 vagas e 2 pessoas inscritas
    Quando eu me inscrevo nesse minicurso
    Então a API responde 409 com "Curso sem vagas disponíveis."

Regra 4: Cada pessoa se inscreve uma única vez por minicurso

  Cenário: Inscrição repetida
    Dado que já estou inscrito em um minicurso
    Quando eu me inscrevo nele de novo
    Então a API responde 409 com "Você já está inscrito neste curso."

Regra 5: Não é permitido se inscrever em dois minicursos com horários sobrepostos no mesmo dia

  Esquema do Cenário: Sobreposição de horário
    Dado que estou inscrito em um minicurso das 19:00 às 22:00 de 06/10
    Quando eu me inscrevo em outro minicurso das <inicio> às <fim> de <data>
    Então a API responde <status>

    Exemplos:
      | inicio | fim   | data  | status |
      | 19:00  | 22:00 | 06/10 | 409    |
      | 20:00  | 21:00 | 06/10 | 409    |
      | 22:00  | 23:00 | 06/10 | 201    |
      | 19:00  | 22:00 | 07/10 | 201    |

  Cenário: Mensagem do conflito
    Dado que estou inscrito em "A Sprint de um QA — Dia 1"
    Quando eu me inscrevo em um minicurso com horário sobreposto
    Então a mensagem é 'Conflito de horário com o curso "A Sprint de um QA — Dia 1".'

Regra 6: Minicurso inexistente retorna 404

  Cenário: Minicurso que não existe
    Dado que estou logado
    Quando eu me inscrevo em um minicurso que não existe
    Então a API responde 404
```

### Fora de escopo
Pagamento, e-mail de confirmação com QR code e lista de espera (US07).

### Dependências
US02 e US03.

## US05 · Minhas inscrições

### Narrativa de negócio
Quem se inscreve em vários minicursos precisa de um lugar para conferir a própria agenda. A inscrição é um dado pessoal: mostra onde a pessoa vai estar e a que horas.

### Problemática
Hoje o estudante precisa procurar o próprio nome em cada planilha para lembrar onde se inscreveu.

### Solução proposta
Uma tela "Minhas inscrições" com os minicursos da pessoa logada. Cada pessoa só enxerga as próprias inscrições.

### História
**Como** estudante logado
**Quero** ver a lista das minhas inscrições
**Para** me organizar

### Critérios de aceite
```gherkin
# language: pt
Regra 1: A tela lista os minicursos em que estou inscrito, com data, horário e local

  Cenário: Estudante com inscrições
    Dado que estou logado e inscrito em 2 minicursos
    Quando abro "Minhas inscrições"
    Então vejo os 2 minicursos, cada um com título, data, horário e local

Regra 2: Sem inscrições, a tela mostra um convite para ver a programação

  Cenário: Estudante sem inscrições
    Dado que estou logado e não tenho inscrições
    Quando abro "Minhas inscrições"
    Então vejo "Você ainda não se inscreveu em nenhum minicurso."
    E um botão "Ver programação"

Regra 3: Cada pessoa só pode ver as próprias inscrições; apenas administradores veem as de qualquer pessoa

  Esquema do Cenário: Consulta pela API
    Dado que estou logado como <quem>
    Quando consulto GET /usuarios/{id}/inscricoes com o ID <de_quem>
    Então a API responde <status>

    Exemplos:
      | quem          | de_quem          | status |
      | estudante     | da minha conta   | 200    |
      | estudante     | de outra pessoa  | 403    |
      | administrador | de outra pessoa  | 200    |
```

### Fora de escopo
Exportar a agenda para o calendário.

### Dependências
US04.

## US06 · Cancelamento de inscrição

### Narrativa de negócio
Imprevistos acontecem. Uma vaga ocupada por quem não vai aparecer é uma vaga perdida para quem ficou de fora.

### Problemática
No ano passado cerca de 30% das pessoas inscritas não compareceram, e os minicursos mais procurados tinham cadeiras vazias e gente barrada.

### Solução proposta
O estudante cancela a própria inscrição e a vaga é liberada na hora.

### História
**Como** estudante logado
**Quero** cancelar uma inscrição
**Para** liberar a vaga para outra pessoa

### Critérios de aceite
```gherkin
# language: pt
Regra 1: O cancelamento retorna 204 e a vaga volta a ficar disponível

  Cenário: Cancelar uma inscrição
    Dado que estou inscrito em um minicurso com "2 de 3 vagas disponíveis"
    Quando cancelo a inscrição
    Então a API responde 204
    E o minicurso volta a ter 3 vagas disponíveis

Regra 2: Após cancelar, a programação mostra o número de vagas atualizado, sem recarregar a página

  Cenário: Voltar para a programação pelo menu
    Dado que acabei de cancelar uma inscrição em "Minhas inscrições"
    Quando volto para a "Programação" pelo menu, sem recarregar a página
    Então o minicurso mostra o número de vagas já atualizado

Regra 3: Cancelar uma inscrição inexistente retorna 404

  Cenário: Inscrição inexistente
    Dado que estou logado
    Quando cancelo uma inscrição que não existe
    Então a API responde 404

Regra 4: Ninguém cancela a inscrição de outra pessoa, exceto administradores

  Esquema do Cenário: Cancelar inscrição alheia
    Dado que estou logado como <quem>
    Quando cancelo a inscrição de outra pessoa
    Então a API responde <status>

    Exemplos:
      | quem          | status |
      | estudante     | 403    |
      | administrador | 204    |
```

### Fora de escopo
Reembolso e prazo limite para cancelar.

### Dependências
US04.

## US07 · Lista de espera

### Narrativa de negócio
Os minicursos mais disputados lotam nos primeiros minutos. Como muita gente cancela depois, a organização quer aproveitar essas vagas.

### Problemática
Quem encontra o minicurso lotado desiste e não volta para conferir se abriu vaga.

### Solução proposta
Quem encontra um minicurso lotado entra numa fila de até 10 pessoas e vê a própria posição. Quando alguém cancela, a vaga vai para a primeira pessoa da fila que possa ocupá-la, e ela é avisada por e-mail.

### História
**Como** estudante logado
**Quero** entrar numa lista de espera quando o minicurso estiver lotado
**Para** não perder a chance de participar

### Critérios de aceite
```gherkin
# language: pt
Regra 1: Só entra na lista de espera quem está logado

  Cenário: Sem login
    Quando tento entrar na lista de espera pela API sem estar logado
    Então a API responde 401

Regra 2: A lista de espera só existe para minicurso sem vagas

  Cenário: Minicurso com vagas
    Dado que existe um minicurso com vagas disponíveis
    Quando tento entrar na lista de espera dele
    Então a API responde 409 com "Este curso ainda tem vagas disponíveis."
    E na tela o botão "Entrar na lista de espera" só aparece em minicurso esgotado

Regra 3: Quem já está inscrito no minicurso não entra na fila dele

  Cenário: Pessoa já inscrita
    Dado que estou inscrito em um minicurso lotado
    Quando tento entrar na lista de espera dele
    Então a API responde 409 com "Você já está inscrito neste curso."

Regra 4: Cada pessoa entra uma única vez na fila de cada minicurso

  Cenário: Entrada repetida
    Dado que já estou na lista de espera de um minicurso
    Quando tento entrar de novo
    Então a API responde 409 com "Você já está na lista de espera deste curso."

Regra 5: A fila tem no máximo 10 pessoas

  Cenário: Fila cheia
    Dado que a lista de espera de um minicurso tem 10 pessoas
    Quando tento entrar nela
    Então a API responde 409 com "A lista de espera deste curso está cheia."

Regra 6: Ao entrar, a pessoa vê a própria posição

  Cenário: Entrar na fila
    Dado que a lista de espera de um minicurso lotado tem 2 pessoas
    Quando entro nela
    Então a API responde 201 com a posição 3
    E a tela mostra "Você é a 3ª pessoa na lista de espera"

Regra 7: A pessoa pode sair da fila

  Cenário: Sair da lista de espera
    Dado que estou na lista de espera de um minicurso
    Quando saio da lista
    Então a API responde 204
    E sair de novo responde 404

Regra 8: Quando uma inscrição é cancelada, a vaga vai para a primeira pessoa da fila sem conflito de horário

  Cenário: Promoção da primeira pessoa
    Dado que sou a 1ª pessoa da lista de espera de um minicurso lotado
    Quando alguém cancela a inscrição nesse minicurso
    Então passo a estar inscrito nele e saio da fila
    E o minicurso continua com 0 vagas disponíveis

  Cenário: Primeira pessoa com conflito de horário
    Dado que a 1ª pessoa da fila está inscrita em outro minicurso com horário sobreposto
    Quando alguém cancela a inscrição
    Então a 2ª pessoa da fila é inscrita
    E a 1ª pessoa continua na fila, na posição 1

Regra 9: Quem ganha a vaga é avisado por e-mail

  Cenário: Aviso de vaga
    Quando sou inscrito a partir da lista de espera
    Então recebo um e-mail com o assunto "Sua vaga foi confirmada"
```

### Fora de escopo
Prioridade por curso ou semestre e aviso por outros canais.

### Dependências
US04 e US06. O envio de e-mail é simulado: administradores veem as mensagens em "E-mails enviados".

---

# EP04 · Gestão dos minicursos

## US13 · Administrador cria minicurso

### Narrativa de negócio
A programação muda até a véspera do evento: ministrantes confirmam em cima da hora e salas são remanejadas.

### Problemática
Hoje cada minicurso novo precisa ser inserido pelo time de desenvolvimento, direto no banco de dados.

### Solução proposta
Administradores cadastram minicursos pelo sistema, informando título, descrição, ministrante, pré-requisitos, data, horário, local e número de vagas.

### História
**Como** administrador
**Quero** cadastrar um minicurso
**Para** publicar a programação sem depender do time de desenvolvimento

### Critérios de aceite
```gherkin
# language: pt
Regra 1: Só administradores cadastram minicursos

  Esquema do Cenário: Quem pode cadastrar
    Quando tento cadastrar um minicurso <como>
    Então a API responde <status>

    Exemplos:
      | como                       | status |
      | sem estar logado           | 401    |
      | logado como estudante      | 403    |
      | logado como administrador  | 201    |

  Cenário: Mensagem para quem não é administrador
    Dado que estou logado como estudante
    Quando tento cadastrar um minicurso
    Então a mensagem é "Apenas administradores podem fazer isso."

Regra 2: O título tem pelo menos 3 caracteres

  Cenário: Título curto
    Dado que estou logado como administrador
    Quando cadastro um minicurso com o título "QA"
    Então a API responde 400

Regra 3: A data segue AAAA-MM-DD, os horários seguem HH:MM e o início vem antes do término

  Esquema do Cenário: Horários
    Dado que estou logado como administrador
    Quando cadastro um minicurso das <inicio> às <fim>
    Então a API responde <status>

    Exemplos:
      | inicio | fim   | status |
      | 19:00  | 21:00 | 201    |
      | 21:00  | 19:00 | 400    |
      | 19:00  | 19:00 | 400    |

Regra 4: O número de vagas é um inteiro entre 1 e 500

  Esquema do Cenário: Limites das vagas
    Dado que estou logado como administrador
    Quando cadastro um minicurso com <vagas> vagas
    Então a API responde <status>

    Exemplos:
      | vagas | status |
      | 0     | 400    |
      | 1     | 201    |
      | 500   | 201    |
      | 501   | 400    |

Regra 5: O minicurso criado aparece na programação

  Cenário: Cadastro válido
    Dado que estou logado como administrador
    Quando cadastro um minicurso válido com 30 vagas
    Então ele aparece na programação com "30 de 30 vagas disponíveis"
```

### Fora de escopo
Editar, duplicar e importar minicursos de planilha; aprovação por uma segunda pessoa.

### Dependências
US02.

## US14 · Administrador exclui minicurso

### Narrativa de negócio
Minicursos são cancelados quando o ministrante desiste ou a sala fica indisponível.

### Problemática
Um minicurso cancelado que continua na programação gera inscrições em algo que não vai acontecer.

### Solução proposta
Administradores excluem minicursos da programação. Para proteger quem já se organizou, um minicurso com pessoas inscritas não pode ser excluído.

### História
**Como** administrador
**Quero** excluir um minicurso
**Para** manter a programação fiel ao que vai acontecer

### Critérios de aceite
```gherkin
# language: pt
Regra 1: Só administradores excluem minicursos

  Cenário: Estudante tenta excluir
    Dado que estou logado como estudante
    Quando tento excluir um minicurso
    Então a API responde 403

Regra 2: Minicurso com inscrições não pode ser excluído

  Cenário: Excluir minicurso com inscritos
    Dado que estou logado como administrador
    E existe um minicurso com 1 pessoa inscrita
    Quando tento excluí-lo
    Então a API responde 409 com "Não é possível excluir um curso com inscrições."
    E o minicurso continua na programação

Regra 3: Minicurso sem inscrições é excluído e sai da programação

  Cenário: Excluir minicurso vazio
    Dado que estou logado como administrador
    E existe um minicurso sem inscrições
    Quando excluo o minicurso
    Então a API responde 204
    E ele não aparece mais na programação

Regra 4: Minicurso inexistente retorna 404

  Cenário: Excluir minicurso que não existe
    Dado que estou logado como administrador
    Quando tento excluir um minicurso que não existe
    Então a API responde 404

Regra 5: A exclusão é definitiva e a tela pede confirmação

  Cenário: Confirmação na tela
    Dado que estou em "Gerenciar minicursos"
    Quando clico em "Excluir" num minicurso
    Então a tela pergunta se quero excluir, citando o título dele e avisando que a ação não pode ser desfeita
    E nada é excluído se eu cancelar
```

### Fora de escopo
Remarcar o minicurso, desfazer a exclusão e avisar inscritos.

### Dependências
US13.

---

# EP05 · Participação e certificação

## US15 · Lista de presença

### Narrativa de negócio
A universidade só valida horas complementares de quem comprova participação, não de quem apenas se inscreveu.

### Problemática
A presença é colhida em papel, e as folhas se perdem entre a sala e a secretaria.

### Solução proposta
Administradores registram, minicurso por minicurso, a presença de quem está inscrito.

### História
**Como** administrador
**Quero** registrar a presença nos minicursos
**Para** comprovar a participação de quem esteve presente

### Critérios de aceite
```gherkin
# language: pt
Regra 1: Só administradores veem e registram presença

  Cenário: Estudante tenta registrar presença
    Dado que estou logado como estudante
    Quando tento registrar uma presença pela API
    Então a API responde 403

Regra 2: A lista de presença mostra todas as pessoas inscritas no minicurso

  Cenário: Abrir a lista de presença
    Dado que estou logado como administrador
    E um minicurso tem 3 pessoas inscritas
    Quando abro a lista de presença dele
    Então vejo as 3 pessoas, com nome e e-mail, cada uma marcada como presente ou ausente

Regra 3: Só quem está inscrito no minicurso pode ter presença

  Cenário: Pessoa sem inscrição
    Dado que estou logado como administrador
    Quando registro a presença de uma pessoa que não está inscrita no minicurso
    Então a API responde 409 com "A pessoa precisa estar inscrita no minicurso."

Regra 4: A presença pode ser marcada e desmarcada sem duplicar

  Cenário: Marcar duas vezes e desmarcar
    Dado que estou logado como administrador
    Quando marco a presença da mesma pessoa duas vezes
    Então ela aparece como presente uma única vez
    E ao desmarcar ela volta a aparecer como ausente

Regra 5: Cancelar a inscrição apaga a presença

  Cenário: Inscrição cancelada depois da presença
    Dado que uma pessoa tem presença registrada num minicurso
    Quando a inscrição dela é cancelada
    Então ela sai da lista de presença
```

### Fora de escopo
Exportar a lista em PDF ou Excel e presença marcada pelo próprio estudante.

### Dependências
US04.

## US16 · Certificado de participação

### Narrativa de negócio
O certificado é o principal motivo de inscrição para quem precisa de horas complementares.

### Problemática
Os certificados são feitos à mão e chegam por e-mail semanas depois do evento.

### Solução proposta
Quem tem a presença registrada num minicurso baixa o certificado em PDF, com um código que qualquer pessoa pode conferir.

### História
**Como** estudante logado
**Quero** baixar o meu certificado
**Para** comprovar a minha participação

### Critérios de aceite
```gherkin
# language: pt
Regra 1: O certificado só existe para quem tem presença registrada

  Cenário: Sem presença
    Dado que estou inscrito num minicurso e a minha presença não foi registrada
    Quando peço o certificado pela API
    Então a API responde 409 com "O certificado fica disponível depois que a sua presença for registrada."
    E em "Minhas inscrições" não há botão "Baixar certificado" para esse minicurso

  Cenário: Com presença
    Dado que a minha presença foi registrada num minicurso
    Quando clico em "Baixar certificado" em "Minhas inscrições"
    Então recebo um arquivo PDF

Regra 2: Cada pessoa só baixa os próprios certificados; administradores baixam os de qualquer pessoa

  Esquema do Cenário: Certificado de outra pessoa
    Dado que estou logado como <quem>
    Quando peço o certificado da inscrição de outra pessoa
    Então a API responde <status>

    Exemplos:
      | quem          | status |
      | estudante     | 403    |
      | administrador | 200    |

Regra 3: O certificado traz o nome da pessoa, o minicurso, a data e a carga horária

  Cenário: Conteúdo do certificado
    Dado que participei de um minicurso das 19:00 às 22:00
    Quando baixo o certificado
    Então ele mostra o meu nome, o título do minicurso e a data
    E a carga horária é de 3 horas, a duração do minicurso

Regra 4: O certificado tem um código de verificação que qualquer pessoa pode conferir

  Esquema do Cenário: Conferir o código
    Quando consulto GET /certificados/{codigo} com <codigo>
    Então a API responde <status>

    Exemplos:
      | codigo                          | status |
      | o código impresso no certificado | 200    |
      | um código que não existe        | 404    |
```

### Fora de escopo
Certificado para ministrantes e percentual mínimo de presença em minicursos de vários encontros.

### Dependências
US05 e US15.
