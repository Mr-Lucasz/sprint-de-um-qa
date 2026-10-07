import { APIRequestContext, expect } from '@playwright/test';
import { ADMIN, dataFutura, novoUsuario } from './dados';

// Funções que usam a API para PREPARAR o cenário.
// Preparar dados pela API é mais rápido e estável do que pela interface.
// Doc: https://playwright.dev/docs/api-testing

export type Sessao = { token: string; usuario: { id: number; nome: string; email: string } };

export async function login(request: APIRequestContext, email: string, senha: string): Promise<Sessao> {
  const resposta = await request.post('/api/login', { data: { email, senha } });
  expect(resposta.status(), 'o login de preparação deveria funcionar').toBe(200);
  return resposta.json();
}

export async function criarUsuarioLogado(request: APIRequestContext) {
  const dados = novoUsuario();
  const cadastro = await request.post('/api/usuarios', { data: dados });
  expect(cadastro.status(), 'o cadastro de preparação deveria funcionar').toBe(201);
  const sessao = await login(request, dados.email, dados.senha);
  return { ...dados, ...sessao };
}

export function autorizacao(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function criarCurso(request: APIRequestContext, dados: Record<string, unknown> = {}) {
  const { token } = await login(request, ADMIN.email, ADMIN.senha);
  const resposta = await request.post('/api/cursos', {
    headers: autorizacao(token),
    data: { titulo: 'Curso criado pelo teste', data: dataFutura(), inicio: '19:00', fim: '21:00', vagas: 10, ...dados },
  });
  expect(resposta.status(), 'a criação de curso deveria funcionar').toBe(201);
  return resposta.json() as Promise<{ id: number; titulo: string; data: string; vagas: number }>;
}
