import sharp from 'sharp';
await sharp(new URL('../public/partage.svg', import.meta.url).pathname).png().toFile(new URL('../public/partage.png', import.meta.url).pathname);
console.log('Visuel de partage PNG préparé depuis la composition SVG locale.');
