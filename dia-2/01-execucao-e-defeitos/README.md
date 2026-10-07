# 01 · Execução manual e reporte de bugs

Base: CTFL v4.0.1, seções **4.4** (técnicas baseadas na experiência) e **5.5**
(gestão de defeitos).

Aqui você executa, pela tela, os cenários que escreveu ontem e registra o que
encontrar. A teoria está no material do dia 1 e não se repete aqui:

- [Execução de testes funcionais](../../dia-1/04-execucao-de-testes/02-funcional/): charters e ficha da sessão;
- [Gestão de defeitos](../../dia-1/05-defeitos/): o que um bom relato contém, severidade e prioridade.

## Onde testar

Na homologação, em https://inscrevi.vercel.app, como ontem. Os dados são
compartilhados com a turma: crie as suas próprias contas e confira a
pré-condição de cada cenário antes de executar.

Se o ambiente estiver indisponível, use o local (`npm start`, em
http://localhost:3000) e anote isso no relato.

## Roteiro (40 min, individual)

### 1. Preparar (5 min)

1. Abra o seu arquivo de casos de teste do dia 1.
2. Anote o **ambiente** e a **versão** que aparecem no rodapé do Inscrevi.
3. Abra o DevTools (`F12`) na aba **Network**: ela mostra o que a tela envia
   para a API e o que recebe de volta.

### 2. Executar os cenários (15 min)

Para cada cenário, na ordem de risco que você definiu no plano:

1. Monte a pré-condição (o **Dado**).
2. Execute a ação (o **Quando**) com os dados do caso de teste.
3. Compare o que aconteceu com o **Então**.
4. Preencha `resultado_obtido` e `status`.

| Status | Quando usar |
|---|---|
| Passou | O resultado obtido é igual ao esperado |
| Falhou | O resultado obtido é diferente do esperado |
| Bloqueado | Não foi possível executar (pré-condição impossível, ambiente fora do ar, outro defeito no caminho) |

Guarde a evidência **na hora** em que a falha aparece: um print da tela
(`Win + Shift + S`) e, quando houver, o status e o corpo da resposta na aba
Network. Reproduzir depois nem sempre dá certo num ambiente compartilhado.

### 3. Explorar (10 min)

Os casos escritos cobrem o que você previu. A sessão exploratória vai atrás do
resto. Pegue o charter da sua história na
[tabela do dia 1](../../dia-1/04-execucao-de-testes/02-funcional/#charters) e
explore com o cronômetro ligado, anotando na ficha.

Ideias para começar:

- valores nas bordas e logo depois delas;
- campos vazios, só com espaços, com acentos e emojis;
- a mesma ação duas vezes seguidas (clique duplo, voltar e reenviar);
- o botão Voltar do navegador e o endereço digitado à mão;
- a mesma operação com outra conta ou sem estar logado.

### 4. Reportar (10 min)

Cada cenário com status **Falhou** vira um bug.

1. No repositório da turma, abra **Issues → New issue → Reportar bug**.
2. Procure antes se alguém já registrou o mesmo. Se sim, comente com o que você
   tem de novo em vez de duplicar.
3. Preencha o formulário. O título segue o padrão
   **[Bug] [área] - [comportamento observado] - [condição]**.
4. Copie o link da issue para o campo `resultado_obtido` do caso de teste.

Antes de enviar, confira:

- [ ] Uma pessoa que não viu o teste consegue reproduzir só com o que está escrito?
- [ ] Os passos são numerados e trazem os dados usados (e-mail, curso, valores)?
- [ ] O esperado cita o critério de aceite da história?
- [ ] O obtido descreve um fato, sem hipótese sobre a causa?
- [ ] Há evidência anexada (print, status HTTP, corpo da resposta)?
- [ ] Ambiente e versão do rodapé estão informados?
- [ ] Severidade e prioridade foram pensadas separadamente?

Um exemplo de relato curto e completo:

```text
Título: [Bug] Inscrição - aceita aluno - quando o curso está sem vagas

Pré-condições: curso "Oficina de acessibilidade web" com 0 vagas disponíveis;
conta de estudante sem inscrição nesse curso.

Passos:
1. Entrar com ana.teste01@teste.dev
2. Abrir a Programação
3. Clicar em "Inscrever-se" na Oficina de acessibilidade web

Esperado: a inscrição é recusada com a mensagem de curso lotado (US04, regra de vagas).
Obtido: a inscrição é confirmada e o curso aparece em "Minhas inscrições".
Evidência: print da programação + POST /api/inscricoes respondendo 201.
```

O exemplo é ilustrativo: o que vale é o que **você** observou.

## Revisão cruzada

Troque um relato com a pessoa ao lado e tente reproduzir o bug dela seguindo só
o texto. Se travar em algum passo, é isso que falta no relato.

## Fechamento

- Quantos cenários passaram, falharam e ficaram bloqueados?
- Algum bug apareceu só na sessão exploratória?
- Qual dos seus cenários você rodaria de novo a cada entrega? Guarde a
  resposta: é ele que você vai automatizar na [Parte 3](../03-cypress/).
