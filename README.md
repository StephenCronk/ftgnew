# Filling the Gap Dental Outreach — website

Static rebuild of [fillingthegap.ca](https://fillingthegap.ca) with [Eleventy](https://www.11ty.dev/). No WordPress, no page builder, no jQuery: plain HTML, one CSS layer, a few small vanilla-JS components.

## Develop

```bash
npm install
npm run dev        # http://localhost:8080, rebuilds on save
npm run build      # writes the site to _site/
```

## Layout

| Path | What |
|---|---|
| `src/pages/*.njk` | One template per page. `permalink` keeps the original WordPress slugs. |
| `src/_includes/layouts/base.njk` | `<head>`, header, footer, cookie bar. |
| `src/_includes/partials/` | Reusable pieces: before/after slider, carousel, toggle, accordion, counters, icons. |
| `src/_data/*.json` | Content that repeats or is long: nav, locations, news tabs, Instagram posts, testimonials/accordions (`widgets.json`), publications, privacy text. |
| `src/css/` | `tokens.css` (colours/fonts), `base.css`, `header.css`, `footer.css`, `components.css`, `pages/<page>.css`. |
| `src/js/` | `main.js` (menu, cookie bar), `components.js` (sliders, tabs, accordions, carousels, counters, lazy YouTube), `pages/home.js`. |
| `src/assets/img/` | Optimised WebP images actually used by the pages (≈6.6 MB total, down from 35 MB). |
| `scripts/` | One-off tooling used during the port: `build-images.mjs` (originals → WebP), `extract-widgets.mjs`, `dump-content.mjs`, `css-for.mjs`, screenshot/compare helpers. |

Originals for images live in `src/assets/img-src/` (git-ignored). Drop a new original there and run `node scripts/build-images.mjs` to produce the WebP.

## Deploy

Pushing to `main` runs `.github/workflows/pages.yml`, which builds the site and deploys it to GitHub Pages. Set the repository's Pages source to **GitHub Actions**. The workflow passes the correct `PATH_PREFIX` automatically, so the same build works at `https://<user>.github.io/ftgnew/` and at a custom domain.

To go live on `fillingthegap.ca`: add a `CNAME` file containing `fillingthegap.ca` to `src/static/`, set the custom domain in the repo's Pages settings, and point the domain's A/AAAA records at GitHub Pages. Leave the MX records alone (Google Workspace mail).

## Phase 2

Known content issues inherited from the live site are listed in `IMPROVEMENTS.md`.
