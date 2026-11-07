import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getPressRelease, parsePressRelease } from '../lib/content.ts';

test('the press release keeps its author, date, provenance and complete statement', async () => {
  const release = await getPressRelease();
  assert.equal(release.publisher, 'Haubourdin Alternative Citoyenne');
  assert.equal(release.publishedAt, '2026-11-06');
  assert.match(release.sourceDocument, /1PHJvxNW0oxgmq5ryXvIcbhpM9xZVpjjvby2sBQRTNt4/);
  assert.match(release.body, /maximum de 30 camions par jour en secours/);
  assert.match(release.body, /par des moyens démocratiques/);
});

test('an undated press release, unsafe link or raw HTML cannot reach the build', async () => {
  const input = await readFile(new URL('../content/press-release.md', import.meta.url), 'utf8');
  assert.throws(() => parsePressRelease(input.replace('2026-11-06', 'not-a-date')), /date/i);
  assert.throws(() => parsePressRelease(input.replace(/sourceDocument: .+/, 'sourceDocument: "javascript:alert(1)"')), /URL/i);
  assert.throws(() => parsePressRelease(`${input}\n<script>alert(1)</script>`), /HTML/i);
  assert.throws(() => parsePressRelease(`${input}\n[unsafe](javascript:alert)`), /link/i);
});
