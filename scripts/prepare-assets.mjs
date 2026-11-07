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

// Glyph outlines make the exported asset independent of host font libraries.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><title>À Haubourdin, on a notre mot à dire.</title><rect width="1200" height="630" fill="#4f6826"/><path d="M60 95h1080" stroke="#a0b281"/>${outline('COMITÉ CHAUFFERIE · HAUBOURDIN',60,65,23,'#fff')}${outline('ICI, ON A',60,230,100,'#fff')}${outline('NOTRE MOT',60,340,100,'#fff')}${outline('À DIRE.',60,450,100,'#f4b50e')}${outline('Une initiative d’Haubourdin Alternative Citoyenne',60,570,25,'#fff',regular)}</svg>`;
await writeFile(new URL('../public/partage.svg', import.meta.url), svg + '\n');
await sharp(Buffer.from(svg)).png().toFile(new URL('../public/partage.png', import.meta.url).pathname);
console.log('Visuels SVG et PNG préparés avec les contours Open Sans locaux.');
