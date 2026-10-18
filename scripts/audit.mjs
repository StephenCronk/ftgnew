#!/usr/bin/env node
// Build the site for the root domain and run every pre-ship check.
// Usage: node scripts/audit.mjs        (exit code 1 if anything fails)
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync, statSync, rmSync } from 'node:fs';
import { join, dirname, resolve, relative, extname, basename } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const site = join(root, '_site');
const problems = [];
const fail = (title, items) => { if (items.length) problems.push({ title, items }); };

const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

rmSync(site, { recursive: true, force: true });
try {
  execSync('npx eleventy --quiet', { cwd: root, stdio: 'pipe', env: { ...process.env, PATH_PREFIX: '/', NOINDEX: '' } });
} catch (e) {
  console.error('BUILD FAILED\n' + (e.stderr || e.stdout || e.message));
  process.exit(1);
}

const files = walk(site);
const html = files.filter((f) => f.endsWith('.html'));
const css = files.filter((f) => f.endsWith('.css'));
const pageOf = (f) => '/' + relative(site, f).replace(/index\.html$/, '');

// 1. No WordPress / Elementor / Astra / Instagram-plugin markup. The two legacy slugs are allowed.
const LEGACY = new Set(['elementor-1654', 'elementor-4058']);
const wp = [];
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(/elementor[-a-z0-9]*|astra|wp-content|wp-block|sbi_/g)) {
    if (!LEGACY.has(m[0])) wp.push(`${pageOf(f)}: ${m[0]}`);
  }
}
fail('WordPress markup in output', [...new Set(wp)]);

// 2. No injected spam text from the old WordPress site.
fail('Spam text in output', html.filter((f) => /casino/i.test(readFileSync(f, 'utf8'))).map(pageOf));

// 3. The live build must not carry the dev prefix or the dev noindex tag.
fail('Dev path prefix in live build', html.filter((f) => readFileSync(f, 'utf8').includes('/ftgnew/')).map(pageOf));
fail('noindex tag in live build', html.filter((f) => /name="robots" content="noindex/.test(readFileSync(f, 'utf8'))).map(pageOf));

// 4. Every internal href/src resolves to a file in _site.
const exists = (urlPath) => {
  const p = join(site, decodeURIComponent(urlPath));
  return existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html')))
    || existsSync(join(p.replace(/\/$/, ''), 'index.html'));
};
const broken = [];
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    if (m[1].startsWith('//')) continue;
    if (!exists(m[1])) broken.push(`${pageOf(f)} -> ${m[1]}`);
  }
  for (const m of s.matchAll(/url\(['"]?(\/[^'")]+)/g)) {
    if (!exists(m[1])) broken.push(`${pageOf(f)} -> ${m[1]} (inline style)`);
  }
}
for (const f of css) {
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(/url\(['"]?([^'")]+)/g)) {
    const u = m[1];
    if (/^(data:|https?:|#)/.test(u)) continue;
    if (u.startsWith('/')) { broken.push(`${relative(site, f)} uses root path ${u} (breaks under the dev prefix; use a relative path)`); continue; }
    if (!existsSync(resolve(dirname(f), u))) broken.push(`${relative(site, f)} -> ${u}`);
  }
}
fail('Broken internal links or assets', [...new Set(broken)]);

// 5. Every image in src/assets/img is referenced somewhere (keeps the repo lean).
const srcFiles = walk(join(root, 'src')).filter((f) => /\.(njk|json|css|js|md|html)$/.test(f));
const corpus = srcFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
const imgDir = join(root, 'src/assets/img');
const unused = walk(imgDir)
  .filter((f) => ['.webp', '.jpg', '.jpeg', '.png', '.svg', '.gif'].includes(extname(f).toLowerCase()))
  .filter((f) => !corpus.includes(basename(f, extname(f))))
  .map((f) => relative(root, f));
fail('Images in src/assets/img that nothing references', unused);

// 6. Size guard: flag any single image over 400 KB.
const big = walk(join(site, 'assets')).filter((f) => statSync(f).size > 400 * 1024)
  .map((f) => `${relative(site, f)} (${Math.round(statSync(f).size / 1024)} KB)`);
fail('Images over 400 KB (resize with scripts/build-images.mjs)', big);

const total = files.reduce((n, f) => n + statSync(f).size, 0);
console.log(`Built ${html.length} pages, ${files.length} files, ${(total / 1048576).toFixed(1)} MB.`);
if (!problems.length) { console.log('All checks passed.'); process.exit(0); }
for (const p of problems) {
  console.log(`\nFAIL: ${p.title} (${p.items.length})`);
  for (const i of p.items.slice(0, 40)) console.log('  ' + i);
  if (p.items.length > 40) console.log(`  ...and ${p.items.length - 40} more`);
}
process.exit(1);
