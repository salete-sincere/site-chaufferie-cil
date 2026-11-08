import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getContent, parseContentFiles, renderMarkdown } from '../lib/content.ts';

async function files() {
  return Object.fromEntries(await Promise.all(['faq', 'figures', 'overview', 'sources'].map(async (name) => [name, await readFile(new URL(`../content/${name}.md`, import.meta.url), 'utf8')]))) as Record<'faq' | 'figures' | 'overview' | 'sources', string>;
}

test('the editorial collection preserves all promised entries and the eight figure themes', async () => {
  const content = await getContent();
  assert.equal(content.faq.length, 39);
  assert.equal(content.figures.length, 51);
  assert.equal(content.overview.length, 10);
  assert.equal(content.sources.length, 27);
  for (let index = 1; index <= 39; index++) assert.ok(content.faq.some(({ id }) => id === `faq-${String(index).padStart(2, '0')}`));
  for (let index = 1; index <= 51; index++) assert.ok(content.figures.some(({ id }) => id === `figure-${String(index).padStart(2, '0')}`));
  for (let index = 1; index <= 27; index++) assert.ok(content.sources.some(({ id }) => id === `S${index}`));
  assert.equal(new Set(content.figures.map(({ theme }) => theme)).size, 8);
  assert.equal(content.figureThemeNotes.length, 8);
  assert.equal(content.updatedAt, '2026-11-08');
  assert.match(content.figures.find(({ value }) => value === '30 camions par jour')!.note!, /exceptionnel/);
  assert.match(content.figures.find(({ value }) => value === 'Une par jour sur cinq jours')!.note!, /six jours/);
  assert.match(content.faq.find(({ id }) => id === 'faq-34')!.answer, /procédure locale complète/);
});

test('a misspelled source reference fails validation instead of publishing a broken citation', async () => {
  const input = await files();
  input.faq = input.faq.replace('"S2"', '"S99"');
  assert.throws(() => parseContentFiles(input), /source.*S99/i);
});

test('duplicate anchor IDs and missing entries fail validation', async () => {
  const input = await files();
  assert.throws(() => parseContentFiles({ ...input, faq: input.faq.replace('"faq-02"', '"faq-01"') }), /duplicate.*faq-01/i);
  assert.throws(() => parseContentFiles({ ...input, faq: input.faq.substring(0, input.faq.lastIndexOf('<!-- entry -->')) }), /39/);
});

test('a non-web source URL and inconsistent dates fail validation', async () => {
  const input = await files();
  assert.throws(() => parseContentFiles({ ...input, sources: input.sources.replace(/url: "https:[^\n]+/, 'url: "javascript:alert(1)"') }), /URL/i);
  assert.throws(() => parseContentFiles({ ...input, faq: input.faq.replace(/updatedAt: "[^"]+"/, 'updatedAt: "2000-01-01"') }), /date/i);
});

test('authored HTML and unsafe Markdown links fail validation', async () => {
  const input = await files();
  assert.throws(() => parseContentFiles({ ...input, faq: `${input.faq}\n<script>alert(1)</script>` }), /HTML/i);
  assert.throws(() => parseContentFiles({ ...input, faq: `${input.faq}\n[unsafe](javascript:alert)` }), /link/i);
});

test('the renderer preserves useful formatting and escapes HTML and unsafe links', () => {
  const result = renderMarkdown('**Texte** [source](/sources#S1)\n\n<script>alert(1)</script>\n\n[piège](javascript:alert)\n\n![image](https://example.org/pixel)');
  assert.match(result, /<strong>Texte<\/strong>/);
  assert.match(result, /href="\/sources#S1"/);
  assert.doesNotMatch(result, /<script|<img|href="javascript:/i);
  assert.match(result, /&lt;script&gt;/);
});
