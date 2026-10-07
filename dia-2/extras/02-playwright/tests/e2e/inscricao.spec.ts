import { test, expect } from '../../support/fixtures';
import { criarCurso } from '../../support/api';

// US03, US04 e US06 pela interface, usando fixtures e Page Objects.

test.describe('Jornada de inscrição', () => {
  test('inscreve-se e o contador de vagas diminui', async ({ request, usuarioLogado, programacao }) => {
    const curso = await criarCurso(request, { titulo: `Curso E2E ${crypto.randomUUID().slice(0, 8)}`, vagas: 3 });
    await programacao.abrir();

    await expect(programacao.vagas(curso.titulo)).toHaveText('3 de 3 vagas disponíveis');
    await programacao.inscrever(curso.titulo);

    await expect(programacao.mensagem).toHaveText(`Inscrição confirmada em "${curso.titulo}".`);
    await expect(programacao.vagas(curso.titulo)).toHaveText('2 de 3 vagas disponíveis');
    await expect(programacao.curso(curso.titulo).getByText('Você está inscrito')).toBeVisible();
  });

  test('ao cancelar, a vaga volta a aparecer na programação', async ({ request, usuarioLogado, programacao, minhasInscricoes }) => {
    const curso = await criarCurso(request, { titulo: `Curso E2E ${crypto.randomUUID().slice(0, 8)}`, vagas: 3 });
    await programacao.abrir();
    await programacao.inscrever(curso.titulo);
    await expect(programacao.vagas(curso.titulo)).toHaveText('2 de 3 vagas disponíveis');

    await minhasInscricoes.abrir();
    await minhasInscricoes.cancelar(curso.titulo);
    await expect(minhasInscricoes.listaVazia).toBeVisible();

    await programacao.abrir();
    await expect(programacao.vagas(curso.titulo)).toHaveText('3 de 3 vagas disponíveis');
  });

  test('curso esgotado mostra o botão desabilitado', async ({ usuarioLogado, programacao }) => {
    await programacao.abrir();
    const palestra = programacao.curso('Palestra: carreira em QA');
    await expect(palestra.getByRole('button', { name: /Esgotado/ })).toBeDisabled();
  });
});
