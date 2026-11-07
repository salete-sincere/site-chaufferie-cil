import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked, Renderer } from 'marked';

export type FaqEntry = { id: string; question: string; theme: string; answer: string; sourceIds: string[] };
export type FigureEntry = { id: string; value: string; description: string; theme: string; publisher: string; sourceIds: string[]; note?: string };
export type OverviewEntry = { id: string; title: string; body: string; sourceIds: string[] };
export type SourceEntry = { id: string; title: string; publisher: string; description: string; url: string };
export type FigureThemeNote = { theme: string; body: string; sourceIds: string[] };
export type Content = {
  faq: FaqEntry[];
  figures: FigureEntry[];
  overview: OverviewEntry[];
  sources: SourceEntry[];
  figureThemeNotes: FigureThemeNote[];
  updatedAt: string;
  sourceDocument: string;
};

type CollectionName = 'faq' | 'figures' | 'overview' | 'sources';
export type ContentFiles = Record<CollectionName, string>;
const collectionNames: CollectionName[] = ['faq', 'figures', 'overview', 'sources'];

function requiredText(metadata: Record<string, unknown>, key: string): string {
  const value = metadata[key];
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing or invalid ${key}`);
  return value.trim();
}

function references(metadata: Record<string, unknown>): string[] {
  const value = metadata.sourceIds;
  if (!Array.isArray(value) || !value.length || value.some((id) => typeof id !== 'string')) {
    throw new Error('Missing or invalid sourceIds');
  }
  return value;
}

/** Each entry has its own YAML front matter after an explicit Markdown boundary. */
export function parseContentFiles(files: ContentFiles): Content {
  const parsed = Object.fromEntries(collectionNames.map((name) => {
    const [header, ...blocks] = files[name].split(/\n<!-- entry -->\r?\n/);
    const document = matter(header);
    return [name, { metadata: document.data, entries: blocks.map((block) => matter(block)) }];
  })) as Record<CollectionName, { metadata: Record<string, unknown>; entries: ReturnType<typeof matter>[] }>;

  const content: Content = {
    updatedAt: requiredText(parsed.faq.metadata, 'updatedAt'),
    sourceDocument: requiredText(parsed.faq.metadata, 'sourceDocument'),
    faq: parsed.faq.entries.map(({ data, content: body }) => ({
      id: requiredText(data, 'id'), question: requiredText(data, 'question'),
      theme: requiredText(data, 'theme'), answer: body.trim(), sourceIds: references(data),
    })),
    figures: parsed.figures.entries.map(({ data, content: body }) => ({
      id: requiredText(data, 'id'), value: requiredText(data, 'value'),
      theme: requiredText(data, 'theme'), publisher: requiredText(data, 'publisher'),
      description: body.trim(), sourceIds: references(data), note: requiredText(data, 'note'),
    })),
    overview: parsed.overview.entries.map(({ data, content: body }) => ({
      id: requiredText(data, 'id'), title: requiredText(data, 'title'), body: body.trim(), sourceIds: references(data),
    })),
    sources: parsed.sources.entries.map(({ data, content: body }) => ({
      id: requiredText(data, 'id'), title: requiredText(data, 'title'),
      publisher: requiredText(data, 'publisher'), url: requiredText(data, 'url'), description: body.trim(),
    })),
    figureThemeNotes: Array.isArray(parsed.figures.metadata.themeNotes)
      ? parsed.figures.metadata.themeNotes.map((note: Record<string, unknown>) => ({
          theme: requiredText(note, 'theme'), body: requiredText(note, 'body'), sourceIds: references(note),
        })) : [],
  };
  for (const name of collectionNames) {
    if (parsed[name].metadata.collection !== name) throw new Error(`Invalid collection: ${name}`);
    if (parsed[name].metadata.updatedAt !== content.updatedAt) throw new Error('Inconsistent content date');
    if (parsed[name].metadata.sourceDocument !== content.sourceDocument) throw new Error('Inconsistent source document');
  }
  validateContent(content);
  return content;
}

export async function getContent(directory = join(process.cwd(), 'content')): Promise<Content> {
  const files = Object.fromEntries(await Promise.all(collectionNames.map(async (name) => [name, await readFile(join(directory, `${name}.md`), 'utf8')]))) as ContentFiles;
  return parseContentFiles(files);
}

function webUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password;
  } catch {
    return false;
  }
}

function safeLink(value: string): boolean {
  return webUrl(value) || /^\/(?![\\/])[^\\\u0000-\u0020]*$/.test(value) || /^#[A-Za-z0-9_-]+$/.test(value);
}

function validateContent(content: Content): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(content.updatedAt) || Number.isNaN(Date.parse(content.updatedAt))) {
    throw new Error('Invalid content date');
  }
  if (!webUrl(content.sourceDocument)) throw new Error('Invalid source document URL');
  const expected = { faq: 34, figures: 48, overview: 10, sources: 17 };
  const ids = new Set<string>();
  for (const name of collectionNames) {
    if (content[name].length !== expected[name]) throw new Error(`${name} must contain ${expected[name]} entries`);
    for (const entry of content[name]) {
      if (ids.has(entry.id)) throw new Error(`Duplicate ID: ${entry.id}`);
      if (!/^(?:[a-z][a-z0-9-]*|S\d+)$/.test(entry.id)) throw new Error(`Invalid ID: ${entry.id}`);
      ids.add(entry.id);
    }
  }
  const sources = new Set(content.sources.map(({ id }) => id));
  for (let index = 1; index <= 17; index++) {
    if (!sources.has(`S${index}`)) throw new Error(`Missing source S${index}`);
  }
  for (const source of content.sources) {
    if (!webUrl(source.url)) throw new Error(`Invalid URL for source ${source.id}`);
  }
  const citedEntries = [...content.faq, ...content.figures, ...content.overview, ...content.figureThemeNotes];
  for (const entry of citedEntries) {
    for (const id of entry.sourceIds) {
      if (!sources.has(id)) throw new Error(`Unknown source ${id}`);
    }
    if (new Set(entry.sourceIds).size !== entry.sourceIds.length) throw new Error('Duplicate source reference');
  }
  const themes = new Set(content.figures.map(({ theme }) => theme));
  if (themes.size !== 8 || content.figureThemeNotes.length !== 8 || new Set(content.figureThemeNotes.map(({ theme }) => theme)).size !== 8) {
    throw new Error('Expected eight figure themes and eight theme notes');
  }
  for (const note of content.figureThemeNotes) {
    if (!themes.has(note.theme)) throw new Error(`Unknown figure theme: ${note.theme}`);
  }
  const markdownBodies = [
    ...content.faq.map(({ answer }) => answer), ...content.overview.map(({ body }) => body),
    ...content.figures.map(({ description, note }) => `${description}\n\n${note}`),
    ...content.sources.map(({ description }) => description), ...content.figureThemeNotes.map(({ body }) => body),
  ];
  for (const body of markdownBodies) {
    if (!body.trim()) throw new Error('Empty content body');
    marked.walkTokens(marked.lexer(body), (token) => {
      if (token.type === 'html') throw new Error('Raw HTML is not allowed in content');
      if (token.type === 'image') throw new Error('Markdown images are not allowed in content');
      if (token.type === 'link') {
        if (!safeLink(token.href)) throw new Error(`Unsafe Markdown link: ${token.href}`);
        if (token.href.startsWith('/sources#') && !sources.has(token.href.slice('/sources#'.length))) {
          throw new Error(`Unknown source link: ${token.href}`);
        }
      }
    });
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

/** Local Markdown only: escape raw HTML, restrict link protocols, and omit images. */
export function renderMarkdown(markdown: string): string {
  const renderer = new Renderer();
  renderer.html = ({ text }) => escapeHtml(text);
  renderer.image = ({ text }) => escapeHtml(text);
  renderer.link = function ({ href, title, tokens }) {
    const label = this.parser.parseInline(tokens);
    if (!safeLink(href)) return label;
    return `<a href="${escapeHtml(href)}"${title ? ` title="${escapeHtml(title)}"` : ''}>${label}</a>`;
  };
  return marked.parse(markdown, { async: false, renderer });
}
