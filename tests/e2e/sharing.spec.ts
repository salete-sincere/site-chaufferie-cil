import { expect, test } from '@playwright/test';

const publicOrigin = 'https://stopchaufferiehaubourdin.fr';
const imagePath = '/partage-20261109.png';
const routes = ['/', '/informer', '/informer/faq', '/informer/chiffres', '/informer/complements',
  '/sources', '/militer', '/rejoindre', '/communique-de-presse'];
const crawlers = {
  Facebook: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  WhatsApp: 'WhatsApp/2.24.1',
  Signal: 'Signal/7.0',
  Telegram: 'TelegramBot (like TwitterBot)',
  Twitter: 'Twitterbot/1.0',
};

test.describe('Golden Journey — Je milite : aperçus de partage', () => {
  for (const [name, userAgent] of Object.entries(crawlers)) {
    test(`${name} reçoit les cartes des neuf pages dans le HTML sans JavaScript`, async ({ page, request }) => {
      let announcedImage = '';
      const titles = new Set<string>();
      for (const route of routes) {
        // The consumer only gets the HTTP document; no site script runs.
        const response = await request.get(route, { headers: { 'User-Agent': userAgent } });
        expect(response.status(), route).toBe(200);
        expect(response.headers()['content-type']).toMatch(/^text\/html/);
        const html = await response.text();
        const head = await page.evaluate((documentHtml) => {
          const parsed = new DOMParser().parseFromString(documentHtml, 'text/html');
          const meta = (attribute: 'property' | 'name', key: string) =>
            [...parsed.head.querySelectorAll(`meta[${attribute}="${key}"]`)].map(node => node.getAttribute('content'));
          return {
            canonical: [...parsed.head.querySelectorAll('link[rel="canonical"]')].map(node => node.getAttribute('href')),
            title: meta('property', 'og:title'), description: meta('property', 'og:description'),
            url: meta('property', 'og:url'), type: meta('property', 'og:type'),
            image: meta('property', 'og:image'), imageType: meta('property', 'og:image:type'),
            width: meta('property', 'og:image:width'), height: meta('property', 'og:image:height'),
            alt: meta('property', 'og:image:alt'), card: meta('name', 'twitter:card'),
            twitterTitle: meta('name', 'twitter:title'), twitterDescription: meta('name', 'twitter:description'),
            twitterImage: meta('name', 'twitter:image'), robots: meta('name', 'robots'),
          };
        }, html);
        const canonical = new URL(route, publicOrigin).href;
        // Next omits the root trailing slash; both forms identify the same URL.
        expect(head.canonical.map(value => value && new URL(value).href), route).toEqual([canonical]);
        expect(head.url.map(value => value && new URL(value).href), route).toEqual([canonical]);
        expect(head.type).toEqual(['website']);
        expect(head.title).toHaveLength(1);
        expect(head.title[0]).toContain('Haubourdin');
        expect(head.description).toHaveLength(1);
        expect(head.description[0]!.length).toBeGreaterThan(50);
        titles.add(head.title[0]!);
        expect(head.image).toEqual([`${publicOrigin}${imagePath}`]);
        expect(head.imageType).toEqual(['image/png']);
        expect(head.width).toEqual(['1200']);
        expect(head.height).toEqual(['630']);
        expect(head.alt).toHaveLength(1);
        expect(head.alt[0]).toContain('Haubourdin');
        expect(head.card).toEqual(['summary_large_image']);
        expect(head.twitterTitle).toEqual(head.title);
        expect(head.twitterDescription).toEqual(head.description);
        expect(head.twitterImage).toEqual(head.image);
        expect(head.robots[0]).toContain('noindex');
        announcedImage = head.image[0]!;
      }
      expect(titles.size).toBe(routes.length);
      // In CI, fetch the announced path from the production build under test.
      // On a live domain, follow the exact absolute URL advertised to messengers.
      const image = await request.get(process.env.E2E_BASE_URL ? announcedImage : new URL(announcedImage).pathname,
        { headers: { 'User-Agent': userAgent } });
      expect(image.status()).toBe(200);
      expect(image.headers()['content-type']).toMatch(/^image\/png/);
      const bytes = await image.body();
      expect(bytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      expect(bytes.readUInt32BE(16)).toBe(1200);
      expect(bytes.readUInt32BE(20)).toBe(630);
      expect(bytes.length).toBeLessThan(300_000);
    });
  }
});
