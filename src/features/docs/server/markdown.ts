import 'server-only';

export type MarkdownFrontmatterValue = string | string[];

export type MarkdownBlock =
  | { type: 'heading'; level: number; text: string; id: string }
  | { type: 'paragraph'; text: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'code'; language: string; code: string }
  | { type: 'blockquote'; text: string }
  | { type: 'callout'; tone: string; title: string; text: string }
  | { type: 'rule' };

export function slugifyFragment(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'secao';
}

export function stripNumericPrefix(value: string): string {
  return value.replace(/^\d+\s*-\s*/, '').trim();
}

export function parseFrontmatter(raw: string): {
  frontmatter: Record<string, MarkdownFrontmatterValue>;
  body: string;
} {
  const normalized = raw.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return { frontmatter: {}, body: normalized };
  }

  const lines = normalized.split('\n');
  let closingIndex = -1;
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index] === '---') {
      closingIndex = index;
      break;
    }
  }

  if (closingIndex === -1) {
    return { frontmatter: {}, body: normalized };
  }

  const frontmatterLines = lines.slice(1, closingIndex);
  const frontmatter: Record<string, MarkdownFrontmatterValue> = {};

  for (let index = 0; index < frontmatterLines.length; index += 1) {
    const line = frontmatterLines[index];
    const arrayMatch = line.match(/^([A-Za-z][\w-]*):\s*$/);
    if (arrayMatch) {
      const key = arrayMatch[1];
      const values: string[] = [];
      let cursor = index + 1;
      while (cursor < frontmatterLines.length) {
        const itemLine = frontmatterLines[cursor];
        const itemMatch = itemLine.match(/^\s*-\s+(.+)$/);
        if (!itemMatch) break;
        values.push(itemMatch[1].trim());
        cursor += 1;
      }
      frontmatter[key] = values;
      index = cursor - 1;
      continue;
    }

    const scalarMatch = line.match(/^([A-Za-z][\w-]*):\s*(.+)$/);
    if (scalarMatch) {
      frontmatter[scalarMatch[1]] = scalarMatch[2].trim();
    }
  }

  return {
    frontmatter,
    body: lines.slice(closingIndex + 1).join('\n').trim(),
  };
}

function createHeadingIdFactory() {
  const counts = new Map<string, number>();
  return (text: string) => {
    const base = slugifyFragment(text);
    const current = counts.get(base) || 0;
    counts.set(base, current + 1);
    return current === 0 ? base : `${base}-${current + 1}`;
  };
}

function isUnorderedListLine(line: string): boolean {
  return /^-\s+/.test(line);
}

function isOrderedListLine(line: string): boolean {
  return /^\d+\.\s+/.test(line);
}

function isRuleLine(line: string): boolean {
  return /^-{3,}\s*$/.test(line.trim());
}

function isBlockBoundary(line: string): boolean {
  if (!line.trim()) return true;
  if (line.startsWith('```')) return true;
  if (/^#{1,6}\s+/.test(line)) return true;
  if (/^>\s?/.test(line)) return true;
  if (isUnorderedListLine(line)) return true;
  if (isOrderedListLine(line)) return true;
  if (isRuleLine(line)) return true;
  return false;
}

function parseQuoteBlock(lines: string[]): MarkdownBlock {
  const cleaned = lines.map((line) => line.replace(/^>\s?/, ''));
  const calloutMatch = cleaned[0]?.match(/^\[!([A-Za-z]+)\]\s*(.*)$/);
  if (calloutMatch) {
    const tone = calloutMatch[1].toLowerCase();
    const title = calloutMatch[2]?.trim() || tone.toUpperCase();
    const text = cleaned.slice(1).join(' ').trim();
    return {
      type: 'callout',
      tone,
      title,
      text,
    };
  }

  return {
    type: 'blockquote',
    text: cleaned.join(' ').trim(),
  };
}

export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  const nextHeadingId = createHeadingIdFactory();

  for (let index = 0; index < lines.length; ) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({
        type: 'code',
        language,
        code: codeLines.join('\n').replace(/\n+$/, ''),
      });
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const text = headingMatch[2].trim();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text,
        id: nextHeadingId(text),
      });
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index]);
        index += 1;
      }
      blocks.push(parseQuoteBlock(quoteLines));
      continue;
    }

    if (isUnorderedListLine(line)) {
      const items: string[] = [];
      while (index < lines.length && isUnorderedListLine(lines[index])) {
        items.push(lines[index].replace(/^-\s+/, '').trim());
        index += 1;
      }
      blocks.push({ type: 'unordered-list', items });
      continue;
    }

    if (isOrderedListLine(line)) {
      const items: string[] = [];
      while (index < lines.length && isOrderedListLine(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, '').trim());
        index += 1;
      }
      blocks.push({ type: 'ordered-list', items });
      continue;
    }

    if (isRuleLine(line)) {
      blocks.push({ type: 'rule' });
      index += 1;
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && !isBlockBoundary(lines[index])) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    const text = paragraphLines.join(' ').replace(/\s+/g, ' ').trim();
    if (text) {
      blocks.push({ type: 'paragraph', text });
    }
  }

  return blocks;
}

export function extractLeadParagraph(blocks: MarkdownBlock[]): string {
  const offset = blocks[0]?.type === 'heading' && blocks[0].level === 1 ? 1 : 0;
  for (let index = offset; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.type === 'paragraph') {
      return block.text;
    }
  }
  return '';
}
