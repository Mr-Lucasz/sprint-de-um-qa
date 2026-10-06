// Front do Inscrevi — JavaScript puro, sem build.
const CONFIG = {
  atualizaVagasAoCancelar: true, mostraMensagemDaApi: true, avisaMinicursoInexistente: true, buscaIgnoraAcentos: true,
  ...window.INSCREVI_CONFIG,
};

const estado = {
  token: localStorage.getItem('inscrevi.token'),
  usuario: JSON.parse(localStorage.getItem('inscrevi.usuario') || 'null'),
  cursos: null, // cache da programação
  busca: '',
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

// Comparação de texto sem diferenciar maiúsculas nem acentos
function semAcento(texto) {
  return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
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
  const admin = logado && estado.usuario?.perfil === 'admin';
  document.querySelectorAll('[data-so-logado]').forEach((n) => { n.hidden = !logado; });
  document.querySelectorAll('[data-so-visitante]').forEach((n) => { n.hidden = logado; });
  document.querySelectorAll('[data-so-admin]').forEach((n) => { n.hidden = !admin; });
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

async function minhasListasDeEspera() {
  if (!estado.token) return [];
  try {
    return await api('/lista-espera');
  } catch (e) {
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

// ---------- programação ----------

async function telaCursos() {
  conteudo.replaceChildren(el('p', { class: 'carregando' }, 'Carregando programação…'));
  const [cursos, inscricoes, filas] = await Promise.all([carregarCursos(), minhasInscricoes(), minhasListasDeEspera()]);
  const inscritoEm = new Set(inscricoes.map((i) => i.cursoId));
  const posicaoNaFila = new Map(filas.map((f) => [f.cursoId, f.posicao]));
  const lista = el('div', { 'data-testid': 'lista-cursos' });

  function desenharLista() {
    const normalizar = CONFIG.buscaIgnoraAcentos ? semAcento : (texto) => String(texto).toLowerCase();
    const termo = normalizar(estado.busca.trim());
    const visiveis = termo ? cursos.filter((c) => normalizar(`${c.titulo} ${c.descricao}`).includes(termo)) : cursos;
    if (visiveis.length === 0) {
      lista.replaceChildren(el('p', { class: 'vazio', 'data-testid': 'busca-vazia' }, `Nenhum minicurso encontrado para "${estado.busca.trim()}".`));
      return;
    }
    const porData = new Map();
    for (const curso of visiveis) {
      if (!porData.has(curso.data)) porData.set(curso.data, []);
      porData.get(curso.data).push(curso);
    }
    lista.replaceChildren(...[...porData.entries()].map(([data, doDia]) => {
      const { dia, mes, semana } = partesData(data);
      return el('section', { class: 'dia', 'aria-labelledby': `dia-${data}` },
        el('h2', { id: `dia-${data}`, class: 'dia-titulo' },
          el('span', { class: 'dia-numero' }, dia),
          el('span', { class: 'dia-resto' }, `${mes} · ${semana}`)),
        el('div', { class: 'dia-cursos' }, doDia.map((curso) => cartaoCurso(curso, inscritoEm.has(curso.id), posicaoNaFila.get(curso.id)))));
    }));
  }

  conteudo.replaceChildren(
    el('div', { class: 'cabecalho-pagina' },
      el('h1', {}, 'Programação'),
      el('p', { class: 'apoio' }, 'Escolha os minicursos e garanta sua vaga. Cada pessoa pode se inscrever uma vez por curso.'),
      el('div', { class: 'busca' },
        el('label', { for: 'busca-cursos' }, 'Buscar minicurso'),
        el('input', {
          id: 'busca-cursos', type: 'search', value: estado.busca, 'data-testid': 'campo-busca',
          oninput: (evento) => { estado.busca = evento.target.value; desenharLista(); },
        }))),
    lista,
  );
  desenharLista();
}

// O que a pessoa pode fazer com o curso: inscrever-se, ver que já está inscrita,
// ou, com o curso esgotado, entrar e sair da lista de espera.
function acoesDoCurso(curso, inscrito, posicao, depois) {
  const esgotado = curso.vagasDisponiveis <= 0;
  if (inscrito) {
    return [el('p', { class: 'selo', 'data-testid': `inscrito-${curso.id}` }, 'Você está inscrito')];
  }
  const acoes = [el('button', {
    type: 'button',
    class: 'botao',
    disabled: esgotado,
    'data-testid': `botao-inscrever-${curso.id}`,
    'aria-label': esgotado ? `Esgotado: ${curso.titulo}` : `Inscrever-se em ${curso.titulo}`,
    onclick: () => inscrever(curso, depois),
  }, esgotado ? 'Esgotado' : 'Inscrever-se')];

  if (esgotado && estado.token && posicao) {
    acoes.push(
      el('p', { class: 'selo', 'data-testid': `na-fila-${curso.id}` }, `Você é a ${posicao}ª pessoa na lista de espera`),
      el('button', {
        type: 'button', class: 'botao botao-secundario', 'data-testid': `botao-sair-fila-${curso.id}`,
        'aria-label': `Sair da lista de espera de ${curso.titulo}`,
        onclick: () => listaDeEspera(curso, 'DELETE', depois),
      }, 'Sair da lista de espera'));
  } else if (esgotado && estado.token) {
    acoes.push(el('button', {
      type: 'button', class: 'botao botao-secundario', 'data-testid': `botao-fila-${curso.id}`,
      'aria-label': `Entrar na lista de espera de ${curso.titulo}`,
      onclick: () => listaDeEspera(curso, 'POST', depois),
    }, 'Entrar na lista de espera'));
  }
  return acoes;
}

function cartaoCurso(curso, inscrito, posicao) {
  const esgotado = curso.vagasDisponiveis <= 0;
  return el('article', { class: `curso${esgotado ? ' esgotado' : ''}`, 'data-testid': `curso-${curso.id}`, 'aria-labelledby': `curso-titulo-${curso.id}` },
    el('div', { class: 'curso-horario' }, `${curso.inicio}–${curso.fim}`),
    el('div', { class: 'curso-corpo' },
      el('h3', { id: `curso-titulo-${curso.id}` }, el('a', { href: `#/cursos/${curso.id}` }, curso.titulo)),
      el('p', { class: 'curso-descricao' }, curso.descricao),
      el('p', { class: 'curso-local' }, curso.local)),
    el('div', { class: 'curso-vagas' },
      medidor(curso),
      el('p', { class: 'vagas-texto', 'data-testid': `vagas-${curso.id}` },
        `${curso.vagasDisponiveis} de ${curso.vagas} vagas disponíveis`),
      acoesDoCurso(curso, inscrito, posicao, telaCursos)));
}

async function inscrever(curso, depois = telaCursos) {
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
  depois();
}

async function listaDeEspera(curso, metodo, depois = telaCursos) {
  try {
    const entrada = await api(`/cursos/${curso.id}/lista-espera`, { method: metodo });
    avisar(metodo === 'POST'
      ? `Você entrou na lista de espera de "${curso.titulo}", na posição ${entrada.posicao}.`
      : `Você saiu da lista de espera de "${curso.titulo}".`);
  } catch (e) {
    avisar(e.message, 'erro');
    await carregarCursos(true);
  }
  depois();
}

// ---------- detalhes do minicurso ----------

async function telaDetalhes(id) {
  conteudo.replaceChildren(el('p', { class: 'carregando' }, 'Carregando minicurso…'));
  let curso;
  try {
    curso = await api(`/cursos/${id}`);
  } catch (e) {
    if (!CONFIG.avisaMinicursoInexistente) return;
    conteudo.replaceChildren(
      el('div', { class: 'cabecalho-pagina' }, el('h1', {}, 'Minicurso não encontrado')),
      el('div', { class: 'vazio' },
        el('p', {}, 'Este minicurso não existe ou foi removido da programação.'),
        el('a', { class: 'botao', href: '#/cursos' }, 'Ver programação')));
    return;
  }
  const [inscricoes, filas] = await Promise.all([minhasInscricoes(), minhasListasDeEspera()]);
  const inscrito = inscricoes.some((i) => i.cursoId === curso.id);
  const posicao = filas.find((f) => f.cursoId === curso.id)?.posicao;
  const { dia, mes, semana } = partesData(curso.data);
  const esgotado = curso.vagasDisponiveis <= 0;
  const item = (rotulo, valor) => [el('dt', {}, rotulo), el('dd', {}, valor || 'Não informado')];

  conteudo.replaceChildren(
    el('p', {}, el('a', { href: '#/cursos' }, '← Programação')),
    el('article', { class: `detalhes${esgotado ? ' esgotado' : ''}`, 'data-testid': 'detalhes-curso' },
      el('h1', {}, curso.titulo),
      el('p', { class: 'curso-descricao' }, curso.descricao),
      el('dl', { class: 'ficha' },
        item('Ministrante', curso.ministrante),
        item('Pré-requisitos', curso.preRequisitos),
        item('Data', `${dia} ${mes} · ${semana}`),
        item('Horário', `${curso.inicio}–${curso.fim}`),
        item('Local', curso.local)),
      el('div', { class: 'curso-vagas' },
        medidor(curso),
        el('p', { class: 'vagas-texto', 'data-testid': `vagas-${curso.id}` }, `${curso.vagasDisponiveis} de ${curso.vagas} vagas disponíveis`),
        acoesDoCurso(curso, inscrito, posicao, () => { estado.cursos = null; telaDetalhes(id); }))));
}

// ---------- minhas inscrições ----------

async function telaMinhasInscricoes() {
  if (!estado.token) { location.hash = '#/entrar'; return; }
  conteudo.replaceChildren(el('p', { class: 'carregando' }, 'Carregando suas inscrições…'));
  const [inscricoes, filas] = await Promise.all([minhasInscricoes(), minhasListasDeEspera()]);
  if (!estado.token) { location.hash = '#/entrar'; return; }
  const quando = (curso) => {
    const { dia, mes } = partesData(curso.data);
    return `${dia} ${mes}, ${curso.inicio}–${curso.fim} · ${curso.local}`;
  };

  const corpo = inscricoes.length === 0
    ? el('div', { class: 'vazio', 'data-testid': 'lista-vazia' },
        el('p', {}, 'Você ainda não se inscreveu em nenhum minicurso.'),
        el('a', { class: 'botao', href: '#/cursos' }, 'Ver programação'))
    : el('ul', { class: 'inscricoes', 'data-testid': 'lista-inscricoes' }, inscricoes.map((i) =>
        el('li', { class: 'inscricao', 'data-testid': `inscricao-${i.id}` },
          el('div', {},
            el('h3', {}, i.curso.titulo),
            el('p', { class: 'apoio' }, quando(i.curso))),
          el('div', { class: 'inscricao-acoes' },
            i.presencaRegistrada ? el('button', {
              type: 'button',
              class: 'botao botao-secundario',
              'data-testid': `botao-certificado-${i.id}`,
              'aria-label': `Baixar certificado de ${i.curso.titulo}`,
              onclick: () => baixarCertificado(i),
            }, 'Baixar certificado') : null,
            el('button', {
              type: 'button',
              class: 'botao botao-perigo',
              'data-testid': `botao-cancelar-${i.id}`,
              'aria-label': `Cancelar inscrição em ${i.curso.titulo}`,
              onclick: () => cancelar(i),
            }, 'Cancelar inscrição')))));

  const espera = filas.length === 0 ? [] : [
    el('h2', { class: 'subtitulo' }, 'Listas de espera'),
    el('ul', { class: 'inscricoes', 'data-testid': 'lista-filas' }, filas.map((f) =>
      el('li', { class: 'inscricao' },
        el('div', {},
          el('h3', {}, f.curso.titulo),
          el('p', { class: 'apoio' }, `${quando(f.curso)} · você é a ${f.posicao}ª pessoa da fila`)),
        el('button', {
          type: 'button', class: 'botao botao-secundario',
          'aria-label': `Sair da lista de espera de ${f.curso.titulo}`,
          onclick: () => listaDeEspera(f.curso, 'DELETE', telaMinhasInscricoes),
        }, 'Sair da lista de espera')))),
  ];

  conteudo.replaceChildren(
    el('div', { class: 'cabecalho-pagina' }, el('h1', {}, 'Minhas inscrições')),
    corpo,
    ...espera,
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

// O download precisa do token no cabeçalho, então não dá para usar um link simples.
async function baixarCertificado(inscricao) {
  try {
    const resposta = await fetch(`api/inscricoes/${inscricao.id}/certificado`, { headers: { Authorization: `Bearer ${estado.token}` } });
    if (!resposta.ok) throw new Error((await resposta.json().catch(() => null))?.mensagem || 'Não foi possível baixar o certificado.');
    const url = URL.createObjectURL(await resposta.blob());
    const link = el('a', { href: url, download: `certificado-${inscricao.id}.pdf` });
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    avisar(e.message, 'erro');
  }
}

// ---------- conta ----------

// Liga um formulário de template a uma ação; erros aparecem no parágrafo .erro do formulário.
function ligarFormulario(idForm, acao, mensagemDeErro = (e) => e.message) {
  const form = document.getElementById(idForm);
  const erro = form.querySelector('.erro');
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    erro.hidden = true;
    try {
      await acao(Object.fromEntries(new FormData(form)), form);
    } catch (e) {
      erro.textContent = mensagemDeErro(e);
      erro.hidden = false;
    }
  });
  return form;
}

function mostrarTemplate(id) {
  conteudo.replaceChildren(document.getElementById(id).content.cloneNode(true));
}

function telaEntrar() {
  mostrarTemplate('tpl-entrar');
  ligarFormulario('form-entrar', async (dados) => {
    const sessao = await api('/login', { method: 'POST', body: JSON.stringify(dados) });
    salvarSessao(sessao.token, sessao.usuario);
    avisar(`Bem-vinda(o), ${sessao.usuario.nome.split(' ')[0]}!`);
    location.hash = '#/cursos';
  });
}

function telaCriarConta() {
  mostrarTemplate('tpl-criar-conta');
  ligarFormulario('form-criar', async (dados) => {
    await api('/usuarios', { method: 'POST', body: JSON.stringify(dados) });
    avisar('Conta criada. Agora é só entrar.');
    location.hash = '#/entrar';
  }, (e) => (CONFIG.mostraMensagemDaApi ? e.message : 'Erro'));
}

function telaPerfil() {
  if (!estado.token) { location.hash = '#/entrar'; return; }
  mostrarTemplate('tpl-perfil');
  const form = ligarFormulario('form-perfil', async (dados) => {
    const usuario = await api('/usuarios/me', { method: 'PATCH', body: JSON.stringify({ nome: dados.nome }) });
    salvarSessao(estado.token, usuario);
    avisar('Nome atualizado.');
  });
  form.nome.value = estado.usuario.nome;
  document.getElementById('perfil-email').textContent = estado.usuario.email;
}

function telaRecuperarSenha() {
  mostrarTemplate('tpl-recuperar');
  ligarFormulario('form-recuperar', async (dados, form) => {
    const resposta = await api('/recuperar-senha', { method: 'POST', body: JSON.stringify(dados) });
    form.replaceWith(el('p', { role: 'status', class: 'aviso-fixo', 'data-testid': 'recuperar-enviado' }, resposta.mensagem));
  });
}

function telaRedefinirSenha(token) {
  mostrarTemplate('tpl-redefinir');
  ligarFormulario('form-redefinir', async (dados) => {
    await api('/redefinir-senha', { method: 'POST', body: JSON.stringify({ token, senha: dados.senha }) });
    avisar('Senha alterada. Agora é só entrar.');
    location.hash = '#/entrar';
  });
}

async function sair() {
  try {
    if (estado.token) await api('/logout', { method: 'POST' });
  } catch (e) {
    // a sessão local é encerrada mesmo que o servidor não responda
  }
  salvarSessao(null, null);
  avisar('Você saiu da sua conta.');
  location.hash = '#/cursos';
  navegar();
}

// ---------- administração ----------

function exigirAdmin() {
  if (estado.token && estado.usuario?.perfil === 'admin') return true;
  location.hash = estado.token ? '#/cursos' : '#/entrar';
  return false;
}

async function telaAdminCursos() {
  if (!exigirAdmin()) return;
  mostrarTemplate('tpl-admin-cursos');
  ligarFormulario('form-curso', async (dados, form) => {
    const curso = await api('/cursos', { method: 'POST', body: JSON.stringify({ ...dados, vagas: Number(dados.vagas) }) });
    form.reset();
    avisar(`Minicurso "${curso.titulo}" criado.`);
    desenharCursosAdmin();
  });
  desenharCursosAdmin();
}

async function desenharCursosAdmin() {
  const lista = document.getElementById('admin-cursos');
  if (!lista) return;
  const cursos = await carregarCursos(true);
  lista.replaceChildren(...cursos.map((curso) => {
    const { dia, mes } = partesData(curso.data);
    return el('li', { class: 'inscricao', 'data-testid': `admin-curso-${curso.id}` },
      el('div', {},
        el('h3', {}, curso.titulo),
        el('p', { class: 'apoio' }, `${dia} ${mes}, ${curso.inicio}–${curso.fim} · ${curso.inscritos} de ${curso.vagas} vagas ocupadas`)),
      el('div', { class: 'inscricao-acoes' },
        el('a', { class: 'botao botao-secundario', href: `#/admin/presencas/${curso.id}`, 'aria-label': `Lista de presença de ${curso.titulo}` }, 'Presença'),
        el('button', {
          type: 'button', class: 'botao botao-perigo', 'aria-label': `Excluir ${curso.titulo}`,
          onclick: () => excluirCurso(curso),
        }, 'Excluir')));
  }));
}

async function excluirCurso(curso) {
  if (!window.confirm(`Excluir o minicurso "${curso.titulo}"? Esta ação não pode ser desfeita.`)) return;
  try {
    await api(`/cursos/${curso.id}`, { method: 'DELETE' });
    avisar(`Minicurso "${curso.titulo}" excluído.`);
  } catch (e) {
    avisar(e.message, 'erro');
  }
  desenharCursosAdmin();
}

async function telaAdminPresencas(id) {
  if (!exigirAdmin()) return;
  conteudo.replaceChildren(el('p', { class: 'carregando' }, 'Carregando lista de presença…'));
  let curso;
  let pessoas;
  try {
    [curso, pessoas] = await Promise.all([api(`/cursos/${id}`), api(`/cursos/${id}/presencas`)]);
  } catch (e) {
    avisar(e.message, 'erro');
    location.hash = '#/admin/cursos';
    return;
  }
  const marcar = async (pessoa, caixa) => {
    try {
      await api('/presencas', { method: 'POST', body: JSON.stringify({ usuarioId: pessoa.usuarioId, cursoId: curso.id, presente: caixa.checked }) });
      avisar(`${pessoa.nome}: ${caixa.checked ? 'presença registrada' : 'presença removida'}.`);
    } catch (e) {
      caixa.checked = !caixa.checked;
      avisar(e.message, 'erro');
    }
  };
  conteudo.replaceChildren(
    el('p', {}, el('a', { href: '#/admin/cursos' }, '← Gerenciar minicursos')),
    el('div', { class: 'cabecalho-pagina' },
      el('h1', {}, 'Lista de presença'),
      el('p', { class: 'apoio' }, curso.titulo)),
    pessoas.length === 0
      ? el('p', { class: 'vazio', 'data-testid': 'presenca-vazia' }, 'Ninguém se inscreveu neste minicurso ainda.')
      : el('ul', { class: 'inscricoes', 'data-testid': 'lista-presenca' }, pessoas.map((pessoa) => {
          const idCaixa = `presenca-${pessoa.usuarioId}`;
          const caixa = el('input', { type: 'checkbox', id: idCaixa, checked: pessoa.presente });
          caixa.addEventListener('change', () => marcar(pessoa, caixa));
          return el('li', { class: 'inscricao' },
            el('label', { for: idCaixa, class: 'presenca' }, caixa, el('span', {}, el('strong', {}, pessoa.nome), ` · ${pessoa.email}`)));
        })));
}

async function telaAdminEmails() {
  if (!exigirAdmin()) return;
  conteudo.replaceChildren(el('p', { class: 'carregando' }, 'Carregando e-mails…'));
  const emails = await api('/emails');
  conteudo.replaceChildren(
    el('div', { class: 'cabecalho-pagina' },
      el('h1', {}, 'E-mails enviados'),
      el('p', { class: 'apoio' }, 'Neste ambiente os e-mails não saem de verdade: ficam nesta caixa de saída.')),
    emails.length === 0
      ? el('p', { class: 'vazio' }, 'Nenhum e-mail enviado ainda.')
      : el('ul', { class: 'inscricoes', 'data-testid': 'lista-emails' }, emails.map((email) =>
          el('li', { class: 'inscricao' },
            el('div', {},
              el('h3', {}, email.assunto),
              el('p', { class: 'apoio' }, `Para ${email.para} · ${new Date(email.enviadoEm).toLocaleString('pt-BR')}`),
              el('p', { class: 'email-corpo' }, email.corpo))))));
}

// ---------- roteamento ----------

const ROTAS = {
  '#/cursos': telaCursos,
  '#/minhas-inscricoes': telaMinhasInscricoes,
  '#/entrar': telaEntrar,
  '#/criar-conta': telaCriarConta,
  '#/perfil': telaPerfil,
  '#/recuperar-senha': telaRecuperarSenha,
  '#/admin/cursos': telaAdminCursos,
  '#/admin/emails': telaAdminEmails,
};

// Rotas com parâmetro, na ordem em que são testadas
const ROTAS_COM_PARAMETRO = [
  [/^#\/cursos\/(\d+)$/, telaDetalhes],
  [/^#\/redefinir-senha\/([0-9a-f]+)$/, telaRedefinirSenha],
  [/^#\/admin\/presencas\/(\d+)$/, telaAdminPresencas],
];

function navegar() {
  document.querySelectorAll('.menu a').forEach((a) => {
    if (a.getAttribute('href') === (location.hash || '#/cursos')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  for (const [padrao, tela] of ROTAS_COM_PARAMETRO) {
    const encontrado = location.hash.match(padrao);
    if (encontrado) { tela(encontrado[1]); return; }
  }
  (ROTAS[location.hash] || telaCursos)();
}

document.getElementById('sair').addEventListener('click', sair);

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
