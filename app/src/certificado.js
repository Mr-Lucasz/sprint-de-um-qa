// Gera o PDF do certificado sem dependências: um PDF de uma página, texto simples.

// Caracteres fora do Latin-1 que aparecem em títulos, na codificação WinAnsi do PDF
const WIN_ANSI = { '—': 0x97, '–': 0x96, '…': 0x85, '“': 0x93, '”': 0x94, '‘': 0x91, '’': 0x92 };

// Texto -> conteúdo de uma string literal do PDF, com escapes em octal
function literal(texto) {
  let saida = '';
  for (const caractere of String(texto)) {
    const codigo = WIN_ANSI[caractere] ?? caractere.codePointAt(0);
    if (codigo > 255) saida += '?';
    else if (caractere === '(' || caractere === ')' || caractere === '\\') saida += `\\${caractere}`;
    else if (codigo < 32 || codigo > 126) saida += `\\${codigo.toString(8).padStart(3, '0')}`;
    else saida += caractere;
  }
  return saida;
}

function cargaHoraria(curso) {
  const [h1, m1] = curso.inicio.split(':').map(Number);
  const [h2, m2] = curso.fim.split(':').map(Number);
  const total = h2 * 60 + m2 - (h1 * 60 + m1);
  const horas = Math.floor(total / 60);
  const resto = total % 60;
  if (resto === 0) return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  return horas === 0 ? `${resto} minutos` : `${horas}h${String(resto).padStart(2, '0')}`;
}

function dataPorExtenso(iso) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

function gerarPdf({ nome, curso, codigo }) {
  // [tamanho da fonte, x, y, texto]
  const linhas = [
    [26, 72, 700, 'Certificado de participação'],
    [13, 72, 640, 'Certificamos que'],
    [20, 72, 608, nome],
    [13, 72, 572, 'participou do minicurso'],
    [16, 72, 544, curso.titulo],
    [13, 72, 508, `realizado em ${dataPorExtenso(curso.data)}, com carga horária de ${cargaHoraria(curso)}.`],
    [10, 72, 120, `Código de verificação: ${codigo}`],
    [10, 72, 104, 'Confira a autenticidade em /api/certificados/<código>.'],
  ];
  const conteudo = linhas
    .map(([tamanho, x, y, texto]) => `BT /F1 ${tamanho} Tf ${x} ${y} Td (${literal(texto)}) Tj ET`)
    .join('\n');

  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    `<< /Length ${conteudo.length} >>\nstream\n${conteudo}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const posicoes = [];
  objetos.forEach((objeto, i) => {
    posicoes.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objeto}\nendobj\n`;
  });
  const inicioXref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  pdf += posicoes.map((p) => `${String(p).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF\n`;
  // Só há caracteres ASCII no arquivo (os demais viraram escapes), então latin1 preserva os tamanhos
  return Buffer.from(pdf, 'latin1');
}

module.exports = { gerarPdf, cargaHoraria };
