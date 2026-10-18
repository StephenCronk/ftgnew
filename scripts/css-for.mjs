// Usage: node scripts/css-for.mjs reference/css/post-25.css f0aa12b ac502da ...
// Prints every rule in the Elementor page CSS that targets the given element ids (and media queries they sit in).
import { readFileSync } from 'node:fs';
const [file, ...ids] = process.argv.slice(2);
const css = readFileSync(file, 'utf8');
// split into top-level blocks, keeping @media wrappers
const out = [];
let i = 0, media = '';
while (i < css.length) {
  if (css.startsWith('@media', i)) { const b = css.indexOf('{', i); media = css.slice(i, b).trim(); i = b + 1; continue; }
  if (css[i] === '}') { media = ''; i++; continue; }
  const b = css.indexOf('{', i); if (b < 0) break;
  const e = css.indexOf('}', b);
  const sel = css.slice(i, b).trim(), body = css.slice(b + 1, e).trim();
  if (ids.some(id => sel.includes('elementor-element-' + id))) out.push((media ? media + ' ' : '') + sel + ' { ' + body + ' }');
  i = e + 1;
}
console.log(out.join('\n'));
