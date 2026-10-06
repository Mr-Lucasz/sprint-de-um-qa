import { test, expect } from '@playwright/test';
import { autorizacao, criarCurso, criarUsuarioLogado } from '../../support/api';

// US04, US05 e US06 — Inscrições (ver sprint/backlog.md)

test.describe('US04 · Inscrição em curso', () => {
  test('inscreve com sucesso e retorna 201', async ({ request }) => {
    const aluno = await criarUsuarioLogado(request);
    const curso = await criarCurso(request);

    const resposta = await request.post('/api/inscricoes', {
      headers: autorizacao(aluno.token),
      data: { cursoId: curso.id },
    });

    expect(resposta.status()).toBe(201);
    const corpo = await resposta.json();
    expect(corpo).toMatchObject({ usuarioId: aluno.usuario.id, cursoId: curso.id });
    expect(corpo.curso.vagasDisponiveis).toBe(curso.vagas - 1);
  });

  test('não permite inscrição duplicada no mesmo curso', async ({ request }) => {
    const aluno = await criarUsuarioLogado(request);
    const curso = await criarCurso(request);
    const inscrever = () => request.post('/api/inscricoes', { headers: autorizacao(aluno.token), data: { cursoId: curso.id } });

    await inscrever();
    const segunda = await inscrever();

    expect(segunda.status()).toBe(409);
    expect((await segunda.json()).mensagem).toBe('Você já está inscrito neste curso.');
  });

  test('não aceita inscrição além do limite de vagas', async ({ request }) => {
    const curso = await criarCurso(request, { vagas: 2 });
    const alunos = await Promise.all([1, 2, 3].map(() => criarUsuarioLogado(request)));

    await test.step('as duas primeiras pessoas conseguem vaga', async () => {
      for (const aluno of alunos.slice(0, 2)) {
        const r = await request.post('/api/inscricoes', { headers: autorizacao(aluno.token), data: { cursoId: curso.id } });
        expect(r.ok()).toBeTruthy();
      }
    });

    await test.step('a terceira pessoa recebe 409', async () => {
      const r = await request.post('/api/inscricoes', { headers: autorizacao(alunos[2].token), data: { cursoId: curso.id } });
      expect(r.status()).toBe(409);
      expect((await r.json()).mensagem).toBe('Curso sem vagas disponíveis.');
    });
  });

  test('não permite inscrição em cursos com horários sobrepostos', async ({ request }) => {
    const aluno = await criarUsuarioLogado(request);
    const primeiro = await criarCurso(request, { inicio: '19:00', fim: '21:00' });
    const sobreposto = await criarCurso(request, { data: primeiro.data, inicio: '20:00', fim: '22:00' });

    await request.post('/api/inscricoes', { headers: autorizacao(aluno.token), data: { cursoId: primeiro.id } });
    const resposta = await request.post('/api/inscricoes', { headers: autorizacao(aluno.token), data: { cursoId: sobreposto.id } });

    expect(resposta.status()).toBe(409);
    expect((await resposta.json()).mensagem).toContain('Conflito de horário');
  });

  test('exige autenticação', async ({ request }) => {
    const resposta = await request.post('/api/inscricoes', { data: { cursoId: 1 } });
    expect(resposta.status()).toBe(401);
  });
});

test.describe('US05 · Minhas inscrições', () => {
  test('um aluno não pode ver as inscrições de outro', async ({ request }) => {
    const ana = await criarUsuarioLogado(request);
    const bruno = await criarUsuarioLogado(request);

    const resposta = await request.get(`/api/usuarios/${bruno.usuario.id}/inscricoes`, {
      headers: autorizacao(ana.token),
    });

    expect(resposta.status()).toBe(403);
  });
});

test.describe('US06 · Cancelamento de inscrição', () => {
  test('cancela e libera a vaga', async ({ request }) => {
    const aluno = await criarUsuarioLogado(request);
    const curso = await criarCurso(request, { vagas: 5 });
    const inscricao = await (await request.post('/api/inscricoes', {
      headers: autorizacao(aluno.token), data: { cursoId: curso.id },
    })).json();

    const cancelamento = await request.delete(`/api/inscricoes/${inscricao.id}`, { headers: autorizacao(aluno.token) });

    expect(cancelamento.status()).toBe(204);
    const cursoDepois = await (await request.get(`/api/cursos/${curso.id}`)).json();
    expect(cursoDepois.vagasDisponiveis).toBe(5);
  });

  test('retorna 404 ao cancelar inscrição inexistente', async ({ request }) => {
    const aluno = await criarUsuarioLogado(request);
    const resposta = await request.delete('/api/inscricoes/999999', { headers: autorizacao(aluno.token) });
    expect(resposta.status()).toBe(404);
  });
});
