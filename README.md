# Filling the Gap Dental Outreach — website

Static rebuild of [fillingthegap.ca](https://fillingthegap.ca) with [Eleventy](https://www.11ty.dev/). No WordPress, no page builder, no jQuery: plain HTML, one CSS layer, a few small vanilla-JS components.

## Develop

```bash
npm install
npm run dev        # http://localhost:8080, rebuilds on save
npm run build      # writes the site to _site/
```

Checks:

```bash
npm run audit           # build for the live domain and run every pre-ship check
npm run check:preview   # verify the deployed GitHub Pages preview
npm run check:live      # verify fillingthegap.ca after a Hostinger deploy
```

Claude Code users can run the whole change, check, preview and publish loop with the `/ftg-site` skill in `.claude/skills/ftg-site/`.

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
| `src/assets/video/` | Home hero video (muted H.264, 30 fps, faststart, under 2 MB). Re-encode a new clip with `ffmpeg -i in.mp4 -an -r 30 -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart out.mp4`. |
| `scripts/` | One-off tooling used during the port: `build-images.mjs` (originals → WebP), `extract-widgets.mjs`, `dump-content.mjs`, `css-for.mjs`, screenshot/compare helpers. |

Originals for images live in `src/assets/img-src/` (git-ignored). Drop a new original there and run `node scripts/build-images.mjs` to produce the WebP.

## Deploy

There are two environments.

- **Dev preview: GitHub Pages.** Every push to `main` runs `.github/workflows/pages.yml` and updates `https://stephencronk.github.io/ftgnew/`. The preview build sets `NOINDEX=1`, so every page carries a `noindex` tag and stays out of search engines.
- **Live site: Hostinger.** `.github/workflows/deploy-hostinger.yml` only runs when started by hand from the Actions tab. It builds for the root domain, adds `deploy/hostinger/.htaccess`, checks the build, and syncs `_site/` to `public_html/` over FTPS. It only uploads changed files and deletes files it previously uploaded that no longer exist.

The Hostinger workflow needs three repository secrets: `FTP_SERVER`, `FTP_USERNAME` and `FTP_PASSWORD`. The run option is:

- **Dry run** lists what would change without touching the server.

There is deliberately no clean-slate option. To empty the server, delete the contents of `public_html` in hPanel's File Manager, then run the workflow. Its last step checks that the homepage is really live.

DNS stays at Hostinger. Do not touch the MX records, which carry Google Workspace mail. After a deploy, purge the Hostinger CDN cache if the old content still shows.

## Phase 2

Known content issues inherited from the live site are listed in `IMPROVEMENTS.md`.
