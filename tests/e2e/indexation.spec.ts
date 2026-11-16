import { expect, test } from '@playwright/test';

const publicOrigin = 'https://stopchaufferiehaubourdin.fr';
const routes = ['/', '/informer', '/informer/faq', '/informer/chiffres', '/informer/complements', '/sources', '/militer', '/rejoindre', '/communique-de-presse'];
const staging = process.env.E2E_BASE_URL?.includes('chaufferie-cil-staging.saletesincere.fr') ?? false;

test('Golden Journey — Découvrir le site : robots annonce un sitemap des neuf pages publiques', async ({ request, page }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(`Sitemap: ${publicOrigin}/sitemap.xml`);
  expect(await robots.text()).toContain('Allow: /');
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/xml/);
  const document = await page.evaluate(xml => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    return { errors: doc.querySelectorAll('parsererror').length, urls: [...doc.querySelectorAll('url > loc')].map(node => node.textContent) };
  }, await response.text());
  expect(document.errors).toBe(0);
  expect(document.urls.sort()).toEqual(routes.map(path => new URL(path, publicOrigin).href).sort());
});

test('Golden Journey — Découvrir le site : pages canoniques accessibles sans interdiction d’indexation publique', async ({ request, page }) => {
  for (const route of routes) {
    const response = await request.get(route, { headers: { 'User-Agent': 'Googlebot' } });
    expect(response.status(), route).toBe(200);
    expect(/noindex/i.test(response.headers()['x-robots-tag'] ?? ''), route).toBe(staging);
    const parsed = await page.evaluate(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return { canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href'), robots: [...doc.querySelectorAll('meta[name="robots"]')].map(node => node.getAttribute('content')), text: doc.body.textContent };
    }, await response.text());
    expect(new URL(parsed.canonical!).href).toBe(new URL(route, publicOrigin).href);
    expect(parsed.robots.some(value => /noindex|nofollow/i.test(value ?? ''))).toBe(false);
    expect(parsed.text).not.toContain('Site non indexé');
  }
});

test('la préversion garde son en-tête noindex côté application', async ({ request }) => {
  test.skip(Boolean(process.env.E2E_BASE_URL), 'Le host de préversion est simulé sur le serveur local uniquement.');
  const response = await request.get('/informer', { headers: { Host: 'chaufferie-cil-staging.saletesincere.fr' } });
  expect(response.status()).toBe(200);
  expect(response.headers()['x-robots-tag']).toMatch(/noindex/);
});
