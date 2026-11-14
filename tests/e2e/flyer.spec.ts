import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';

test.describe('Golden Journey — Je milite : télécharger le tract', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  test('depuis l’accueil, télécharger le PDF original sur mobile sans JavaScript', async ({ page, request }, testInfo) => {
    const filename = 'tract-chaufferie-haubourdin.pdf';
    const documentPath = `/documents/${filename}`;

    await page.goto('/');
    await page.getByRole('link', { name: 'Faites savoir autour de vous', exact: true }).click();
    await expect(page).toHaveURL(/\/militer$/);

    const flyer = page.getByRole('region', { name: 'Le tract à votre fenêtre.', exact: true });
    await expect(flyer.getByRole('heading', { name: 'Le tract à votre fenêtre.', exact: true })).toBeVisible();
    const downloadLink = flyer.getByRole('link', { name: 'Télécharger le tract (PDF)', exact: true });
    await expect(downloadLink).toHaveAttribute('href', documentPath);
    await expect(downloadLink).toHaveAttribute('download', filename);

    const downloadPromise = page.waitForEvent('download');
    await downloadLink.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(filename);
    const downloadedPath = testInfo.outputPath(filename);
    await download.saveAs(downloadedPath);
    expect(await download.failure()).toBeNull();

    // Fetch the actual public resource independently; no PDF or browser API is mocked.
    const response = await request.get(documentPath);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/^application\/pdf(?:\s*;|$)/i);
    const servedBytes = await response.body();
    expect(servedBytes.subarray(0, 4).toString('ascii')).toBe('%PDF');
    expect(servedBytes.length).toBeGreaterThan(10_000);
    expect(createHash('sha256').update(servedBytes).digest('hex'))
      .toBe('0c374b0adc3ec9fc58851251df60a3dae849f06eef87380b9f5b6151d9a3b58f');
    expect((await readFile(downloadedPath)).equals(servedBytes)).toBe(true);

    await page.reload();
    await expect(downloadLink).toBeVisible();
    await expect(downloadLink).toHaveAttribute('href', documentPath);
  });
});
