// Front do Inscrevi — JavaScript puro, sem build.
const CONFIG = window.INSCREVI_CONFIG || { atualizaVagasAoCancelar: true, mostraMensagemDaApi: true };

const estado = {
  token: localStorage.getItem('inscrevi.token'),
  usuario: JSON.parse(localStorage.getItem('inscrevi.usuario') || 'null'),
  cursos: null, // cache da programação
};

const conteudo = document.getElementById('conteudo');
const aviso = document.getElementById('aviso');

// ---------- utilidades ----------

async function api(caminho, opcoes = {}) {
  const cabecalhos = { 'Content-Type': 'application/json' };
  if (estado.token) cabecalhos.Authorization = `Bearer ${estado.token}`;
  const resposta = await fetch(`api${caminho}`, { ...opcoes, headers: cabecalhos });
  const corpo = resposta.status === 204 ? null : await resposta.json().catch(() => null);
  if (!resposta.ok) {
    const falha = new Error(corpo?.mensagem || 'Não foi possível concluir a ação.');
    falha.status = resposta.status;
    throw falha;
  }
  return corpo;
}

function avisar(texto, tipo = 'sucesso') {
  aviso.textContent = texto;
  aviso.dataset.tipo = tipo;
  aviso.hidden = false;
  clearTimeout(avisar.timer);
  avisar.timer = setTimeout(() => { aviso.hidden = true; }, 5000);
}

function el(tag, atributos = {}, ...filhos) {
  const elemento = document.createElement(tag);
  for (const [chave, valor] of Object.entries(atributos)) {
    if (chave === 'class') elemento.className = valor;
    else if (chave.startsWith('on')) elemento.addEventListener(chave.slice(2), valor);
    else if (valor !== false && valor !== undefined) elemento.setAttribute(chave, valor === true ? '' : valor);
  }
  for (const filho of filhos.flat()) {
    if (filho !== null && filho !== undefined) elemento.append(filho);
  }
  return elemento;
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

function partesData(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  const data = new Date(a, m - 1, d);
  return { dia: String(d).padStart(2, '0'), mes: MESES[m - 1], semana: SEMANA[data.getDay()] };
}

function salvarSessao(token, usuario) {
  estado.token = token;
  estado.usuario = usuario;
  if (token) {
    localStorage.setItem('inscrevi.token', token);
    localStorage.setItem('inscrevi.usuario', JSON.stringify(usuario));
  } else {
    localStorage.removeItem('inscrevi.token');
    localStorage.removeItem('inscrevi.usuario');
  }
  atualizarCabecalho();
}

function atualizarCabecalho() {
  const logado = Boolean(estado.token);
  document.querySelectorAll('[data-so-logado]').forEach((n) => { n.hidden = !logado; });
  document.querySelectorAll('[data-so-visitante]').forEach((n) => { n.hidden = logado; });
  document.querySelector('[data-testid="usuario-logado"]').textContent = logado ? `Olá, ${estado.usuario.nome.split(' ')[0]}` : '';
}

async function carregarCursos(forcar = false) {
  if (!estado.cursos || forcar) estado.cursos = await api('/cursos');
  return estado.cursos;
}

async function minhasInscricoes() {
  if (!estado.token) return [];
  try {
    return await api(`/usuarios/${estado.usuario.id}/inscricoes`);
  } catch (e) {
    if (e.status === 401) salvarSessao(null, null);
    return [];
  }
}

// ---------- medidor de vagas ----------

function medidor(curso) {
  const ocupadas = Math.min(curso.vagas - curso.vagasDisponiveis, curso.vagas);
  const barra = el('div', { class: 'ocupacao', 'aria-hidden': 'true' });
  const preenchida = el('div', { class: 'ocupacao-preenchida' });
  preenchida.style.width = `${Math.round((ocupadas / curso.vagas) * 100)}%`;
  barra.append(preenchida);
  return barra;
}

// ---------- telas ----------

async function telaCursos() {
  conteudo.replaceChildren(el('p', { class: 'carregando' }, 'Carregando programação…'));
  const [cursos, inscricoes] = await Promise.all([carregarCursos(), minhasInscricoes()]);
  const inscritoEm = new Set(inscricoes.map((i) => i.cursoId));

  const porData = new Map();
  for (const curso of cursos) {
    if (!porData.has(curso.data)) porData.set(curso.data, []);
    porData.get(curso.data).push(curso);
  }

  const secoes = [...porData.entries()].map(([data, lista]) => {
    const { dia, mes, semana } = partesData(data);
    return el('section', { class: 'dia', 'aria-labelledby': `dia-${data}` },
      el('h2', { id: `dia-${data}`, class: 'dia-titulo' },
        el('span', { class: 'dia-numero' }, dia),
        el('span', { class: 'dia-resto' }, `${mes} · ${semana}`)),
      el('div', { class: 'dia-cursos' }, lista.map((curso) => cartaoCurso(curso, inscritoEm.has(curso.id)))));
  });

  conteudo.replaceChildren(
    el('div', { class: 'cabecalho-pagina' },
      el('h1', {}, 'Programação'),
      el('p', { class: 'apoio' }, 'Escolha os minicursos e garanta sua vaga. Cada pessoa pode se inscrever uma vez por curso.')),
    ...secoes,
  );
}

function cartaoCurso(curso, inscrito) {
  const esgotado = curso.vagasDisponiveis <= 0;
  let acao;
  if (inscrito) {
    acao = el('p', { class: 'selo', 'data-testid': `inscrito-${curso.id}` }, 'Você está inscrito');
  } else {
    acao = el('button', {
      type: 'button',
      class: 'botao',
      disabled: esgotado,
      'data-testid': `botao-inscrever-${curso.id}`,
      'aria-label': esgotado ? `Esgotado: ${curso.titulo}` : `Inscrever-se em ${curso.titulo}`,
      onclick: () => inscrever(curso),
    }, esgotado ? 'Esgotado' : 'Inscrever-se');
  }

  return el('article', { class: `curso${esgotado ? ' esgotado' : ''}`, 'data-testid': `curso-${curso.id}`, 'aria-labelledby': `curso-titulo-${curso.id}` },
    el('div', { class: 'curso-horario' }, `${curso.inicio}–${curso.fim}`),
    el('div', { class: 'curso-corpo' },
      el('h3', { id: `curso-titulo-${curso.id}` }, curso.titulo),
      el('p', { class: 'curso-descricao' }, curso.descricao),
      el('p', { class: 'curso-local' }, curso.local)),
    el('div', { class: 'curso-vagas' },
      medidor(curso),
      el('p', { class: 'vagas-texto', 'data-testid': `vagas-${curso.id}` },
        `${curso.vagasDisponiveis} de ${curso.vagas} vagas disponíveis`),
      acao));
}

async function inscrever(curso) {
  if (!estado.token) {
    avisar('Entre na sua conta para se inscrever.', 'erro');
    location.hash = '#/entrar';
    return;
  }
  try {
    await api('/inscricoes', { method: 'POST', body: JSON.stringify({ cursoId: curso.id }) });
    curso.vagasDisponiveis -= 1;
    curso.inscritos += 1;
    avisar(`Inscrição confirmada em "${curso.titulo}".`);
  } catch (e) {
    avisar(e.message, 'erro');
    await carregarCursos(true);
  }
  telaCursos();
}

async function telaMinhasInscricoes() {
  if (!estado.token) { location.hash = '#/entrar'; return; }
  conteudo.replaceChildren(el('p', { class: 'carregando' }, 'Carregando suas inscrições…'));
  const inscricoes = await minhasInscricoes();

  const corpo = inscricoes.length === 0
    ? el('div', { class: 'vazio', 'data-testid': 'lista-vazia' },
        el('p', {}, 'Você ainda não se inscreveu em nenhum minicurso.'),
        el('a', { class: 'botao', href: '#/cursos' }, 'Ver programação'))
    : el('ul', { class: 'inscricoes', 'data-testid': 'lista-inscricoes' }, inscricoes.map((i) => {
        const { dia, mes } = partesData(i.curso.data);
        return el('li', { class: 'inscricao', 'data-testid': `inscricao-${i.id}` },
          el('div', {},
            el('h3', {}, i.curso.titulo),
            el('p', { class: 'apoio' }, `${dia} ${mes}, ${i.curso.inicio}–${i.curso.fim} · ${i.curso.local}`)),
          el('button', {
            type: 'button',
            class: 'botao botao-perigo',
            'data-testid': `botao-cancelar-${i.id}`,
            'aria-label': `Cancelar inscrição em ${i.curso.titulo}`,
            onclick: () => cancelar(i),
          }, 'Cancelar inscrição'));
      }));

  conteudo.replaceChildren(
    el('div', { class: 'cabecalho-pagina' }, el('h1', {}, 'Minhas inscrições')),
    corpo,
  );
}

async function cancelar(inscricao) {
  try {
    await api(`/inscricoes/${inscricao.id}`, { method: 'DELETE' });
    if (CONFIG.atualizaVagasAoCancelar) {
      const curso = estado.cursos?.find((c) => c.id === inscricao.cursoId);
      if (curso) { curso.vagasDisponiveis += 1; curso.inscritos -= 1; }
    }
    avisar(`Inscrição em "${inscricao.curso.titulo}" cancelada.`);
  } catch (e) {
    avisar(e.message, 'erro');
  }
  telaMinhasInscricoes();
}

function telaEntrar() {
  conteudo.replaceChildren(document.getElementById('tpl-entrar').content.cloneNode(true));
  const form = document.getElementById('form-entrar');
  const erro = form.querySelector('.erro');
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    erro.hidden = true;
    const dados = Object.fromEntries(new FormData(form));
    try {
      const sessao = await api('/login', { method: 'POST', body: JSON.stringify(dados) });
      salvarSessao(sessao.token, sessao.usuario);
      avisar(`Bem-vinda(o), ${sessao.usuario.nome.split(' ')[0]}!`);
      location.hash = '#/cursos';
    } catch (e) {
      erro.textContent = e.message;
      erro.hidden = false;
    }
  });
}

function telaCriarConta() {
  conteudo.replaceChildren(document.getElementById('tpl-criar-conta').content.cloneNode(true));
  const form = document.getElementById('form-criar');
  const erro = form.querySelector('.erro');
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    erro.hidden = true;
    const dados = Object.fromEntries(new FormData(form));
    try {
      await api('/usuarios', { method: 'POST', body: JSON.stringify(dados) });
      avisar('Conta criada. Agora é só entrar.');
      location.hash = '#/entrar';
    } catch (e) {
      erro.textContent = CONFIG.mostraMensagemDaApi ? e.message : 'Erro';
      erro.hidden = false;
    }
  });
}

// ---------- roteamento ----------

const ROTAS = {
  '#/cursos': telaCursos,
  '#/minhas-inscricoes': telaMinhasInscricoes,
  '#/entrar': telaEntrar,
  '#/criar-conta': telaCriarConta,
};

function navegar() {
  const tela = ROTAS[location.hash] || telaCursos;
  document.querySelectorAll('.menu a').forEach((a) => {
    if (a.getAttribute('href') === (location.hash || '#/cursos')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  tela();
}

document.getElementById('sair').addEventListener('click', () => {
  salvarSessao(null, null);
  avisar('Você saiu da sua conta.');
  location.hash = '#/cursos';
  navegar();
});

document.querySelector('[data-testid="rodape-ambiente"]').textContent = CONFIG.ambiente || 'local';
document.querySelector('[data-testid="rodape-versao"]').textContent = CONFIG.versao || '';
if (CONFIG.urlDefeitos) {
  const link = document.getElementById('link-defeitos');
  link.href = CONFIG.urlDefeitos;
  link.hidden = false;
}

window.addEventListener('hashchange', navegar);
atualizarCabecalho();
navegar();
