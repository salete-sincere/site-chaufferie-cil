import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const recipient = 'haubourdin_alternative_citoyenne@riseup.net';
const facebookUrl = 'https://www.facebook.com/HaubourdinAlternativeCitoyenne';
const pressSourceUrl = 'https://docs.google.com/document/d/1PHJvxNW0oxgmq5ryXvIcbhpM9xZVpjjvby2sBQRTNt4/edit?tab=t.tl20vqm2xga5';
const pressTitle = 'HAC s’oppose à la chaufferie de la friche Lever';
const actionLabels = [
  'Réunions publiques',
  'Porte-à-porte',
  'Distribution de tracts',
  'Partage de contenus',
  'Recherche documentaire',
];

type BrowserEvidence = typeof window & {
  __copiedTexts: string[];
  __sharedLinks: ShareData[];
};

async function browserCapabilities(
  page: Page,
  clipboard: 'available' | 'denied' | 'missing' = 'available',
  share: 'available' | 'cancelled' | 'failed' | 'missing' = 'missing',
) {
  await page.addInitScript(({ clipboard, share }) => {
    const evidence = window as BrowserEvidence;
    evidence.__copiedTexts = [];
    evidence.__sharedLinks = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: clipboard === 'missing' ? undefined : {
        writeText: async (text: string) => {
          if (clipboard === 'denied') {
            throw new DOMException('Permission refusée', 'NotAllowedError');
          }
          evidence.__copiedTexts.push(text);
        },
      },
    });
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share === 'missing' ? undefined : async (data: ShareData) => {
        evidence.__sharedLinks.push(data);
        if (share === 'cancelled') throw new DOMException('Annulé', 'AbortError');
        if (share === 'failed') throw new DOMException('Indisponible', 'NotAllowedError');
      },
    });
  }, { clipboard, share });
}

function composeMail(href: string | null) {
  expect(href).toBeTruthy();
  const url = new URL(href!);
  expect(url.protocol).toBe('mailto:');
  expect(decodeURIComponent(url.pathname)).toBe(recipient);
  expect(url.searchParams.get('subject')).toBe('Comité chaufferie');
  return url.searchParams.get('body') ?? '';
}

test.describe('Golden Journey — Je m’informe', () => {
  test('publications d’HAC : communiqué, source et Facebook', async ({ page, context }) => {
    await page.goto('/');
    const publications = page.getByRole('navigation', { name: 'Publications d’HAC', exact: true });
    const homepageFacebook = publications.getByRole('link', { name: /^HAC sur Facebook(?: \(nouvel onglet\))?$/ });
    await expect(homepageFacebook).toHaveAttribute('href', facebookUrl);
    await expect(homepageFacebook).toHaveAttribute('target', '_blank');
    expect((await homepageFacebook.getAttribute('rel'))?.split(/\s+/)).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
    await publications.getByRole('link', { name: 'Lire le communiqué d’HAC', exact: true }).click();
    await expect(page).toHaveURL(/\/communique-de-presse$/);
    await expect(page.getByRole('heading', { level: 1, name: pressTitle, exact: true })).toBeVisible();
    await expect(page.getByText(/6 novembre 2026/).first()).toBeVisible();
    const statement = page.getByRole('article', { name: 'Texte du communiqué d’HAC', exact: true });
    await expect(statement.locator('p')).toHaveCount(9);
    await expect(statement.locator('p').first()).toContainText('Haubourdin Alternative Citoyenne s’oppose en l’état au projet de chaufferie biomasse');
    await expect(statement).toContainText('un maximum de 30 camions par jour en secours lorsque les péniches ne peuvent plus livrer le bois');
    await expect(statement.locator('p').last()).toContainText('par des moyens démocratiques, l’abandon de cette implantation');

    const sourceLink = page.locator(`main a[href="${pressSourceUrl}"]`);
    await expect(sourceLink).toBeVisible();
    await context.route(pressSourceUrl, (route) => route.fulfill({
      status: 200, contentType: 'text/html', body: '<h1>Document source simulé</h1>',
    }));
    if (await sourceLink.getAttribute('target') === '_blank') {
      const sourcePopupPromise = page.waitForEvent('popup');
      await sourceLink.click();
      const sourcePopup = await sourcePopupPromise;
      await expect(sourcePopup).toHaveURL(pressSourceUrl);
      await sourcePopup.close();
    } else {
      await sourceLink.click();
      await expect(page).toHaveURL(pressSourceUrl);
      await page.goto('/communique-de-presse');
    }

    const facebook = page.getByRole('contentinfo').getByRole('link', { name: /^HAC sur Facebook(?: \(nouvel onglet\))?$/ });
    await expect(facebook).toHaveAttribute('href', facebookUrl);
    await expect(facebook).toHaveAttribute('target', '_blank');
    expect((await facebook.getAttribute('rel'))?.split(/\s+/)).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
    // Verify the public page destination without visiting Facebook or interacting
    // with a social account. The same isolation applies to the Google source.
    await context.route(facebookUrl, (route) => route.fulfill({
      status: 200, contentType: 'text/html', body: '<h1>Page Facebook simulée</h1>',
    }));
    const facebookPopupPromise = page.waitForEvent('popup');
    await facebook.click();
    const facebookPopup = await facebookPopupPromise;
    await expect(facebookPopup).toHaveURL(facebookUrl);
    await facebookPopup.close();

    await page.goto('/militer');
    const activistPublications = page.getByRole('navigation', { name: 'Publications d’HAC', exact: true });
    await expect(activistPublications.getByRole('link', { name: 'Lire le communiqué d’HAC', exact: true }))
      .toHaveAttribute('href', '/communique-de-presse');
    const activistFacebook = activistPublications.getByRole('link', { name: /^HAC sur Facebook(?: \(nouvel onglet\))?$/ });
    await expect(activistFacebook).toHaveAttribute('href', facebookUrl);
    await expect(activistFacebook).toHaveAttribute('target', '_blank');
    expect((await activistFacebook.getAttribute('rel'))?.split(/\s+/)).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
  });

  test('accueil, dix points, FAQ, chiffres et référence', async ({ page, context }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Haubourdin Alternative Citoyenne/i).first()).toBeVisible();
    await page.getByRole('navigation').first().getByRole('link', { name: 'Je m’informe', exact: true }).click();
    await expect(page).toHaveURL(/\/informer$/);
    await expect(page.getByTestId('overview-point')).toHaveCount(10);

    await page.locator('a[href="/informer/faq"]').first().click();
    await expect(page.locator('main details')).toHaveCount(39);
    const question = page.locator('main details').first();
    await question.locator('summary').click();
    await expect(question).toHaveAttribute('open', '');
    await expect(question.locator('a[href^="/sources#"]').first()).toBeVisible();

    await page.goto('/informer/chiffres');
    await expect(page.getByTestId('figure')).toHaveCount(51);
    const reference = page.getByTestId('figure').first().locator('a[href^="/sources#"]').first();
    const href = await reference.getAttribute('href');
    await reference.click();
    await expect(page).toHaveURL(new RegExp(`${href!}$`));
    const sourceId = href!.split('#')[1];
    const source = page.locator(`[id="${sourceId}"]`);
    await expect(source).toBeVisible();
    const original = source.locator('a[href^="https://"], a[href^="http://"]').first();
    const originalUrl = await original.getAttribute('href');
    expect(originalUrl).toMatch(/^https?:\/\//);

    // Isolate the external publisher: validate the real destination, without
    // making the availability of a third-party site a test dependency.
    await context.route(originalUrl!, (route) => route.fulfill({
      status: 200, contentType: 'text/html', body: '<h1>Référence externe simulée</h1>',
    }));
    if (await original.getAttribute('target') === '_blank') {
      const popupPromise = page.waitForEvent('popup');
      await original.click();
      const popup = await popupPromise;
      await expect(popup).toHaveURL(originalUrl!);
      await popup.close();
    } else {
      await original.click();
      await expect(page).toHaveURL(originalUrl!);
    }
  });

  test('recherche, absence de résultat et filtre thématique', async ({ page }) => {
    await page.goto('/informer/faq');
    const questions = page.locator('main details:visible');
    const title = 'Qu’est-ce qui est prévu sur la friche Lever ?';
    await page.getByLabel('Rechercher une question', { exact: true }).fill(title);
    await expect(questions).toHaveCount(1);
    await page.getByLabel('Rechercher une question', { exact: true }).fill('zzzintrouvable987654');
    await expect(questions).toHaveCount(0);
    await expect(page.getByText(/aucun.*(?:résultat|question)/i)).toBeVisible();
    await page.getByLabel('Rechercher une question', { exact: true }).fill('');
    await expect(questions).toHaveCount(39);

    const select = page.getByRole('combobox', { name: 'Thème', exact: true });
    const options = await select.locator('option').evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLOptionElement).value));
    expect(options.length).toBeGreaterThan(1);
    await select.selectOption(options[1]);
    await expect.poll(() => questions.count()).toBeGreaterThan(0);
    expect(await questions.count()).toBeLessThan(39);
    await select.selectOption(options[0]);
    await expect(questions).toHaveCount(39);
  });

  test('lien direct vers une réponse dépliée et références complètes', async ({ page }) => {
    // Old shared links must remain meaningful after inserting new questions
    // within the thematic groups, including the former last question.
    for (const [id, title] of [
      ['faq-01', 'Qu’est-ce qui est prévu sur la friche Lever ?'],
      ['faq-34', 'Qui contacter en cas de nuisance ?'],
      ['faq-39', 'Des projets de chaufferie ont-ils été abandonnés près de Lyon ?'],
    ]) {
      await page.goto(`/informer/faq#${id}`);
      const question = page.locator(`[id="${id}"]`);
      await expect(question).toHaveAttribute('open', '');
      await expect(question.locator('summary')).toContainText(title);
      await expect(question.locator('summary')).toBeInViewport();
    }
    await page.goto('/sources');
    for (let number = 1; number <= 27; number += 1) {
      const source = page.locator(`[id="S${number}"]`);
      await expect(source).toBeVisible();
      await expect(source.locator('a[href^="http"]').first()).toBeVisible();
    }
  });

  test('Canopée et panorama : enquêtes attribuées, limites et décisions distinctes', async ({ page }) => {
    await page.goto('/informer/faq');
    const search = page.getByLabel('Rechercher une question', { exact: true });
    await search.fill('Canopée');
    const canopy = page.locator('#faq-37');
    await expect(page.locator('main details:visible')).toHaveCount(1);
    await expect(canopy).toBeVisible();
    await canopy.locator('summary').click();
    await expect(canopy).toContainText('Canopée décrit des coupes rases dans le Morvan');
    await expect(canopy).toContainText('Les associations et le fournisseur sont en désaccord');
    await expect(canopy).toContainText('Ce sont des enquêtes associatives à attribuer à leurs auteurs');
    await expect(canopy).toContainText('elles ne prouvent pas l’origine de son combustible');
    for (const source of ['S26', 'S27']) {
      await expect(canopy.locator(`a[href="/sources#${source}"]`).first()).toBeVisible();
    }

    await search.fill('La chaufferie fonctionnera-t-elle uniquement au bois, sans fioul ?');
    const fuel = page.locator('#faq-36');
    await expect(page.locator('main details:visible')).toHaveCount(1);
    await fuel.locator('summary').click();
    await expect(fuel).toContainText('du fioul est aussi prévu');
    await expect(fuel).toContainText('ne chiffrent pas sa consommation annuelle');
    await expect(fuel).toContainText('Cela ne signifie pas non plus qu’il prévoit un fonctionnement permanent au fioul');
    await expect(fuel.locator('a[href="/sources#S1"]').first()).toBeVisible();

    await page.goto('/informer');
    await expect(page.getByRole('heading', { name: 'Ailleurs en France', exact: true })).toBeVisible();
    const panorama = page.getByRole('navigation', { name: 'Panorama des projets et enquêtes en France', exact: true });
    for (const id of ['faq-35', 'faq-37', 'faq-38', 'faq-39']) {
      await expect(panorama.locator(`a[href="/informer/faq#${id}"]`)).toBeVisible();
    }
    await panorama.locator('a[href="/informer/faq#faq-35"]').click();
    await expect(page).toHaveURL(/\/informer\/faq#faq-35$/);
    const comparison = page.locator('#faq-35');
    await expect(comparison).toHaveAttribute('open', '');
    await expect(comparison).toContainText('Ce classement n’est pas établi');
    await expect(comparison).toContainText('63 MW utiles');
    await expect(comparison).toContainText('Ces périmètres ne se comparent pas par une simple division');
    for (const source of ['S18', 'S19', 'S20', 'S21', 'S22']) {
      await expect(comparison.locator(`a[href="/sources#${source}"]`).first()).toBeVisible();
    }

    await page.goto('/informer/faq#faq-38');
    const sully = page.locator('#faq-38');
    await expect(sully).toHaveAttribute('open', '');
    await expect(sully).toContainText('Nous n’avons pas identifié de source établissant un lien entre une coupe rase précise et l’approvisionnement de cette chaudière');
    await expect(sully).toContainText('Sully ne peut donc pas être présenté ici comme un cas établi de coupes rases pour le chauffage');

    await page.goto('/informer/faq#faq-39');
    const lyon = page.locator('#faq-39');
    await expect(lyon).toHaveAttribute('open', '');
    await expect(lyon).toContainText('renoncer à la grande chaufferie bois prévue');
    await expect(lyon).toContainText('avis défavorable de la commissaire enquêtrice');
    await expect(lyon).toContainText('le préfet a ensuite délivré l’autorisation environnementale, le 30 juillet 2026');
    await expect(lyon).toContainText('inexact de présenter Saint-Genis-Laval comme un projet bloqué par le préfet');
    for (const source of ['S23', 'S24', 'S25']) {
      await expect(lyon.locator(`a[href="/sources#${source}"]`).first()).toBeVisible();
    }
  });

  test('nouveaux repères : puissance utile, PCI et récupération des fumées', async ({ page }) => {
    await page.goto('/informer/chiffres');
    const lever = page.locator('#figure-01');
    await expect(lever).toContainText('63 MWth utiles');
    await expect(lever).toContainText('récupération de chaleur des fumées');
    await expect(lever.locator('a[href="/sources#S18"]')).toBeVisible();
    const inputPower = page.locator('#figure-49');
    await expect(inputPower).toContainText('60 MW PCI');
    await expect(inputPower).toContainText('À distinguer des 63 MW de chaleur utile');
    const usefulPower = page.locator('#figure-50');
    await expect(usefulPower).toContainText('51 MW utiles');
    await expect(usefulPower).toContainText('chaudières gaz/fioul');
    const recovery = page.locator('#figure-51');
    await expect(recovery).toContainText('9,6 MWth');
    await expect(recovery).toContainText('Ne pas additionner automatiquement ce chiffre aux 51 MW des chaudières');
    for (const [figureId, sourceId] of [
      ['figure-49', 'S18'], ['figure-50', 'S19'], ['figure-51', 'S20'],
    ]) {
      await page.goto(`/informer/chiffres#${figureId}`);
      await page.locator(`#${figureId} a[href="/sources#${sourceId}"]`).click();
      await expect(page).toHaveURL(new RegExp(`/sources#${sourceId}$`));
      await expect(page.locator(`#${sourceId}`)).toBeInViewport();
    }
    await page.goto('/informer/chiffres#figure-48');
    await expect(page.locator('#figure-48')).toBeInViewport();
    await expect(page.locator('#figure-48')).toContainText('2032');
    await expect(page.locator('#figure-48')).toContainText('Horizon annoncé pour le réseau ilénergie étendu');
  });
});

test.describe('Golden Journey — Je milite', () => {
  test('copier les trois textes et le lien quand le partage natif est absent', async ({ page }) => {
    await browserCapabilities(page);
    await page.goto('/militer');
    const buttons = page.getByRole('button', { name: 'Copier le texte', exact: true });
    await expect(buttons).toHaveCount(3);
    for (const button of await buttons.all()) await button.click();
    const copied = await page.evaluate(() => (window as BrowserEvidence).__copiedTexts);
    expect(copied).toHaveLength(3);
    expect(new Set(copied).size).toBe(3);
    expect(copied.join('\n')).toContain('39 questions et 51 repères');
    for (const message of copied) {
      expect(message.length).toBeGreaterThan(60);
      expect(message).toMatch(/https?:\/\/\S+/);
    }
    await page.getByRole('button', { name: 'Partager le lien', exact: true }).first().click();
    await page.getByRole('button', { name: 'Copier le lien', exact: true }).first().click();
    const copiedLink = await page.evaluate(() => (window as BrowserEvidence).__copiedTexts.at(-1));
    expect(copiedLink).toMatch(/^https?:\/\//);
    await expect(page.getByRole('heading', { name: 'Être informé par mail', exact: true })).toBeVisible();
    await expect(page.getByText('À venir', { exact: true })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveCount(0);
  });

  test('partager via les fonctions natives du navigateur', async ({ page }) => {
    await browserCapabilities(page, 'available', 'available');
    await page.goto('/militer');
    await page.getByRole('button', { name: 'Partager le lien', exact: true }).first().click();
    const shared = await page.evaluate(() => (window as BrowserEvidence).__sharedLinks);
    expect(shared).toHaveLength(1);
    expect(shared[0].url).toMatch(/^https?:\/\//);
    expect(await page.evaluate(() => (window as BrowserEvidence).__copiedTexts)).toEqual([]);
  });

  test('une annulation de partage ne produit pas une erreur', async ({ page }) => {
    await browserCapabilities(page, 'available', 'cancelled');
    await page.goto('/militer');
    await page.getByRole('button', { name: 'Partager le lien', exact: true }).first().click();
    await expect.poll(() => page.evaluate(() => (window as BrowserEvidence).__sharedLinks.length)).toBe(1);
    await expect(page.getByRole('alert').filter({ hasText: /\S/ })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Copier le lien', exact: true })).toHaveCount(0);
    await expect(page.getByText(/erreur|échec du partage/i)).toHaveCount(0);
  });

  test('un partage refusé permet de copier le lien', async ({ page }) => {
    await browserCapabilities(page, 'available', 'failed');
    await page.goto('/militer');
    await page.getByRole('button', { name: 'Partager le lien', exact: true }).first().click();
    await page.getByRole('button', { name: 'Copier le lien', exact: true }).first().click();
    await expect.poll(() => page.evaluate(() => (window as BrowserEvidence).__copiedTexts.length)).toBe(1);
  });

  for (const capability of ['denied', 'missing'] as const) {
    test(`presse-papiers ${capability} : repli vers un texte sélectionnable`, async ({ page }) => {
      await browserCapabilities(page, capability);
      await page.goto('/militer');
      await page.getByRole('button', { name: 'Copier le texte', exact: true }).first().click();
      const fallback = page.locator('textarea[readonly]:visible').first();
      await expect(fallback).toBeVisible();
      expect((await fallback.inputValue()).length).toBeGreaterThan(60);
      await expect(page.getByRole('status').filter({ hasText: /sélection|copi|presse-papiers/i }).first()).toBeVisible();
      expect(await page.evaluate(() => (window as BrowserEvidence).__copiedTexts)).toEqual([]);
    });
  }
});

test.describe('Golden Journey — Je rejoins le comité', () => {
  test('choix multiples, message accentué et courriel exact sans envoi', async ({ page }) => {
    await browserCapabilities(page);
    await page.goto('/rejoindre');
    await expect(page.getByText(recipient, { exact: true }).first()).toBeVisible();
    for (const label of actionLabels) await expect(page.getByRole('checkbox', { name: label, exact: true })).toBeVisible();
    await page.getByRole('checkbox', { name: actionLabels[0], exact: true }).check();
    await page.getByRole('checkbox', { name: actionLabels[1], exact: true }).check();
    const personalMessage = 'Bonjour, je suis intéressé·e !\nRéunion & tracts ? + 50 %';
    await page.getByRole('textbox', { name: 'Votre message (facultatif)', exact: true }).fill(personalMessage);
    const mailto = page.getByRole('link', { name: 'Préparer mon courriel', exact: true });
    const body = composeMail(await mailto.getAttribute('href'));
    expect(body).toContain(actionLabels[0]);
    expect(body).toContain(actionLabels[1]);
    expect(body).not.toContain(actionLabels[2]);
    expect(body).toContain(personalMessage);
    await expect(page.getByRole('textbox', { name: 'Courriel à copier', exact: true })).toHaveValue(body);
    await page.getByRole('button', { name: 'Copier le courriel', exact: true }).click();
    expect(await page.evaluate(() => (window as BrowserEvidence).__copiedTexts.at(-1))).toBe(body);

    await page.getByRole('checkbox', { name: actionLabels[0], exact: true }).uncheck();
    expect(composeMail(await mailto.getAttribute('href'))).not.toContain(actionLabels[0]);
    await expect(page.getByRole('status').filter({ hasText: /(?:courriel|message).*envoyé/i })).toHaveCount(0);
  });

  test('contact sans sélection et repli sans messagerie ni presse-papiers', async ({ page }) => {
    await browserCapabilities(page, 'denied');
    await page.goto('/rejoindre');
    await expect(page.locator('input[type="checkbox"]:checked')).toHaveCount(0);
    const body = composeMail(await page.getByRole('link', { name: 'Préparer mon courriel', exact: true }).getAttribute('href'));
    expect(body.length).toBeGreaterThan(10);
    // Do not invoke a real mail client. The visible address and message are the
    // accessible fallback even when the OS has no mailto handler configured.
    await expect(page.getByRole('textbox', { name: 'Courriel à copier', exact: true })).toHaveValue(body);
    await page.getByRole('button', { name: 'Copier le courriel', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Courriel à copier', exact: true })).toBeVisible();
    await expect(page.getByRole('status').filter({ hasText: /sélection|copi|presse-papiers/i }).first()).toBeVisible();
  });

  test('les choix restent locaux et ne persistent pas après rechargement', async ({ page, context }) => {
    await browserCapabilities(page);
    const writes: string[] = [];
    page.on('request', (request) => {
      if (!['GET', 'HEAD'].includes(request.method())) writes.push(`${request.method()} ${request.url()}`);
    });
    await page.goto('/rejoindre');
    await page.getByRole('checkbox', { name: actionLabels[0], exact: true }).check();
    await page.getByRole('textbox', { name: 'Votre message (facultatif)', exact: true }).fill('Message de test sans donnée personnelle');
    await page.getByRole('button', { name: 'Copier le courriel', exact: true }).click();
    expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })))
      .toEqual({ local: 0, session: 0 });
    expect(await context.cookies()).toEqual([]);
    expect(writes).toEqual([]);
    await page.reload();
    await expect(page.locator('input[type="checkbox"]:checked')).toHaveCount(0);
    await expect(page.getByRole('textbox', { name: 'Votre message (facultatif)', exact: true })).toHaveValue('');
  });
});

test.describe('Lecture essentielle sans JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('informations, accordéons natifs, chiffres, textes et contact accessibles', async ({ page }) => {
    await page.goto('/informer');
    await expect(page.getByTestId('overview-point')).toHaveCount(10);
    await page.goto('/informer/faq');
    await expect(page.getByText('La recherche nécessite JavaScript. Toutes les questions restent consultables ci-dessous.', { exact: true })).toBeVisible();
    await expect(page.locator('main details')).toHaveCount(39);
    await page.locator('main details').first().locator('summary').click();
    await expect(page.locator('main details').first()).toHaveAttribute('open', '');
    await page.locator('#faq-37 summary').click();
    await expect(page.locator('#faq-37')).toHaveAttribute('open', '');
    await expect(page.locator('#faq-37')).toContainText('elles ne prouvent pas l’origine de son combustible');
    await expect(page.locator('#faq-37 a[href="/sources#S27"]').first()).toBeVisible();
    await page.goto('/informer/chiffres');
    await expect(page.getByTestId('figure')).toHaveCount(51);
    await expect(page.locator('#figure-51')).toContainText('Ne pas additionner automatiquement ce chiffre aux 51 MW des chaudières');
    await page.goto('/militer');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect((await page.locator('main').innerText()).length).toBeGreaterThan(500);
    const pressResponse = await page.goto('/communique-de-presse');
    expect(await pressResponse!.text()).not.toContain('/cdn-cgi/l/email-protection');
    await expect(page.getByRole('heading', { level: 1, name: pressTitle, exact: true })).toBeVisible();
    const statement = page.getByRole('article', { name: 'Texte du communiqué d’HAC', exact: true });
    await expect(statement.locator('p')).toHaveCount(9);
    await expect(statement).toContainText('HAC appelle les habitants volontaires à se faire connaître pour constituer un comité d’intérêt local');
    const pressContact = page.locator('main').getByRole('link', { name: recipient, exact: true });
    await expect(pressContact).toBeVisible();
    composeMail(await pressContact.getAttribute('href'));
    const response = await page.goto('/rejoindre');
    expect(await response!.text()).not.toContain('/cdn-cgi/l/email-protection');
    await expect(page.getByText(recipient, { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('contentinfo').getByRole('link', { name: recipient, exact: true }))
      .toHaveAttribute('href', `mailto:${recipient}`);
    await expect(page.getByText(/La préparation automatique du message nécessite JavaScript\./)).toBeVisible();
    const mailto = page.getByRole('link', { name: 'Préparer mon courriel', exact: true });
    expect(composeMail(await mailto.getAttribute('href')).length).toBeGreaterThan(10);
  });
});

test.describe('Accessibilité et rendu', () => {
  test('navigation clavier : accès au contenu et ouverture d’une question', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const firstFocus = page.locator(':focus');
    await expect(firstFocus).toHaveAttribute('href', /^#/);
    await firstFocus.press('Enter');
    await expect(page.locator('main')).toBeInViewport();
    await page.goto('/informer/faq');
    const summary = page.locator('main details').first().locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('main details').first()).toHaveAttribute('open', '');
    await page.keyboard.press('Enter');
    await expect(page.locator('main details').first()).not.toHaveAttribute('open', '');
  });

  test('WCAG 2.1 AA : structure, champs et contrastes', async ({ page }) => {
    test.setTimeout(90_000);
    for (const route of ['/', '/informer', '/informer/faq', '/informer/chiffres', '/militer', '/rejoindre', '/sources', '/communique-de-presse']) {
      await page.goto(route);
      if (route === '/informer/faq') await page.locator('main summary').first().click();
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(result.violations, `Violations d’accessibilité sur ${route}`).toEqual([]);
    }
  });

  test('mobile : parcours lisibles sans débordement horizontal', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ['/', '/informer', '/informer/faq', '/informer/chiffres', '/sources', '/militer', '/communique-de-presse', '/rejoindre']) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
      const footer = page.getByRole('contentinfo');
      await expect(footer.getByRole('link', { name: 'Communiqué de presse', exact: true }))
        .toHaveAttribute('href', '/communique-de-presse');
      await expect(footer.getByRole('link', { name: /^HAC sur Facebook(?: \(nouvel onglet\))?$/ }))
        .toHaveAttribute('href', facebookUrl);
    }
    await page.getByRole('checkbox', { name: actionLabels[0], exact: true }).check();
    await expect(page.getByRole('checkbox', { name: actionLabels[0], exact: true })).toBeChecked();
    await page.screenshot({ path: testInfo.outputPath('rejoindre-mobile.png'), fullPage: true });
    await page.goto('/');
    await page.screenshot({ path: testInfo.outputPath('accueil-mobile.png'), fullPage: true });
    await page.goto('/militer');
    await page.screenshot({ path: testInfo.outputPath('militer-mobile.png'), fullPage: true });
    await page.goto('/communique-de-presse');
    await page.screenshot({ path: testInfo.outputPath('communique-mobile.png'), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');
    await page.screenshot({ path: testInfo.outputPath('accueil-desktop.png'), fullPage: true });
    await page.goto('/militer');
    await page.screenshot({ path: testInfo.outputPath('militer-desktop.png'), fullPage: true });
    await page.goto('/communique-de-presse');
    await page.screenshot({ path: testInfo.outputPath('communique-desktop.png'), fullPage: true });
    for (const [viewportName, viewport] of [
      ['desktop', { width: 1440, height: 1000 }],
      ['mobile', { width: 390, height: 844 }],
    ] as const) {
      await page.setViewportSize(viewport);
      await page.goto('/informer');
      await page.locator('#ailleurs-en-france').screenshot({ path: testInfo.outputPath(`panorama-${viewportName}.png`) });
      await page.goto('/informer/faq#faq-37');
      await expect(page.locator('#faq-37')).toHaveAttribute('open', '');
      await page.locator('#faq-37').screenshot({ path: testInfo.outputPath(`canopee-${viewportName}.png`) });
      await page.goto('/informer/chiffres');
      await page.locator('#theme-1').screenshot({ path: testInfo.outputPath(`puissances-${viewportName}.png`) });
    }
  });
});

test.describe('Exploitation du staging', () => {
  test('liveness et non-indexation des pages, ressources et erreurs', async ({ page, request }) => {
    const health = await request.get('/health');
    expect(health.status()).toBe(200);
    expect(health.headers()['content-type']).toMatch(/application\/json/);
    for (const route of ['/', '/informer/faq', '/rejoindre', '/communique-de-presse', '/favicon.svg', '/route-inexistante-e2e']) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(route === '/route-inexistante-e2e' ? 404 : 200);
      expect(response.headers()['x-robots-tag'], route).toMatch(/noindex/i);
    }
    await page.goto('/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const missing = await page.goto('/route-inexistante-e2e');
    expect(missing?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
  });
});
