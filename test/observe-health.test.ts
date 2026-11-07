import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('the observer preserves a healthy window instead of starting a shortened final request', async () => {
  const revision = '0123456789abcdef0123456789abcdef01234567';
  let activeRequests = 0;
  let maximumConcurrentRequests = 0;
  const server = createServer((request, response) => {
    activeRequests += 1;
    maximumConcurrentRequests = Math.max(maximumConcurrentRequests, activeRequests);
    response.once('close', () => { activeRequests -= 1; });
    const timer = setTimeout(() => {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ status: 'ok', revision: request.url === '/healthy' ? revision : 'old' }));
    }, request.url === '/healthy' ? 1100 : 0);
    response.once('close', () => clearTimeout(timer));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');

  async function observe(path: string, duration: string) {
    const child = spawn(process.execPath, [
      fileURLToPath(new URL('../scripts/observe-health.mjs', import.meta.url)),
      `http://127.0.0.1:${(address as { port: number }).port}${path}`, revision, duration, '1',
    ]);
    let output = '';
    let errors = '';
    child.stdout.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on('data', (chunk: Buffer) => { errors += chunk.toString(); });
    const code = await new Promise<number | null>((resolve, reject) => {
      child.once('error', reject);
      child.once('close', resolve);
    });
    const records = output.trim().split('\n').map((line) => JSON.parse(line));
    return { code, summary: records.at(-1), samples: records.slice(0, -1), errors };
  }

  try {
    // Responses take 1.1 s, below the normal 2 s timeout. A last request with
    // only ~0.7 s left used to turn this continuously healthy server into red.
    const healthy = await observe('/healthy', '4');
    assert.equal(healthy.code, 0, healthy.errors);
    assert.equal(healthy.summary.passed, true);
    assert.equal(healthy.summary.failures, 0);
    assert.ok(healthy.summary.healthySeconds >= 1);
    assert.ok(healthy.samples.length >= 1);
    assert.ok(healthy.samples.every((sample) => sample.valid && sample.status === 200));
    assert.equal(maximumConcurrentRequests, 1);

    const wrongRevision = await observe('/wrong-revision', '3');
    assert.equal(wrongRevision.code, 1);
    assert.equal(wrongRevision.summary.passed, false);
    assert.ok(wrongRevision.summary.failures >= 1);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
