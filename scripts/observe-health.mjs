import { setTimeout as sleep } from 'node:timers/promises';
import { performance } from 'node:perf_hooks';

const [target, revision, durationArgument = '600', minimumArgument = '60'] = process.argv.slice(2);
const durationSeconds = Number(durationArgument);
const minimumHealthySeconds = Number(minimumArgument);
let url;
try { url = new URL(target); } catch { /* Invalid arguments are reported together. */ }
if (!url || !['http:', 'https:'].includes(url.protocol) || url.username || url.password
    || url.search || url.hash || !/^[a-f0-9]{40}$/.test(revision || '')
    || !Number.isInteger(durationSeconds) || durationSeconds < 1 || durationSeconds > 600
    || !Number.isInteger(minimumHealthySeconds) || minimumHealthySeconds < 1
    || minimumHealthySeconds > durationSeconds) {
  console.error('Usage: node scripts/observe-health.mjs <URL /health> <SHA attendu> [durée 1–600 s] [fenêtre saine 60 s]');
  process.exit(1);
}

const started = performance.now();
const deadline = started + durationSeconds * 1000;
const requestTimeoutMs = 2000;
let healthySince;
let consecutiveFailures = 0;
let samples = 0;
let failures = 0;
let alerted = false;
let interrupted = false;
process.once('SIGINT', () => { interrupted = true; });
process.once('SIGTERM', () => { interrupted = true; });

while (!interrupted && performance.now() < deadline) {
  const requestStarted = performance.now();
  // Ending the observation must not turn a healthy response into a timeout.
  // Only begin requests that can keep their full timeout within the budget.
  if (deadline - requestStarted < requestTimeoutMs) break;
  let status = null;
  let valid = false;
  let failure = null;
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(requestTimeoutMs),
      redirect: 'error',
      cache: 'no-store',
      headers: { Accept: 'application/json', 'User-Agent': 'site-chaufferie-cil-release-check/1.0' },
    });
    status = response.status;
    const health = await response.json();
    valid = response.ok && health.status === 'ok' && health.revision === revision;
    if (!valid) failure = 'unexpected-status-or-revision';
  } catch (error) {
    failure = error.name === 'TimeoutError' ? 'timeout' : 'request-or-json-failed';
  }
  samples += 1;
  if (valid) {
    healthySince ??= requestStarted;
    consecutiveFailures = 0;
  } else {
    healthySince = undefined;
    consecutiveFailures += 1;
    failures += 1;
    if (consecutiveFailures >= 3 && !alerted) {
      alerted = true;
      console.error('Trois échecs consécutifs : signaler une seule anomalie au propriétaire selon le guide infra.');
    }
  }
  process.stdout.write(`${JSON.stringify({
    type: 'sample', at: new Date().toISOString(), target: url.href, status,
    durationMs: Math.round(performance.now() - requestStarted), valid, failure,
  })}\n`);
  const pause = Math.min(500 - (performance.now() - requestStarted), deadline - performance.now());
  if (pause > 0) await sleep(pause);
}

const healthySeconds = healthySince === undefined ? 0 : (performance.now() - healthySince) / 1000;
const passed = !interrupted && healthySeconds >= minimumHealthySeconds;
process.stdout.write(`${JSON.stringify({
  type: 'summary', at: new Date().toISOString(), revision, samples, failures,
  healthySeconds: Math.floor(healthySeconds), minimumHealthySeconds, interrupted, passed,
})}\n`);
process.exitCode = passed ? 0 : 1;
