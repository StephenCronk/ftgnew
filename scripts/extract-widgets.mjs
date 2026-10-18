// Extracts repeated Elementor widgets (toggles/accordions, tabs, testimonial carousels, counters, icon lists)
// from every saved page into src/_data/widgets.json keyed by element id. Image URLs are rewritten to local webp.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import * as cheerio from 'cheerio';

const out = {};
const missing = new Set();
function localImg(src) {
  if (!src) return src;
  if (/^https?:\/\/fillingthegap\.ca\/wp-content\/uploads\//.test(src)) {
    let base = src.split('/').pop().split('?')[0].replace(/-\d+x\d+(?=\.[a-z]+$)/i, '');
    if (/-scaled\.[a-z]+$/i.test(base) && existsSync('src/assets/img/' + base.replace(/-scaled\.[a-z]+$/i, '.webp'))) base = base.replace(/-scaled(?=\.[a-z]+$)/i, '');
    const webp = base.replace(/\.(jpe?g|png|webp|gif)$/i, '.webp');
    if (!existsSync('src/assets/img/' + webp)) missing.add(src);
    return '/assets/img/' + webp;
  }
  return src;
}
function clean($, root) {
  root.find('img').each((_, im) => { $(im).attr('src', localImg($(im).attr('src'))); ['srcset','sizes','loading','decoding','fetchpriority','class','width','height','style','data-cy'].forEach(a => $(im).removeAttr(a)); });
  root.find('*').each((_, el) => { ['style','class','id','dir','lang','data-cy'].forEach(a => $(el).removeAttr(a)); });
  root.find('a[href]').each((_, a) => { const h = $(a).attr('href'); if (/^https?:\/\/(www\.)?fillingthegap\.ca(\/|$)/.test(h)) $(a).attr('href', h.replace(/^https?:\/\/(www\.)?fillingthegap\.ca\/?/, '/')); });
  root.find('span').each((_, s) => { if (!$(s).attr('href')) $(s).replaceWith($(s).html()); });
  root.find('p').each((_, p) => { if (!$(p).text().trim() && !$(p).find('img').length) $(p).remove(); });
  return root.html().trim().replace(/\s+/g, ' ');
}
function text($, el) { return $(el).text().replace(/\s+/g, ' ').trim(); }

for (const f of readdirSync('reference/html')) {
  const page = f.replace('.html', '');
  const $ = cheerio.load(readFileSync('reference/html/' + f, 'utf8'));
  $('.elementor-widget').each((_, el) => {
    const cls = $(el).attr('class') || '';
    const type = (cls.match(/elementor-widget-([\w-]+)/) || [])[1];
    const id = (cls.match(/elementor-element-(\w+)/) || [])[1];
    const key = page + ':' + id;
    if (type === 'toggle' || type === 'accordion') {
      out[key] = { type, items: $(el).find('.elementor-toggle-item, .elementor-accordion-item').map((_, it) => ({
        title: text($, $(it).find('.elementor-toggle-title, .elementor-accordion-title').first()),
        html: clean($, $(it).find('.elementor-tab-content').first()),
      })).get() };
    } else if (type === 'tabs') {
      const titles = $(el).find('.elementor-tab-desktop-title').map((_, t) => $(t).html().trim()).get();
      const panels = $(el).find('.elementor-tab-content').map((_, c) => clean($, $(c))).get();
      out[key] = { type, items: titles.map((t, i) => ({ title: t, html: panels[i] })) };
    } else if (type === 'wpr-testimonial') {
      out[key] = { type, items: $(el).find('.wpr-testimonial-item').map((_, it) => ({
        name: text($, $(it).find('.wpr-testimonial-name')),
        job: text($, $(it).find('.wpr-testimonial-job')),
        title: text($, $(it).find('.wpr-testimonial-title')),
        rating: $(it).find('.wpr-rating-icon-full').length,
        html: clean($, $(it).find('.wpr-testimonial-content').first()),
        image: localImg($(it).find('.wpr-testimonial-image img').attr('src')),
      })).get(), hidden: /elementor-hidden-desktop/.test(cls) };
    } else if (type === 'shortcode' && $(el).find('.wpsm_counterbox').length) {
      out[key] = { type: 'counters', items: $(el).find('.wpsm_counterbox').map((_, b) => ({ n: text($, $(b).find('.counter')), label: text($, $(b).find('.wpsm_count-title')) })).get() };
    } else if (type === 'icon-list') {
      out[key] = { type, items: $(el).find('.elementor-icon-list-item').map((_, li) => ({ icon: $(li).find('i').attr('class') || '', html: clean($, $(li).find('.elementor-icon-list-text')) })).get() };
    } else if (type === 'eael-adv-accordion' || type === 'nested-accordion' || type === 'n-accordion') {
      out[key] = { type, items: $(el).find('.eael-accordion-list, details').map((_, it) => ({
        title: text($, $(it).find('.eael-accordion-tab-title, summary').first()),
        html: clean($, $(it).find('.eael-accordion-content, .e-n-accordion-item-title + div').first()),
      })).get() };
    }
  });
}
writeFileSync('src/_data/widgets.json', JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, 'widgets');
console.log('missing images:', [...missing].join('\n'));
