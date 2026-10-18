export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets/img': 'assets/img' });
  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' });
  eleventyConfig.addPassthroughCopy({ 'src/js': 'js' });
  eleventyConfig.addPassthroughCopy({ 'src/static': '/' });
  eleventyConfig.addWatchTarget('src/css');
  eleventyConfig.addWatchTarget('src/js');

  // Ordered footer nav differs from header nav; both come from _data/nav.json.
  eleventyConfig.addFilter('isActive', (href, pageUrl) => href === pageUrl);

  // Prefix root-relative href/src inside stored HTML fragments with the path prefix (GitHub Pages project URLs).
  const prefix = (process.env.PATH_PREFIX || '/').replace(/\/$/, '');
  eleventyConfig.addFilter('html', (str) => prefix ? String(str).replace(/(href|src)="\/(?!\/)/g, `$1="${prefix}/`) : str);

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    pathPrefix: process.env.PATH_PREFIX || '/',
    templateFormats: ['njk', 'md', 'html'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
}
