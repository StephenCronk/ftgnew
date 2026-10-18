#!/usr/bin/env node
// Check a deployed copy of the site: every page loads, every internal link/asset loads,
// and the noindex tag is present on the dev preview and absent on the live site.
// Usage: node scripts/check-deployed.mjs preview     (https://stephencronk.github.io/ftgnew)
//        node scripts/check-deployed.mjs live        (https://fillingthegap.ca)
//        node scripts/check-deployed.mjs <base-url>
const TARGETS = {
  preview: 'https://stephencronk.github.io/ftgnew',
  live: 'https://fillingthegap.ca',
};
const arg = process.argv[2] || 'preview';
const base = (TARGETS[arg] || arg).replace(/\/$/, '');
const origin = new URL(base).origin;
const expectNoindex = base.includes('github.io');

const PAGES = ['/', '/about/', '/elementor-1654/', '/volunteers/', '/patient-resources/', '/contact/',
  '/elementor-4058/', '/home/meet-our-team/', '/publication-1/', '/publication-2/', '/publication-3/', '/publication-4/'];

const bust = (u) => u + (u.includes('?') ? '&' : '?') + 'check=' + Date.now();
const status = async (u) => {
  try { const r = await fetch(bust(u), { redirect: 'follow' }); return r.status; } catch (e) { return 'ERR ' + e.message; }
};

const bad = [];
const assets = new Set();
for (const p of PAGES) {
  const url = base + p;
  let res;
  try { res = await fetch(bust(url), { redirect: 'follow' }); } catch (e) { bad.push(`${p}: ${e.message}`); continue; }
  if (res.status !== 200) { bad.push(`${p}: HTTP ${res.status}`); continue; }
  const html = await res.text();
  const hasNoindex = /name="robots" content="noindex/.test(html);
  if (expectNoindex && !hasNoindex) bad.push(`${p}: missing noindex tag on the preview`);
  if (!expectNoindex && hasNoindex) bad.push(`${p}: noindex tag on the live site`);
  if (/casino/i.test(html)) bad.push(`${p}: contains spam text`);
  if (!/<title>[^<]*FillingTheGapDentalOutreach<\/title>/.test(html)) bad.push(`${p}: unexpected page (old WordPress still cached?)`);
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#]*)/g)) if (!m[1].startsWith('//')) assets.add(origin + m[1]);
}
const list = [...assets];
for (let i = 0; i < list.length; i += 12) {
  const chunk = list.slice(i, i + 12);
  const codes = await Promise.all(chunk.map(status));
  chunk.forEach((u, j) => { if (codes[j] !== 200) bad.push(`${u.replace(origin, '')}: ${codes[j]}`); });
}
console.log(`${base}: ${PAGES.length} pages, ${list.length} internal links and assets checked.`);
if (!bad.length) { console.log('Everything loads.'); process.exit(0); }
console.log('Problems:');
for (const b of bad) console.log('  ' + b);
process.exit(1);
