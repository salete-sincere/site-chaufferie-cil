import { readFileSync } from 'node:fs';

const revision = process.argv[2];
const owner = process.argv[3] || 'salete-sincere';

if (!/^[a-f0-9]{40}$/.test(revision || '') || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(owner)) {
  console.error('Usage: node scripts/render-manifests.mjs <SHA Git complet testé> [propriétaire GHCR]');
  process.exit(1);
}

const image = `ghcr.io/${owner}/site-chaufferie-cil:${revision}`;
const files = ['namespace.yaml', 'quota.yaml', 'network-policy.yaml', 'app.yaml', 'ingress.yaml'];
const manifests = files.map((name) => readFileSync(new URL(`../k8s/${name}`, import.meta.url), 'utf8').trim());
process.stdout.write(`${manifests.join('\n---\n')
  .replace('REPLACE_WITH_TESTED_IMAGE', image)
  .replace('REPLACE_WITH_TESTED_REVISION', revision)}\n`);
