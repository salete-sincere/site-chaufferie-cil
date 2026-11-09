import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getContent, parseContentFiles, renderMarkdown } from '../lib/content.ts';

async function files() {
  return Object.fromEntries(await Promise.all(['faq', 'figures', 'overview', 'sources', 'complements'].map(async (name) => [name, await readFile(new URL(`../content/${name}.md`, import.meta.url), 'utf8')]))) as Record<'faq' | 'figures' | 'overview' | 'sources' | 'complements', string>;
}

test('the editorial collection preserves all promised entries and the eight figure themes', async () => {
  const content = await getContent();
  assert.equal(content.faq.length, 51);
  assert.equal(content.figures.length, 51);
  assert.equal(content.overview.length, 10);
  assert.equal(content.sources.length, 81);
  for (let index = 1; index <= 51; index++) assert.ok(content.faq.some(({ id }) => id === `faq-${String(index).padStart(2, '0')}`));
  for (let index = 1; index <= 51; index++) assert.ok(content.figures.some(({ id }) => id === `figure-${String(index).padStart(2, '0')}`));
  for (let index = 1; index <= 81; index++) assert.ok(content.sources.some(({ id }) => id === `S${index}`));
  assert.equal(new Set(content.figures.map(({ theme }) => theme)).size, 8);
  assert.equal(content.figureThemeNotes.length, 8);
  assert.equal(content.updatedAt, '2026-11-09');
  assert.match(content.figures.find(({ value }) => value === '30 camions par jour')!.note!, /exceptionnel/);
  assert.match(content.figures.find(({ value }) => value === 'Une par jour sur cinq jours')!.note!, /six jours/);
  assert.match(content.faq.find(({ id }) => id === 'faq-34')!.answer, /procédure locale complète/);
});

test('the additions preserve detailed evidence, cautions and follow-up inspection links', async () => {
  const content = await getContent();
  assert.deepEqual(content.complements.map(({ id }) => id), [
    'complement-navigation', 'complement-climat', 'complement-raccordement',
    'complement-associations', 'complement-documents', 'complement-hydrothermie',
    'complement-couts', 'complement-industries', 'complement-sante', 'complement-cumul',
  ]);
  const hydrothermy = content.complements.find(({ id }) => id === 'complement-hydrothermie')!;
  assert.match(hydrothermy.body, /3,35\s*m³\/s/);
  assert.match(hydrothermy.body, /hypoth[èé]s/i);
  assert.match(hydrothermy.body, /ni une autorisation ni une condition garantie/);
  const health = content.complements.find(({ id }) => id === 'complement-sante')!;
  assert.match(health.body, /101 communes/);
  assert.match(health.body, /pas nombre de cas de la seule commune/);
  assert.match(content.faq.find(({ id }) => id === 'faq-47')!.question, /exemples chiffrés/);
  assert.match(content.faq.find(({ id }) => id === 'faq-50')!.answer, /ne permettent pas cette attribution/);
  const text = content.complements.map(({ title, body }) => `${title}\n${body}`).join('\n');
  assert.doesNotMatch(text, /\bHAC\b|Anne-Sophie|rapportée oralement|Pour le site\s*:|Contrôles avant reprise\s*:/);
  for (const [id, followupUrl] of [
    ['S69', 'https://www.georisques.gouv.fr/webappReport/ws/installations/inspection/3cwnvUaula2bu177unhf9KrtxS3ZmXiW'],
    ['S73', 'https://www.georisques.gouv.fr/webappReport/ws/installations/inspection/hb7CKy5yoIajvFNncpaiMPjj43F8j8za'],
  ]) {
    const source = content.sources.find((source) => source.id === id)!;
    assert.ok(renderMarkdown(source.description).includes(`href="${followupUrl}"`), `${id} must retain its follow-up document`);
  }
});

test('a misspelled source reference fails validation instead of publishing a broken citation', async () => {
  const input = await files();
  input.faq = input.faq.replace('"S2"', '"S99"');
  assert.throws(() => parseContentFiles(input), /source.*S99/i);
});

test('duplicate anchor IDs and missing entries fail validation', async () => {
  const input = await files();
  assert.throws(() => parseContentFiles({ ...input, faq: input.faq.replace('"faq-02"', '"faq-01"') }), /duplicate.*faq-01/i);
  assert.throws(() => parseContentFiles({ ...input, faq: input.faq.substring(0, input.faq.lastIndexOf('<!-- entry -->')) }), /51/);
  assert.throws(() => parseContentFiles({ ...input, complements: input.complements.replace('complement-climat', 'complement-navigation') }), /duplicate.*complement-navigation/i);
});

test('a non-web source URL and inconsistent dates fail validation', async () => {
  const input = await files();
  assert.throws(() => parseContentFiles({ ...input, sources: input.sources.replace(/url: "https:[^\n]+/, 'url: "javascript:alert(1)"') }), /URL/i);
  assert.throws(() => parseContentFiles({ ...input, faq: input.faq.replace(/updatedAt: "[^"]+"/, 'updatedAt: "2000-01-01"') }), /date/i);
  assert.throws(() => parseContentFiles({ ...input, complements: input.complements.replace(/updatedAt: [^\n]+/, 'updatedAt: "2000-01-01"') }), /date/i);
});

test('authored HTML and unsafe Markdown links fail validation', async () => {
  const input = await files();
  assert.throws(() => parseContentFiles({ ...input, faq: `${input.faq}\n<script>alert(1)</script>` }), /HTML/i);
  assert.throws(() => parseContentFiles({ ...input, faq: `${input.faq}\n[unsafe](javascript:alert)` }), /link/i);
});

test('documentary additions cannot introduce broken references, HTML, images or unsafe links', async () => {
  const input = await files();
  assert.throws(() => parseContentFiles({ ...input, complements: input.complements.replace(/^sourceIds:.*$/m, 'sourceIds: ["S99"]') }), /source.*S99/i);
  assert.throws(() => parseContentFiles({ ...input, complements: `${input.complements}\n[source inconnue](/sources#S99)` }), /source.*S99/i);
  assert.throws(() => parseContentFiles({ ...input, complements: `${input.complements}\n<script>alert(1)</script>` }), /HTML/i);
  assert.throws(() => parseContentFiles({ ...input, complements: `${input.complements}\n![image](https://example.org/pixel)` }), /image/i);
  assert.throws(() => parseContentFiles({ ...input, complements: `${input.complements}\n[unsafe](javascript:alert)` }), /link/i);
});

test('the renderer preserves useful formatting and escapes HTML and unsafe links', () => {
  const result = renderMarkdown('**Texte** [source](/sources#S1)\n\n<script>alert(1)</script>\n\n[piège](javascript:alert)\n\n![image](https://example.org/pixel)');
  assert.match(result, /<strong>Texte<\/strong>/);
  assert.match(result, /href="\/sources#S1"/);
  assert.doesNotMatch(result, /<script|<img|href="javascript:/i);
  assert.match(result, /&lt;script&gt;/);
});
