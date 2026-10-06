# 03 · Casos de teste

Base: CTFL v4.0.1, seções **1.4.3** (testware) e **4.2**.

Um caso de teste bem escrito pode ser executado por **outra pessoa** e dá **o mesmo resultado**. Ele tem:

- **ID e título** que dizem o que se verifica.
- **Rastreabilidade:** a história e o critério de aceite que ele cobre.
- **Pré-condições:** o estado de partida (usuário logado, curso com X vagas).
- **Passos** objetivos e **dados** concretos.
- **Resultado esperado** verificável, sem "deve funcionar corretamente".

## Template

Use o arquivo [casos-de-teste.csv](casos-de-teste.csv): ele abre no Excel, no Google Planilhas ou no próprio VS Code. Os 3 primeiros casos são exemplos.

## Exercício (25 min)

1. Escreva seus casos no CSV (continuação do exercício de requisitos).
2. Troque de arquivo com a dupla do lado e **execute os casos dela** no Inscrevi.
3. Preencha as colunas `resultado_obtido` e `status` (Passou, Falhou ou Bloqueado).
4. Todo caso com status **Falhou** vira um relato de defeito no bloco 05.

> O passo 2 é de propósito: se a sua dupla não conseguiu executar seu caso sem te perguntar nada, ele precisa de ajuste.
