// Usage: node scripts/dump-content.mjs reference/html/about.html
// Prints a simplified, ordered outline of the Elementor page content:
// sections/containers (with their element ids so styles can be looked up in reference/css),
// and each widget's type, headings, text, links and images.
import { readFileSync } from 'node:fs';
import * as cheerio from 'cheerio';

const file = process.argv[2];
const $ = cheerio.load(readFileSync(file, 'utf8'));
const root = $('.entry-content').first().length ? $('.entry-content').first() : $('main').first();

const SPAM = /casino|bonanza|no depo|free spins|jackpot|22bet|taya777|1win|qbets|whitelotus|givingcity|mhcoffee|essionslive/i;

function txt(el) { return $(el).text().replace(/\s+/g, ' ').trim(); }

function walk(el, depth) {
  const node = $(el);
  const cls = node.attr('class') || '';
  const pad = '  '.repeat(depth);
  if (/\belementor-widget\b/.test(cls)) {
    const type = (cls.match(/elementor-widget-([\w-]+)/) || [])[1];
    const id = (cls.match(/elementor-element-(\w+)/) || [])[1];
    const hidden = /elementor-hidden-desktop/.test(cls) ? ' [HIDDEN-DESKTOP]' : '';
    const t = txt(node);
    if (SPAM.test(t)) { console.log(`${pad}!! SPAM widget ${type} #${id} skipped`); return; }
    console.log(`${pad}- ${type} #${id}${hidden}`);
    node.find('h1,h2,h3,h4,h5,h6').each((_, h) => console.log(`${pad}    <${h.tagName}> ${txt(h)}`));
    node.find('p,li').each((_, p) => { const s = txt(p); if (s) console.log(`${pad}    ${p.tagName}: ${s}`); });
    node.find('a[href]').each((_, a) => console.log(`${pad}    a: "${txt(a) || '(img)'}" -> ${$(a).attr('href')}`));
    node.find('img').each((_, i) => console.log(`${pad}    img: ${($(i).attr('src')||'').replace('https://fillingthegap.ca/wp-content/uploads/','')} alt="${$(i).attr('alt')||''}"`));
    node.find('iframe').each((_, i) => console.log(`${pad}    iframe: ${$(i).attr('src')}`));
    const ds = node.attr('data-settings'); if (ds && /youtube|video/i.test(ds)) console.log(`${pad}    settings: ${ds}`);
    if (['heading','text-editor','button','image','video','icon-list','icon-box','image-box','spacer','divider','counter','testimonial','accordion','toggle','tabs','nested-tabs','nested-accordion','shortcode','html','social-icons','icon','image-carousel','bdt-slider','eael-adv-accordion'].includes(type)) return;
    // unknown widget: show a bit of inner structure
    node.children().each((_, c) => walk(c, depth + 1));
    return;
  }
  if (/\b(e-con|elementor-section|elementor-column|elementor-container|elementor-widget-wrap|e-con-inner|elementor-row)\b/.test(cls)) {
    const id = (cls.match(/elementor-element-(\w+)/) || [])[1];
    const kind = /e-con/.test(cls) ? 'con' : /elementor-section/.test(cls) ? 'section' : /elementor-column/.test(cls) ? 'column' : null;
    const hidden = /elementor-hidden-desktop/.test(cls) ? ' [HIDDEN-DESKTOP]' : '';
    if (kind && id) console.log(`${pad}${kind} #${id}${hidden}${node.attr('id') && !/^post-/.test(node.attr('id')) ? ' anchor=' + node.attr('id') : ''}`);
    node.children().each((_, c) => walk(c, kind && id ? depth + 1 : depth));
    return;
  }
  node.children().each((_, c) => walk(c, depth));
}
walk(root, 0);
