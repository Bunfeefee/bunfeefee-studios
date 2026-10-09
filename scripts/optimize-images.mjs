import sharp from 'sharp';
import { copyFile, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = resolve(root, 'public', 'assets');
const images = [
  ['BunBeans.png', 'bun-beans'],
  ['Bunfeefee.png', 'bunfeefee'],
  ['Feetogo.png', 'fee-to-go'],
  ['Macaroon_fee.png', 'macaroon-fee'],
  ['St_Pattys2025.png', 'st-pattys-2025'],
  ['Cake_Stand.gif', 'cake-stand'],
];

await mkdir(output, { recursive: true });
for (const [source, name] of images) {
  const input = resolve(root, 'assets', source);
  const metadata = await sharp(input).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Missing image dimensions: ${source}`);
  }

  const width = Math.min(960, metadata.width);
  const destination = resolve(output, `${name}.webp`);
  const info = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 85, effort: 6 })
    .toFile(destination);
  const original = await stat(input);
  console.log(`${source}: ${original.size} -> ${info.size} bytes (${info.width} x ${info.height})`);
  if (info.size > 250_000) {
    throw new Error(`Web image exceeds 250 KB: ${destination}`);
  }
}

const cake = resolve(root, 'assets', 'Cake_Stand.gif');
const animation = await sharp(cake, { animated: true })
  .webp({ quality: 85, effort: 6 })
  .toFile(resolve(output, 'cake-stand-animated.webp'));
if (animation.size > 250_000) {
  throw new Error('Cake stand animation exceeds 250 KB');
}
console.log(`Cake stand animation: ${animation.size} bytes`);

const video = resolve(root, 'assets', 'Buncrossoint.mp4');
const videoSize = (await stat(video)).size;
if (videoSize > 5_000_000) {
  throw new Error('Bun Croissant video exceeds 5 MB');
}
await copyFile(video, resolve(output, 'bun-croissant.mp4'));
console.log(`Bun Croissant video: ${videoSize} bytes (original preserved)`);
