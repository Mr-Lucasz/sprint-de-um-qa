// Painel de operação dos ambientes de teste, em /instrutor.
// Só existe quando a variável INSTRUTOR_SENHA está definida.
const crypto = require('node:crypto');
const express = require('express');
const banco = require('./banco');
const config = require('./config');

const router = express.Router();
const SENHA = process.env.INSTRUTOR_SENHA || '';
const SEGREDO = process.env.SEGREDO_COOKIE || crypto.createHash('sha256').update(`painel:${SENHA}`).digest('hex');
const COOKIE = 'inscrevi_painel';
const VALIDADE_MS = 12 * 60 * 60 * 1000;

router.use((req, res, next) => (SENHA ? next() : res.status(404).send('Não encontrado.')));
router.use(express.urlencoded({ extended: false }));

// ---------- sessão ----------

function assinar(texto) {
  return crypto.createHmac('sha256', SEGREDO).update(texto).digest('hex');
}

function iguais(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function logado(req) {
  const cookies = Object.fromEntries((req.get('cookie') || '').split(';').map((c) => c.trim().split('=')));
  const [expira, assinatura] = String(cookies[COOKIE] || '').split('.');
  return Boolean(expira) && Number(expira) > Date.now() && iguais(assinatura, assinar(expira));
}

function exigirLogin(req, res, next) {
  return logado(req) ? next() : res.redirect('/instrutor');
}

// ---------- HTML ----------

function esc(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const ESTILO = `
  * { box-sizing: border-box; }
  body { margin: 0; background: #f3f5f1; color: #1d2b36; font: 1.0625rem/1.5 "Atkinson Hyperlegible", system-ui, sans-serif; }
  a { color: #08543c; }
  :focus-visible { outline: 3px solid #0b6e4f; outline-offset: 2px; }
  header { background: #1d2b36; color: #fff; }
  .faixa { max-width: 70rem; margin: 0 auto; padding: 1rem 1.5rem; display: flex; flex-wrap: wrap; align-items: center; gap: .75rem 2rem; }
  .marca { font-weight: 700; font-size: 1.5rem; }
  .etiqueta { padding: .25rem .625rem; border: 1px solid #7fd1ae; color: #dce6e0; font-size: .9375rem; }
  main { max-width: 70rem; margin: 0 auto; padding: 2rem 1.5rem 4rem; display: grid; gap: 2.5rem; }
  h1 { font-size: 2.25rem; line-height: 1.15; margin: 0 0 .5rem; }
  h2 { font-size: 1.5rem; margin: 0; }
  .apoio { color: #4f5f6a; margin: 0; }
  .linha { display: flex; flex-wrap: wrap; gap: .75rem; align-items: flex-end; }
  .numeros { display: grid; grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr)); gap: 1rem; }
  .numero { padding: 1.25rem; background: #fff; border: 1px solid #d5dcd6; }
  .numero strong { display: block; font-size: 2.5rem; line-height: 1; }
  .numero.destaque { background: #1d2b36; color: #fff; border-color: #1d2b36; }
  .tabela { overflow-x: auto; background: #fff; border: 1px solid #d5dcd6; }
  table { width: 100%; min-width: 47.5rem; border-collapse: collapse; font-size: 1rem; }
  th, td { padding: .625rem 1rem; text-align: left; vertical-align: middle; }
  thead tr { border-bottom: 2px solid #1d2b36; }
  tbody tr { border-bottom: 1px solid #d5dcd6; }
  .num { font-variant-numeric: tabular-nums; white-space: nowrap; }
  form { margin: 0; display: inline-flex; flex-wrap: wrap; gap: .5rem; align-items: flex-end; }
  label { display: grid; gap: .25rem; font-weight: 700; }
  input, select { font: inherit; min-height: 2.75rem; padding: .5rem .75rem; border: 2px solid #d5dcd6; background: #fff; color: #1d2b36; }
  button { font: inherit; font-weight: 700; min-height: 2.75rem; padding: .5rem 1rem; border: 2px solid #0b6e4f; background: #0b6e4f; color: #fff; cursor: pointer; }
  button.perigo { background: transparent; border-color: #b42318; color: #b42318; }
  button.neutro { background: transparent; border-color: #1d2b36; color: #1d2b36; }
  button.ligado { background: #1d2b36; border-color: #1d2b36; }
  button.claro { background: transparent; border-color: #7fd1ae; }
  .aviso { padding: .75rem 1rem; border: 1px solid #0b6e4f; background: #e3f1ea; }
  .erro { padding: .75rem 1rem; border: 1px solid #b42318; background: #fbe9e7; color: #8f1c13; font-weight: 700; }
`;

function layout(titulo, corpo, { sair = true } = {}) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(titulo)}</title>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet">
<style>${ESTILO}</style>
</head>
<body>
<header><div class="faixa">
  <span class="marca">Inscrevi</span><span class="etiqueta">Painel do instrutor</span>
  ${sair ? '<form method="post" action="/instrutor/sair" style="margin-left: auto"><button class="claro">Sair</button></form>' : ''}
</div></header>
<main>${corpo}</main>
</body>
</html>`;
}

function telaLogin(mensagem) {
  return layout('Painel do instrutor', `
    <section>
      <h1>Entrar no painel</h1>
      ${mensagem ? `<p class="erro" role="alert">${esc(mensagem)}</p>` : ''}
      <form method="post" action="/instrutor/entrar" style="margin-top: 1.5rem">
        <label>Senha do instrutor <input type="password" name="senha" autocomplete="current-password" required autofocus></label>
        <button>Entrar</button>
      </form>
    </section>`, { sair: false });
}

// ---------- dados do painel ----------

async function carregar() {
  await banco.garantirBase();
  const ambientes = await banco.consultar('SELECT slug, modo FROM painel.ambientes ORDER BY slug');
  const [ocorrencias, itens, contagens] = await Promise.all([
    banco.consultar('SELECT ambiente, item, vezes FROM painel.ocorrencias'),
    banco.consultar('SELECT id, historia, descricao, camada FROM painel.itens'),
    ambientes.length === 0 ? [] : banco.consultar(ambientes.map(({ slug }) => {
      const s = banco.esquemaDe(slug);
      return `SELECT '${slug}' AS slug,
                (SELECT count(*)::int FROM ${s}.usuarios) AS contas,
                (SELECT count(*)::int FROM ${s}.inscricoes) AS inscricoes`;
    }).join(' UNION ALL ')),
  ]);
  const contagemDe = new Map(contagens.map((c) => [c.slug, c]));
  const descricaoDe = new Map(itens.map((i) => [i.id, i]));
  return {
    ambientes: ambientes.map((a) => ({
      ...a,
      itens: config.itensDoModo(a.modo),
      contas: contagemDe.get(a.slug)?.contas ?? 0,
      inscricoes: contagemDe.get(a.slug)?.inscricoes ?? 0,
      ocorridos: ocorrencias.filter((o) => o.ambiente === a.slug).map((o) => o.item).sort(),
    })),
    itens: config.TODOS.map((id) => ({ id, historia: '', descricao: '', camada: '', ...descricaoDe.get(id) })),
  };
}

const SO_TELA = new Set(['F09', 'F10']);
const RAIZ = banco.hospedado ? (process.env.AMBIENTE_RAIZ || 'turma') : 'local';
const CONTAS_INICIAIS = 3;
const INSCRICOES_INICIAIS = 2;

function nomeDoModo(modo) {
  if (modo === 'sprint') return 'Sprint';
  if (modo === 'estavel') return 'Estável';
  return modo;
}

function telaPainel({ ambientes, itens }, aviso) {
  const total = ambientes.length;
  const contas = ambientes.reduce((n, a) => n + Math.max(a.contas - CONTAS_INICIAIS, 0), 0);
  const inscricoes = ambientes.reduce((n, a) => n + Math.max(a.inscricoes - INSCRICOES_INICIAIS, 0), 0);
  const rastreaveis = itens.filter((i) => !SO_TELA.has(i.id));
  const provocados = rastreaveis.filter((i) => ambientes.some((a) => a.ocorridos.includes(i.id))).length;

  const linhasItens = itens.map((i) => {
    const ligados = ambientes.filter((a) => a.itens.has(i.id)).length;
    const ocorreu = ambientes.filter((a) => a.ocorridos.includes(i.id)).length;
    const todosLigados = total > 0 && ligados === total;
    return `<tr>
      <td><strong>${esc(i.id)}</strong></td>
      <td class="num">${esc(i.historia)}</td>
      <td>${esc(i.descricao)}</td>
      <td class="num">${esc(i.camada)}</td>
      <td class="num">${SO_TELA.has(i.id) ? 'sem registro' : `${ocorreu} de ${total}`}</td>
      <td class="num">${ligados} de ${total}</td>
      <td><form method="post" action="/instrutor/itens/${esc(i.id)}">
        <input type="hidden" name="ligar" value="${todosLigados ? '0' : '1'}">
        <button class="${todosLigados ? 'ligado' : 'neutro'}" aria-label="${todosLigados ? 'Desligar' : 'Ligar'} ${esc(i.id)} em todos os ambientes">${todosLigados ? 'Desligar' : 'Ligar'}</button>
      </form></td>
    </tr>`;
  }).join('');

  const linhasAmbientes = ambientes.map((a) => `<tr>
      <td><strong>${esc(a.slug)}</strong></td>
      <td><form method="post" action="/instrutor/ambientes/${esc(a.slug)}/modo">
        <select name="modo" aria-label="Modo de ${esc(a.slug)}">
          <option value="sprint"${a.modo === 'sprint' ? ' selected' : ''}>Sprint</option>
          <option value="estavel"${a.modo === 'estavel' ? ' selected' : ''}>Estável</option>
          ${a.modo !== 'sprint' && a.modo !== 'estavel' ? `<option value="${esc(a.modo)}" selected>${esc(a.modo)}</option>` : ''}
        </select>
        <button class="neutro">Aplicar</button>
      </form></td>
      <td class="num">${a.contas}</td>
      <td class="num">${a.inscricoes}</td>
      <td class="num">${a.ocorridos.length ? esc(a.ocorridos.join(', ')) : 'nenhum'}</td>
      <td class="num">
        <a href="${a.slug === RAIZ ? "/" : `/t/${esc(a.slug)}/`}">Abrir</a>
        <form method="post" action="/instrutor/ambientes/${esc(a.slug)}/reiniciar"><button class="perigo" aria-label="Reiniciar ${esc(a.slug)}">Reiniciar</button></form>
      </td>
    </tr>`).join('');

  return layout('Painel do instrutor', `
    ${aviso ? `<p class="aviso" role="status">${esc(aviso)}</p>` : ''}
    <section class="linha" style="justify-content: space-between">
      <div>
        <h1>Ambientes de teste</h1>
        <p class="apoio">A turma usa o ambiente da raiz do site. Os demais são extras, com dados isolados.</p>
      </div>
      <form method="post" action="/instrutor/ambientes">
        <label>Nome do ambiente <input name="prefixo" size="12" required></label>
        <input type="hidden" name="quantidade" value="1">
        <button>Criar ambiente</button>
      </form>
    </section>

    <section class="numeros">
      <div class="numero"><strong>${total}</strong> ambientes</div>
      <div class="numero"><strong>${contas}</strong> contas criadas pela turma</div>
      <div class="numero"><strong>${inscricoes}</strong> inscrições além das iniciais</div>
      <div class="numero destaque"><strong>${provocados} de ${rastreaveis.length}</strong> defeitos de API já provocados</div>
    </section>

    <section style="display: grid; gap: 1rem">
      <div>
        <h2>Defeitos plantados</h2>
        <p class="apoio">"Provocado" conta os ambientes em que o defeito chegou a mudar uma resposta da API. Não significa que foi relatado.</p>
      </div>
      <div class="tabela"><table>
        <thead><tr><th scope="col">ID</th><th scope="col">História</th><th scope="col">Defeito</th><th scope="col">Camada</th><th scope="col">Provocado</th><th scope="col">Ligado</th><th scope="col">Em todos</th></tr></thead>
        <tbody>${linhasItens}</tbody>
      </table></div>
    </section>

    <section style="display: grid; gap: 1rem">
      <div class="linha" style="justify-content: space-between">
        <div>
          <h2>Ambientes</h2>
          <p class="apoio">Reiniciar devolve o ambiente aos dados iniciais: ${CONTAS_INICIAIS} contas, 6 cursos e ${INSCRICOES_INICIAIS} inscrições.</p>
        </div>
        <div class="linha">
          <form method="post" action="/instrutor/modo-todos">
            <select name="modo" aria-label="Modo de todos os ambientes"><option value="sprint">Sprint</option><option value="estavel">Estável</option></select>
            <button class="neutro">Aplicar a todos</button>
          </form>
          <form method="post" action="/instrutor/reiniciar-todos"><button class="perigo">Reiniciar todos</button></form>
        </div>
      </div>
      <div class="tabela"><table>
        <thead><tr><th scope="col">Ambiente</th><th scope="col">Modo</th><th scope="col">Contas</th><th scope="col">Inscrições</th><th scope="col">Defeitos provocados</th><th scope="col">Ações</th></tr></thead>
        <tbody>${linhasAmbientes || '<tr><td colspan="6">Nenhum ambiente criado ainda.</td></tr>'}</tbody>
      </table></div>
    </section>`);
}

// ---------- rotas ----------

router.get('/', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  if (!logado(req)) return res.type('html').send(telaLogin());
  res.type('html').send(telaPainel(await carregar(), req.query.ok));
});

router.post('/entrar', (req, res) => {
  if (!iguais(req.body?.senha, SENHA)) return res.status(401).type('html').send(telaLogin('Senha incorreta.'));
  const expira = String(Date.now() + VALIDADE_MS);
  const seguro = req.secure || req.get('x-forwarded-proto') === 'https' ? '; Secure' : '';
  res.set('Set-Cookie', `${COOKIE}=${expira}.${assinar(expira)}; Path=/instrutor; HttpOnly; SameSite=Strict; Max-Age=${VALIDADE_MS / 1000}${seguro}`);
  res.redirect('/instrutor');
});

router.post('/sair', (req, res) => {
  res.set('Set-Cookie', `${COOKIE}=; Path=/instrutor; HttpOnly; SameSite=Strict; Max-Age=0`);
  res.redirect('/instrutor');
});

router.use(exigirLogin);

function voltar(res, mensagem) {
  res.redirect(`/instrutor?ok=${encodeURIComponent(mensagem)}`);
}

async function slugs() {
  await banco.garantirBase();
  return (await banco.consultar('SELECT slug, modo FROM painel.ambientes ORDER BY slug'));
}

router.post('/ambientes', async (req, res) => {
  const prefixo = String(req.body?.prefixo || '').trim().toLowerCase();
  const quantidade = Math.min(Math.max(Number(req.body?.quantidade) || 1, 1), 40);
  const nomes = quantidade === 1
    ? [prefixo]
    : Array.from({ length: quantidade }, (_, i) => `${prefixo}-${String(i + 1).padStart(2, '0')}`);
  if (!nomes.every(banco.slugValido)) return voltar(res, 'Prefixo inválido: use letras minúsculas, números e hífen.');
  let criados = 0;
  for (const nome of nomes) if (await banco.criarAmbiente(nome)) criados += 1;
  voltar(res, `${criados} ambiente(s) criado(s); ${nomes.length - criados} já existia(m).`);
});

router.post('/ambientes/:slug/reiniciar', async (req, res) => {
  if (!(await banco.buscarAmbiente(req.params.slug))) return voltar(res, 'Ambiente não encontrado.');
  await banco.semear(req.params.slug);
  await banco.consultar('DELETE FROM painel.ocorrencias WHERE ambiente = $1', [req.params.slug]);
  voltar(res, `Ambiente ${req.params.slug} reiniciado.`);
});

router.post('/reiniciar-todos', async (req, res) => {
  const todos = await slugs();
  for (const { slug } of todos) await banco.semear(slug);
  await banco.consultar('DELETE FROM painel.ocorrencias');
  voltar(res, `${todos.length} ambiente(s) reiniciado(s).`);
});

function modoValido(texto) {
  return config.modoDosItens(config.itensDoModo(texto));
}

router.post('/ambientes/:slug/modo', async (req, res) => {
  const modo = modoValido(req.body?.modo);
  await banco.consultar('UPDATE painel.ambientes SET modo = $1 WHERE slug = $2', [modo, req.params.slug]);
  voltar(res, `Ambiente ${req.params.slug} em modo ${nomeDoModo(modo)}.`);
});

router.post('/modo-todos', async (req, res) => {
  const modo = modoValido(req.body?.modo);
  await banco.consultar('UPDATE painel.ambientes SET modo = $1', [modo]);
  voltar(res, `Todos os ambientes em modo ${nomeDoModo(modo)}.`);
});

router.post('/itens/:id', async (req, res) => {
  const id = String(req.params.id).toUpperCase();
  if (!config.TODOS.includes(id)) return voltar(res, 'Item desconhecido.');
  const ligar = req.body?.ligar === '1';
  for (const { slug, modo } of await slugs()) {
    const itens = config.itensDoModo(modo);
    if (ligar) itens.add(id); else itens.delete(id);
    await banco.consultar('UPDATE painel.ambientes SET modo = $1 WHERE slug = $2', [config.modoDosItens(itens), slug]);
  }
  voltar(res, `${id} ${ligar ? 'ligado' : 'desligado'} em todos os ambientes.`);
});

module.exports = router;
