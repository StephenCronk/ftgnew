// One-time/occasional: converts originals in src/assets/img-src/ into optimised webp in src/assets/img/.
// Width caps keep the committed output small. Usage: node scripts/build-images.mjs [--force]
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';

const SRC = 'src/assets/img-src', OUT = 'src/assets/img';
const force = process.argv.includes('--force');
const caps = [
  [/^instagram\//, 640],
  [/^(before|after|image1|image2|20230516)/, 800],
  [/^(Amanda|Paul-Wismer|PHOTO-2024|Dr\.|volunteers)/, 700],
  [/^(FTG_2025v3_|CBC_Page_|mf_Page_|^[12]\.jpg$)/, 1000],
  [/^(FTGLogo|ftg-roundlogo|cropped-FTG|FTG-logo-blue)/, 800],
  [/./, 1440],
];
function cap(rel) { return caps.find(([re]) => re.test(rel))[1]; }

async function run(dir = '') {
  for (const name of readdirSync(join(SRC, dir))) {
    const rel = join(dir, name), full = join(SRC, rel);
    if (statSync(full).isDirectory()) { await run(rel); continue; }
    if (!/\.(jpe?g|png|webp|gif)$/i.test(name)) continue;
    const outRel = join(dir, parse(name).name + '.webp'), outFull = join(OUT, outRel);
    mkdirSync(join(OUT, dir), { recursive: true });
    if (existsSync(outFull) && !force) continue;
    try {
      const img = sharp(full, { animated: false });
      const meta = await img.metadata();
      const w = Math.min(meta.width || 9999, cap(rel));
      await img.resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(outFull);
      console.log(outRel, meta.width + '→' + w);
    } catch (e) { console.log('SKIP', rel, e.message); }
  }
}
await run();
