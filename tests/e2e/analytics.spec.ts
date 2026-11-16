import { expect, test } from '@playwright/test';

const scriptUrl = 'https://static.cloudflareinsights.com/beacon.min.js';
const token = process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN;

test('mesure d’audience désactivée sans token', async ({ page }) => {
  test.skip(Boolean(token), 'Qualification du build sans token uniquement.');
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('cloudflareinsights.com')) requests.push(request.url());
  });
  const response = await page.goto('/');
  await expect(page.locator('script[data-cf-beacon]')).toHaveCount(0);
  await expect(page.getByText('Aucun traceur', { exact: false })).toBeVisible();
  expect(response?.headers()['content-security-policy']).not.toContain('cloudflareinsights.com');
  expect(requests).toEqual([]);
});

test('balise unique sans opt-in, CSP et navigation client', async ({ page, context }) => {
  test.skip(!token, 'Qualification du build avec token uniquement.');
  let scriptLoads = 0;
  const reports: string[] = [];
  await context.route(scriptUrl, (route) => {
    scriptLoads++;
    return route.fulfill({
      contentType: 'application/javascript',
      // Simulate the integration, never send qualification data to Cloudflare.
      body: "navigator.sendBeacon('https://cloudflareinsights.com/cdn-cgi/rum', 'integration-test');",
    });
  });
  await context.route('https://cloudflareinsights.com/**', (route) => {
    reports.push(route.request().postData() ?? '');
    return route.fulfill({ status: 204 });
  });
  const response = await page.goto('/');
  await expect(page.locator('script[data-cf-beacon]')).toHaveCount(1);
  await expect(page.locator('script[data-cf-beacon]')).toHaveAttribute('data-cf-beacon', JSON.stringify({ token }));
  await expect.poll(() => reports.length).toBe(1);
  expect(response?.headers()['content-security-policy']).toContain(`script-src 'self' 'unsafe-inline' ${scriptUrl};`);
  expect(response?.headers()['content-security-policy']).toContain("connect-src 'self' https://cloudflareinsights.com;");
  await expect(page.getByText('Mesure d’audience Cloudflare sans cookies', { exact: false })).toBeVisible();
  await expect(page.getByText('Aucun traceur', { exact: false })).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Navigation principale', exact: true }).getByRole('link', { name: 'Je m’informe', exact: true }).click();
  await expect(page).toHaveURL(/\/informer$/);
  await expect(page.locator('script[data-cf-beacon]')).toHaveCount(1);
  expect(scriptLoads).toBe(1);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await page.reload();
  await expect.poll(() => scriptLoads).toBe(2);
  await expect.poll(() => reports.length).toBe(2);
});

test('le blocage de la balise préserve le parcours de contact', async ({ page, context }) => {
  test.skip(!token, 'Qualification du build avec token uniquement.');
  await context.route('https://*.cloudflareinsights.com/**', (route) => route.abort('blockedbyclient'));
  await page.goto('/rejoindre');
  await page.getByRole('checkbox', { name: 'Réunions publiques', exact: true }).check();
  await page.getByRole('textbox', { name: 'Votre message (facultatif)', exact: true }).fill('Test de repli');
  const mailto = await page.getByRole('link', { name: 'Préparer mon courriel', exact: true }).getAttribute('href');
  expect(new URL(mailto!).searchParams.get('body')).toContain('Test de repli');
  await page.reload();
  await expect(page.locator('input[type="checkbox"]:checked')).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Votre message (facultatif)', exact: true })).toHaveValue('');
});
