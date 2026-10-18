---
name: ftg-site
description: Change, check, preview and publish the Filling the Gap Dental Outreach website (fillingthegap.ca, this ftgnew repo). Use for any edit to its pages, copy, images, styles or footer, and whenever the user asks to preview, push, deploy, publish or "put live" the site.
---

# Filling the Gap site: change, check, preview, publish

The site is a static Eleventy build. The dev preview is GitHub Pages (`https://stephencronk.github.io/ftgnew/`), which updates on every push to `main`. The live site is fillingthegap.ca on Hostinger, which updates only when the "Deploy to Hostinger (live site)" workflow is run.

```
edit  ->  npm run audit  ->  screenshots  ->  commit + push  ->  npm run check:preview
      ->  (only when the user asks)  deploy to Hostinger  ->  npm run check:live
```

## Ground rules

- Change only what the user asked for. Log anything else you notice in `IMPROVEMENTS.md` under its existing sections, and add each finished request to the "Done" section with the month.
- Keep the original URLs: `/elementor-1654/` is Support Our Work, `/elementor-4058/` is Privacy, `/patient-resources/` is Services & Eligibility, plus `/home/meet-our-team/` and `/publication-1/` to `/publication-4/`.
- No WordPress, Elementor or Astra class names, no jQuery, and no third-party embeds or feed scripts. Google Fonts, YouTube (nocookie, click to load), Google Maps iframes and the PayPal form are the only external pieces.
- Never touch DNS. The domain is registered at GoDaddy, DNS is at Hostinger, and the MX records carry the charity's Google Workspace email.
- Never print, log or ask for the FTP password. It lives only in the `FTP_PASSWORD` GitHub secret.
- Never publish to Hostinger unless the user asked for it in this conversation. Pushing to `main` only updates the preview, so it is safe.

## Where things live

| What | Where |
|---|---|
| Page templates, one per URL | `src/pages/*.njk` (home is `index.njk`, Support Our Work is `support.njk`, Services is `services.njk`) |
| Header, footer, cookie bar, reusable blocks | `src/_includes/partials/` |
| Page shell, fonts, CSS and JS includes | `src/_includes/layouts/base.njk` |
| Footer clinic details | `src/_data/locations.json` |
| Nav menus | `src/_data/nav.json` |
| Home "Featured news" tabs | `src/_data/news.json` |
| Testimonials, accordions, About publications tabs, counters | `src/_data/widgets.json` (keys are `page:id`; keep its one-space indent and no trailing newline when rewriting) |
| Styles | `src/css/` shared files, plus `src/css/pages/<page>.css` |
| Scripts | `src/js/main.js` (menu, cookie bar), `src/js/components.js` (sliders, tabs, accordions, carousels, counters, video) |

Text stored in JSON as HTML must be output with `| html | safe`, which adds the dev-site path prefix to links and images. CSS background images must use relative paths such as `url('../../assets/img/x.webp')`, never `/assets/...`. In templates, wrap root paths with `| url`.

## 1. Make the change

- **New image.** Put the original in `src/assets/img-src/` (git-ignored) named as you want it published, run `npm run images`, then reference `/assets/img/<name>.webp`. Delete any image a change leaves unused.
- **Copy from a news article.** Summarise in your own words rather than pasting the article, and keep the outlet, date and a "Read more…" link to the source.

## 2. Audit

```bash
npm run audit
```

This builds for the live domain and fails on WordPress markup, spam text, broken internal links or CSS images, dev-only output in the live build, unreferenced images, and images over 400 KB. Fix everything it reports before moving on.

## 3. Look at it

Serve the build and screenshot the pages you touched, at desktop width and at phone width:

```bash
/usr/bin/python3 -m http.server 8099 --directory _site &      # stop it when done
scripts/shot.sh http://localhost:8099/<path>/ <scratchpad>/desk.png 1440 6000
scripts/shot-mobile.sh /<path>/ <scratchpad>/phone.png
```

Then Read the PNGs and check them. `shot-mobile.sh` renders at a true 390px through an iframe, because headless Chrome will not open a window narrower than 500px. Crop tall screenshots with `/usr/bin/python3` and PIL before reading them. The pyenv `python3` lacks PIL.

## 4. Commit and push to the preview

Commit with a message that lists each user-visible change, then `git push origin main`. Wait for the preview deploy and check it:

```bash
gh run watch "$(gh run list --workflow pages.yml --limit 1 --json databaseId -q '.[0].databaseId')" --exit-status
npm run check:preview
```

Tell the user what changed and give them `https://stephencronk.github.io/ftgnew/` to review.

## 5. Publish to the live site (only when asked)

```bash
gh workflow run deploy-hostinger.yml -f dry_run=false -f clean_slate=false
gh run watch "$(gh run list --workflow deploy-hostinger.yml --limit 1 --json databaseId -q '.[0].databaseId')" --exit-status
npm run check:live
```

- Use `-f dry_run=true` first if you are unsure what will change. The log lists every upload and deletion.
- Never set `clean_slate=true`. It wipes `public_html`, and was only for the one-time removal of WordPress.
- The sync uploads only changed files, and deletes files it uploaded earlier that are gone from the build.
- The FTP account opens directly in the site's `public_html`, so the workflow's `server-dir` is `./`. Setting it to `public_html/` creates a nested folder that the live site never serves.
- If `check:live` reports old content, Hostinger's CDN is still caching. Ask the user to purge the CDN cache in hPanel, then check again.
- The user can also deploy without you: Actions tab, "Deploy to Hostinger (live site)", "Run workflow", both boxes unticked.

## Troubleshooting

- **Push rejected for workflow files.** The `gh` token needs the `workflow` scope. Have the user run `! gh auth refresh -h github.com -s workflow`, then run `gh auth setup-git`.
- **FTP step fails to connect.** The server uses FTPS on port 21 with a `*.hstgr.io` certificate, so `security: loose` is required. If the login fails, the user should reset the FTP password in hPanel under Files, FTP Accounts, and update the `FTP_PASSWORD` secret.
- **zsh quoting.** Quote globs such as `--include='*.html'`, and quote URLs containing `?`.
