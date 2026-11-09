import sharp from 'sharp';
import { openSync } from 'fontkit';
import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const regular = openSync(require.resolve('@fontsource/open-sans/files/open-sans-latin-400-normal.woff'));
const bold = openSync(require.resolve('@fontsource/open-sans/files/open-sans-latin-800-normal.woff'));

function outline(text, x, y, size, fill, font = bold) {
  const run = font.layout(text);
  const scale = size / font.unitsPerEm;
  let cursor = x;
  return run.glyphs.map((glyph, index) => {
    const position = run.positions[index];
    const path = `<path fill="${fill}" transform="translate(${cursor + position.xOffset * scale},${y - position.yOffset * scale}) scale(${scale},${-scale})" d="${glyph.path.toSVG()}"/>`;
    cursor += position.xAdvance * scale;
    return path;
  }).join('');
}

// Large subject and slogan remain legible in messaging previews. Glyph outlines
// keep the exported asset independent of host fonts and external resources.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<title>Chaufferie à Haubourdin — Ici, on a notre mot à dire.</title>
<desc>Haubourdin Alternative Citoyenne, à l’initiative du comité d’intérêt local en cours de constitution.</desc>
<rect width="1200" height="630" fill="#4f6826"/>
<rect width="1200" height="145" fill="#f4b50e"/>
${outline('CHAUFFERIE À HAUBOURDIN',64,104,62,'#1f251b')}
${outline('ICI, ON A NOTRE',64,280,116,'#fff')}
${outline('MOT À DIRE.',64,430,130,'#f4b50e')}
<rect y="490" width="1200" height="140" fill="#fff"/>
${outline('Haubourdin Alternative Citoyenne',64,546,34,'#1f251b')}
${outline('À l’initiative du comité d’intérêt local en cours de constitution',64,589,24,'#1f251b',regular)}
</svg>`;
const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
// The dated URLs renew preview caches; the original URLs remain valid aliases.
for (const name of ['partage-20261109', 'partage']) {
  await writeFile(new URL(`../public/${name}.svg`, import.meta.url), svg + '\n');
  await writeFile(new URL(`../public/${name}.png`, import.meta.url), png);
}
console.log(`Cartes de partage SVG et PNG préparées : 1200 × 630, PNG ${(png.length / 1024).toFixed(1)} Ko.`);
