const fs = require('fs');
const path = require('path');
const {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} = require('docx');

const source = process.argv[2] || 'BUKU_PANDUAN_SUPPLIER.md';
const output = process.argv[3] || source.replace(/\.md$/i, '.docx');
const root = process.cwd();
const markdown = fs.readFileSync(path.join(root, source), 'utf8');
const lines = markdown.split(/\r?\n/);

function textRun(text, options = {}) {
  return new TextRun({
    text,
    font: options.font || 'Times New Roman',
    size: options.size || 24,
    bold: options.bold,
    italics: options.italics,
  });
}

function paragraph(text = '', options = {}) {
  return new Paragraph({
    children: [textRun(text, options)],
    heading: options.heading,
    bullet: options.bullet ? { level: 0 } : undefined,
    spacing: { after: options.after ?? 120 },
    alignment: options.alignment,
  });
}

function parseInline(text) {
  const parts = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) parts.push(textRun(text.slice(lastIndex, match.index)));
    const token = match[0];
    if (token.startsWith('**')) parts.push(textRun(token.slice(2, -2), { bold: true }));
    else parts.push(textRun(token.slice(1, -1), { font: 'Courier New', size: 20 }));
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) parts.push(textRun(text.slice(lastIndex)));
  return parts.length ? parts : [textRun('')];
}

function markdownTableToDocx(rows) {
  const parsed = rows
    .filter((line) => !/^\s*\|?\s*:?-{3,}:?/.test(line.replace(/\|/g, '').trim()))
    .map((line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim()));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: parsed.map((row, rowIndex) => new TableRow({
      children: row.map((cell) => new TableCell({
        children: [new Paragraph({
          children: rowIndex === 0 ? [textRun(cell, { bold: true })] : parseInline(cell),
        })],
      })),
    })),
  });
}

function imageParagraph(relativePath, alt) {
  const imagePath = path.join(root, relativePath.replace(/\//g, path.sep));
  if (!fs.existsSync(imagePath)) return paragraph(`[GAMBAR TIDAK DITEMUKAN: ${relativePath}]`);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 180 },
    children: [
      new ImageRun({
        data: fs.readFileSync(imagePath),
        transformation: { width: 620, height: 390 },
        altText: { title: alt, description: alt, name: alt },
      }),
    ],
  });
}

const children = [];
let i = 0;

while (i < lines.length) {
  const line = lines[i];

  if (!line.trim()) {
    i += 1;
    continue;
  }

  if (line.trim() === '---') {
    children.push(paragraph(''));
    i += 1;
    continue;
  }

  const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
  if (imageMatch) {
    children.push(imageParagraph(imageMatch[2], imageMatch[1]));
    i += 1;
    continue;
  }

  const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
  if (headingMatch) {
    const level = headingMatch[1].length;
    const text = headingMatch[2];
    children.push(paragraph(text, {
      bold: true,
      size: level === 1 ? 32 : level === 2 ? 28 : 24,
      heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
      after: 180,
    }));
    i += 1;
    continue;
  }

  if (line.startsWith('```')) {
    const codeLines = [];
    i += 1;
    while (i < lines.length && !lines[i].startsWith('```')) {
      codeLines.push(lines[i]);
      i += 1;
    }
    children.push(new Paragraph({
      children: [textRun(codeLines.join('\n'), { font: 'Courier New', size: 18 })],
      spacing: { after: 160 },
    }));
    i += 1;
    continue;
  }

  if (line.trim().startsWith('|')) {
    const tableRows = [];
    while (i < lines.length && lines[i].trim().startsWith('|')) {
      tableRows.push(lines[i]);
      i += 1;
    }
    children.push(markdownTableToDocx(tableRows));
    children.push(paragraph(''));
    continue;
  }

  if (/^-\s+/.test(line.trim())) {
    children.push(new Paragraph({
      children: parseInline(line.trim().replace(/^-\s+/, '')),
      bullet: { level: 0 },
      spacing: { after: 80 },
    }));
    i += 1;
    continue;
  }

  children.push(new Paragraph({
    children: parseInline(line),
    spacing: { after: 120 },
  }));
  i += 1;
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Times New Roman', size: 24 },
        paragraph: { spacing: { line: 360 } },
      },
    },
  },
  sections: [{ children }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(path.join(root, output), buffer);
  console.log(`DOCX generated: ${output}`);
});
