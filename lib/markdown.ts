export type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; text: string }
  | { type: "rule" };

export type MarkdownInline =
  | { type: "text"; text: string }
  | { type: "code"; text: string }
  | { type: "strong"; children: MarkdownInline[] }
  | { type: "em"; children: MarkdownInline[] }
  | { type: "link"; href: string; children: MarkdownInline[] };

const LIST_ITEM = /^\s*(?:[-*+]|(\d+)\.)\s+(.*)$/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const RULE = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;
const FENCE = /^\s*```/;
const QUOTE = /^\s*>\s?(.*)$/;

function startsNewBlock(line: string) {
  return (
    FENCE.test(line) ||
    HEADING.test(line) ||
    RULE.test(line) ||
    QUOTE.test(line) ||
    LIST_ITEM.test(line)
  );
}

/** Block parser for the small Markdown subset the site uses. It is tolerant of partial input, so streaming text renders cleanly. */
export function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === "") {
      index += 1;
    } else if (FENCE.test(line)) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !FENCE.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ type: "code", text: code.join("\n") });
    } else if (HEADING.test(line)) {
      const [, hashes, text] = line.match(HEADING) ?? [];
      const level = Math.min(hashes.length, 3) as 1 | 2 | 3;
      blocks.push({ type: "heading", level, text: text.trim() });
      index += 1;
    } else if (RULE.test(line)) {
      blocks.push({ type: "rule" });
      index += 1;
    } else if (QUOTE.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && QUOTE.test(lines[index])) {
        quote.push(lines[index].replace(QUOTE, "$1"));
        index += 1;
      }
      blocks.push({ type: "quote", text: quote.join(" ") });
    } else if (LIST_ITEM.test(line)) {
      const ordered = Boolean(line.match(LIST_ITEM)?.[1]);
      const items: string[] = [];
      while (index < lines.length && LIST_ITEM.test(lines[index])) {
        items.push(lines[index].match(LIST_ITEM)?.[2] ?? "");
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
    } else {
      const paragraph: string[] = [];
      while (
        index < lines.length &&
        lines[index].trim() !== "" &&
        !startsNewBlock(lines[index])
      ) {
        paragraph.push(lines[index].trim());
        index += 1;
      }
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    }
  }

  return blocks;
}

const INLINE =
  /`([^`]+)`|\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|\*([^*\s](?:[^*]*[^*\s])?)\*/g;

function isSafeHref(href: string) {
  return /^(https?:|mailto:|\/(?!\/)|#)/i.test(href);
}

export function parseInline(text: string): MarkdownInline[] {
  const nodes: MarkdownInline[] = [];
  let cursor = 0;

  for (const match of text.matchAll(INLINE)) {
    const [raw, code, strong, linkText, href, em] = match;
    if (match.index > cursor) {
      nodes.push({ type: "text", text: text.slice(cursor, match.index) });
    }

    if (code !== undefined) {
      nodes.push({ type: "code", text: code });
    } else if (strong !== undefined) {
      nodes.push({ type: "strong", children: parseInline(strong) });
    } else if (linkText !== undefined) {
      nodes.push(
        isSafeHref(href)
          ? { type: "link", href, children: parseInline(linkText) }
          : { type: "text", text: raw },
      );
    } else {
      nodes.push({ type: "em", children: parseInline(em) });
    }
    cursor = match.index + raw.length;
  }

  if (cursor < text.length) {
    nodes.push({ type: "text", text: text.slice(cursor) });
  }
  return nodes;
}
