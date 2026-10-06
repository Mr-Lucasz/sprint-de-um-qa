# Backlog da Sprint · Inscrevi

**Produto:** Inscrevi, sistema de inscrição em minicursos de eventos acadêmicos.
**Objetivo da Sprint:** permitir que estudantes criem conta, vejam a programação e gerenciem as próprias inscrições com segurança.
**Ambiente de teste (homologação):** https://inscrevi.vercel.app · API: https://inscrevi.vercel.app/api · Documentação: https://inscrevi.vercel.app/docs
**Ambiente local:** http://localhost:3000 · API: http://localhost:3000/api · Documentação: http://localhost:3000/docs
**Quadro da Sprint:** https://github.com/users/Mr-Lucasz/projects/4
**Protótipos de tela:** https://claude.ai/artifact/EppH87VQmyfY2aCtzQXuov

> **Estas histórias são rascunhos e ainda não passaram pelo refinamento.** Elas chegaram do PO como estão. Antes de qualquer teste, o time avalia cada uma com o INVEST (veja [dia-1/02-requisitos](../dia-1/02-requisitos/)) e registra os apontamentos na issue correspondente. A versão fechada no refinamento substitui este arquivo.

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
Cada estudante cria a própria conta com nome, e-mail e senha. O e-mail identifica a pessoa e não pode se repetir. A senha deve ter entre 8 e 64 caracteres. O botão "Criar conta" deve ser verde, ficar no canto inferior direito do formulário e usar fonte Arial 14.

### História
**Como** estudante
**Quero** criar uma conta
**Para** poder me inscrever nos minicursos

### Critérios de aceite
```gherkin
# language: pt
Regra: Nome, e-mail e senha são obrigatórios

  Cenário: Cadastro com dados válidos
    Dado que estou na tela "Criar conta"
    Quando informo um nome válido, o e-mail "ana@udesc.br" e a senha "abc123"
    Então a conta é criada
    E a resposta da API é 201 e não devolve a senha

Regra: O e-mail identifica a pessoa

  Cenário: E-mail já cadastrado
    Dado que já existe uma conta com o e-mail "ana@udesc.br"
    Quando tento criar outra conta com o mesmo e-mail
    Então o cadastro é recusado com 409

  Cenário: E-mail em formato inválido
    Quando tento criar uma conta com o e-mail "ana@"
    Então o sistema deve tratar o erro adequadamente

Regra: A senha deve ter entre 8 e 64 caracteres

  Cenário: Senha longa demais
    Quando tento criar uma conta com uma senha de 65 caracteres
    Então o cadastro é recusado com 400
    E a tela mostra uma mensagem que explica o que corrigir
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
Login com e-mail e senha. Em caso de erro, a mensagem não indica qual dos dois campos está errado. O login também deve oferecer "manter conectado por 30 dias" e entrada com conta Google.

### História
**Como** estudante cadastrado
**Quero** entrar na minha conta
**Para** o sistema registrar o meu acesso

### Critérios de aceite
```gherkin
# language: pt
Regra: Credenciais corretas dão acesso

  Cenário: Login com sucesso
    Dado que tenho uma conta com o e-mail "maria@inscrevi.dev"
    Quando informo o e-mail e a senha corretos
    Então devo entrar rapidamente
    E o menu mostra "Minhas inscrições" e a saudação com o meu primeiro nome

Regra: Credenciais erradas não dão acesso

  Cenário: Senha incorreta
    Dado que tenho uma conta com o e-mail "maria@inscrevi.dev"
    Quando informo o e-mail correto e uma senha errada
    Então a API responde 401
    E a tela mostra "Senha incorreta."
```

### Fora de escopo
Recuperação de senha (US09).

### Dependências
US01.

## US08 · Sair da conta

### Narrativa de negócio
Boa parte dos estudantes acessa o Inscrevi nos computadores dos laboratórios, que são compartilhados entre turmas.

### Problemática
Quem esquece a conta aberta deixa as próprias inscrições à mercê da próxima pessoa que sentar no computador.

### Solução proposta
Um botão "Sair" no cabeçalho encerra a sessão. A mesma tela deve permitir encerrar as sessões em outros dispositivos e trocar a senha.

### História
**Como** estudante logado
**Quero** sair da minha conta
**Para** o servidor economizar memória

### Critérios de aceite
```gherkin
# language: pt
Regra: Sair encerra a sessão

  Cenário: Sair pelo cabeçalho
    Dado que estou logado
    Quando clico em "Sair"
    Então a sessão é encerrada corretamente
    E volto para a programação
```

### Fora de escopo
Expiração automática da sessão por inatividade.

### Dependências
US02.

## US09 · Recuperar senha

### Narrativa de negócio
O evento acontece uma vez por ano. Quem criou a conta numa edição dificilmente lembra a senha na seguinte.

### Problemática
Hoje quem esquece a senha cria outra conta com outro e-mail, o que multiplica contas da mesma pessoa.

### Solução proposta
Na tela de login, o link "Esqueci minha senha" envia um e-mail com um link para definir uma senha nova.

### História
**Como** estudante cadastrado
**Quero** redefinir a minha senha
**Para** voltar a acessar a minha conta

### Critérios de aceite
```gherkin
# language: pt
Regra: O link de redefinição vai para o e-mail da conta

  Cenário: E-mail cadastrado
    Dado que tenho uma conta com o e-mail "maria@inscrevi.dev"
    Quando peço a redefinição para esse e-mail
    Então recebo um link que expira em pouco tempo

  Cenário: E-mail não cadastrado
    Quando peço a redefinição para "ninguem@udesc.br"
    Então a tela mostra "E-mail não cadastrado."

Regra: A senha nova segue a regra de senha

  Cenário: Definir a senha nova
    Dado que abri um link de redefinição válido
    Quando informo uma senha nova com pelo menos 6 caracteres
    Então a senha é alterada e posso entrar com ela
```

### Fora de escopo
Recuperação por SMS.

### Dependências
US02.

## US10 · Editar perfil

### Narrativa de negócio
O nome cadastrado é o que vai impresso na lista de presença e no certificado.

### Problemática
Quem digita o nome errado no cadastro não tem como corrigir e hoje pede a correção por e-mail à organização.

### Solução proposta
Uma tela "Meu perfil" para alterar nome, e-mail, senha e foto, e também para excluir a conta. Os dados devem ser gravados na tabela usuarios_v2, com a foto na coluna foto_blob.

### História
**Como** estudante logado
**Quero** editar os dados do meu perfil
**Para** manter o meu cadastro correto

### Critérios de aceite
```gherkin
# language: pt
Regra: A pessoa altera os próprios dados

  Cenário: Corrigir o nome
    Dado que estou logado
    Quando altero o meu nome para "Maria Souza Lima"
    Então o nome é atualizado
    E a saudação do cabeçalho passa a mostrar o novo primeiro nome

  Cenário: Trocar o e-mail
    Dado que estou logado
    Quando altero o meu e-mail
    Então o e-mail é atualizado
```

### Fora de escopo
Nenhum item definido.

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
Uma página pública, que visitantes acessam sem login, com os minicursos e a situação das vagas em tempo real.

### História
**Como** visitante ou estudante
**Quero** ver os minicursos disponíveis
**Para** escolher em quais me inscrever

### Critérios de aceite
```gherkin
# language: pt
Regra: A programação mostra todos os minicursos

  Cenário: Ver a programação
    Dado que estou logado
    Quando abro a página "Programação"
    Então vejo os minicursos organizados da melhor forma
    E cada minicurso mostra título, descrição, horário, local e "X de Y vagas disponíveis"

Regra: Minicurso sem vagas não aceita inscrição

  Cenário: Minicurso esgotado
    Dado que estou logado
    E existe um minicurso com 1 vaga e 1 pessoa inscrita
    Quando abro a página "Programação"
    Então o minicurso mostra "0 de 1 vagas disponíveis"
    E o botão "Esgotado" permite entrar na lista de espera
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
Uma página por minicurso, aberta ao clicar no título na programação.

### História
**Como** visitante ou estudante
**Quero** ver os detalhes de um minicurso
**Para** decidir se vale a pena me inscrever

### Critérios de aceite
```gherkin
# language: pt
Regra: A página mostra as informações do minicurso

  Cenário: Abrir os detalhes
    Dado que estou na programação
    Quando clico no título de um minicurso
    Então vejo todas as informações relevantes
    E vejo a quantidade de vagas ocupadas
    E vejo a nota média das avaliações do minicurso
```

### Fora de escopo
Comentários de participantes.

### Dependências
US03.

## US12 · Busca na programação

### Narrativa de negócio
A edição deste ano terá mais de 60 minicursos em cinco dias.

### Problemática
Com a lista longa, encontrar um assunto exige rolar a página inteira, e muita gente desiste antes.

### Solução proposta
Um campo de busca na programação, mais filtros por data, local e ministrante, ordenação e uma lista de favoritos. A busca deve usar Elasticsearch.

### História
**Como** visitante ou estudante
**Quero** buscar minicursos por assunto
**Para** encontrar o que me interessa

### Critérios de aceite
```gherkin
# language: pt
Regra: A busca encontra minicursos pelo texto

  Cenário: Buscar por palavra
    Dado que estou na programação
    Quando busco por "teste"
    Então vejo resultados relevantes rapidamente
```

### Fora de escopo
Recomendações personalizadas.

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
O estudante logado se inscreve com um clique. O sistema controla o limite de vagas, impede inscrição repetida e impede cursos no mesmo horário. Após a inscrição, o estudante recebe um e-mail de confirmação com QR code para a entrada.

### História
**Como** estudante logado
**Quero** me inscrever em um minicurso
**Para** garantir minha vaga

### Critérios de aceite
```gherkin
# language: pt
Regra: O minicurso aceita inscrições até ultrapassar o número de vagas

  Cenário: Inscrição com vaga disponível
    Dado que estou logado
    E existe um minicurso com 2 vagas e 1 pessoa inscrita
    Quando eu me inscrevo nesse minicurso
    Então a API responde 201
    E as vagas disponíveis diminuem em 1

  Cenário: Minicurso lotado
    Dado que estou logado
    E existe um minicurso lotado
    Quando eu me inscrevo nesse minicurso
    Então a inscrição deve ser recusada com a mensagem "Curso sem vagas disponíveis."

Regra: Cada pessoa se inscreve uma única vez por minicurso

  Cenário: Inscrição repetida
    Dado que já estou inscrito em um minicurso
    Quando eu me inscrevo nele de novo
    Então a API responde 409 com "Você já está inscrito neste curso."

Regra: Não é permitido se inscrever em minicursos no mesmo horário

  Cenário: Dois minicursos às 19:00 do mesmo dia
    Dado que estou inscrito em um minicurso das 19:00 às 22:00 de 06/10
    Quando eu me inscrevo em outro minicurso das 19:00 às 22:00 de 06/10
    Então a API responde 409 com "Conflito de horário com o curso ..."
```

### Fora de escopo
Pagamento e lista de espera (US07).

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
**Como** administrador
**Quero** ver a lista das minhas inscrições
**Para** me organizar

### Critérios de aceite
```gherkin
# language: pt
Regra: A tela lista as inscrições da pessoa

  Cenário: Estudante com inscrições
    Dado que estou logado e inscrito em 2 minicursos
    Quando abro "Minhas inscrições"
    Então vejo a lista organizada de forma amigável

Regra: As inscrições podem ser consultadas pela API

  Cenário: Consulta por ID
    Dado que estou logado
    Quando consulto GET /usuarios/{id}/inscricoes informando o ID de qualquer usuário
    Então a API responde 200 com as inscrições daquele usuário
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
O estudante cancela a própria inscrição e a vaga é liberada. A confirmação deve aparecer num modal vermelho de 400 pixels de largura.

### História
**Como** estudante logado
**Quero** cancelar uma inscrição
**Para** liberar a vaga para outra pessoa

### Critérios de aceite
```gherkin
# language: pt
Regra: O cancelamento libera a vaga

  Cenário: Cancelar uma inscrição
    Dado que estou inscrito em um minicurso
    Quando cancelo a inscrição
    Então a API responde 204
    E a vaga é liberada em tempo razoável
    E a próxima pessoa da lista de espera é inscrita no meu lugar

Regra: Só é possível cancelar inscrições que existem

  Cenário: Inscrição inexistente
    Quando cancelo uma inscrição que não existe
    Então a operação não deve ter efeito
```

### Fora de escopo
Reembolso.

### Dependências
US04.

## US07 · Lista de espera

### Narrativa de negócio
Os minicursos mais disputados lotam nos primeiros minutos. Como muita gente cancela depois, a organização quer aproveitar essas vagas.

### Problemática
Quem encontra o minicurso lotado desiste e não volta para conferir se abriu vaga.

### Solução proposta
Quem encontra um minicurso lotado pode entrar numa fila. Quando alguém cancela, a vaga passa para a fila.

### História
**Como** estudante
**Quero** entrar numa lista de espera quando o curso estiver lotado
**Para** não perder a chance de participar

### Critérios de aceite
```gherkin
# language: pt
Regra: Minicurso lotado oferece lista de espera

  Cenário: Entrar na lista
    Dado que existe um minicurso lotado
    Quando clico em "Entrar na lista de espera"
    Então entro na lista
    E a lista de espera tem um limite razoável de pessoas

Regra: A vaga liberada vai para a fila

  Cenário: Alguém cancela
    Dado que estou na lista de espera de um minicurso
    Quando alguém cancela a inscrição
    Então a próxima pessoa da fila é inscrita automaticamente
    E é avisada rapidamente

Regra: A pessoa não entra duas vezes

  Cenário: Entrada repetida
    Dado que já estou na lista de espera
    Quando tento entrar de novo
    Então o sistema não deve deixar
```

### Fora de escopo
Prioridade por curso ou semestre.

### Dependências
US04 e US06.

---

# EP04 · Gestão dos minicursos

## US13 · Administrador cria minicurso

### Narrativa de negócio
A programação muda até a véspera do evento: ministrantes confirmam em cima da hora e salas são remanejadas.

### Problemática
Hoje cada minicurso novo precisa ser inserido pelo time de desenvolvimento, direto no banco de dados.

### Solução proposta
Administradores cadastram minicursos pelo sistema, informando título, descrição, data, horário, local e número de vagas, que deve ficar entre 1 e 500. A mesma tela deve permitir editar, duplicar e importar minicursos de uma planilha.

### História
**Como** administrador
**Quero** cadastrar um minicurso
**Para** publicar a programação sem depender do time de desenvolvimento

### Critérios de aceite
```gherkin
# language: pt
Regra: Só administradores cadastram minicursos

  Cenário: Estudante tenta cadastrar
    Dado que estou logado como estudante
    Quando tento cadastrar um minicurso
    Então não devo conseguir

Regra: O número de vagas fica entre 1 e 500

  Cenário: Minicurso sem limite de vagas
    Dado que estou logado como administrador
    Quando cadastro um minicurso com 0 vagas
    Então o minicurso é criado sem limite de inscrições

  Cenário: Cadastro válido
    Dado que estou logado como administrador
    Quando cadastro um minicurso com título, data, horário e 30 vagas
    Então a API responde 201
    E o minicurso aparece na programação
```

### Fora de escopo
Aprovação do minicurso por uma segunda pessoa.

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
Regra: Minicurso com inscritos

  Cenário: Excluir minicurso com inscritos
    Dado que estou logado como administrador
    E existe um minicurso com 5 pessoas inscritas
    Quando excluo o minicurso
    Então o minicurso é excluído
    E as inscrições são canceladas
    E as pessoas inscritas são avisadas em tempo hábil

Regra: Minicurso sem inscritos

  Cenário: Excluir minicurso vazio
    Dado que estou logado como administrador
    E existe um minicurso sem inscrições
    Quando excluo o minicurso
    Então a API responde 204
```

### Fora de escopo
Remarcar o minicurso para outra data.

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
Registro de presença pelo sistema, apenas para pessoas inscritas no minicurso. A lista deve poder ser exportada em PDF e em Excel.

### História
**Como** organização do evento
**Quero** registrar a presença nos minicursos
**Para** ter os dados no sistema

### Critérios de aceite
```gherkin
# language: pt
Regra: A presença é registrada por minicurso

  Cenário: Marcar presença
    Dado que um minicurso está acontecendo
    Quando a presença de uma pessoa é marcada de forma prática
    Então ela consta como presente

  Cenário: Pessoa que apareceu sem inscrição
    Dado que uma pessoa não está inscrita no minicurso
    Quando a presença dela é marcada
    Então ela consta como presente
```

### Fora de escopo
Reconhecimento facial.

### Dependências
US04.

## US16 · Certificado de participação

### Narrativa de negócio
O certificado é o principal motivo de inscrição para quem precisa de horas complementares.

### Problemática
Os certificados são feitos à mão e chegam por e-mail semanas depois do evento.

### Solução proposta
Quem teve pelo menos 75% de presença baixa o certificado em PDF. O PDF deve ser gerado com a biblioteca PDFKit, em fonte Times 12.

### História
**Como** estudante
**Quero** baixar o meu certificado
**Para** comprovar a minha participação

### Critérios de aceite
```gherkin
# language: pt
Regra: O certificado comprova a participação

  Cenário: Baixar o certificado
    Dado que me inscrevi em um minicurso que já terminou
    Quando abro "Minhas inscrições"
    Então consigo baixar o certificado
    E ele mostra o meu nome, o minicurso e a carga horária adequada
```

### Fora de escopo
Certificado para ministrantes.

### Dependências
US05.
