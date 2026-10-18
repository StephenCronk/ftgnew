# Improvements backlog

Phase 1 reproduces the live WordPress site as-is, including its mistakes. These were noticed during the port and are worth fixing in phase 2.

## Done (October 2026, requested by the owner)
- Cookie bar now hides when Accept is clicked (the bar's `display: flex` was overriding `hidden`; a global `[hidden]` rule fixes it).
- Home: "Our Mission:" label added; Volunteer/Patients/Donate cards removed; sections reordered to mission, before/after, video, featured news, CDCP.
- Home featured news: the June 2026 CBC article was replaced with VOCM's October 7, 2026 report on the CDA assessment.
- "Urban Dental Clinic" renamed to "Filling the Gap Scarborough" everywhere. The Scarborough email address `urbandental@ccrihc.org` is unchanged.
- Footer reorganised into Quick Links plus one column per location, with icons, clickable email and phone, bold phone numbers and hours, and a separate legal bar.
- About: "Spring Update 2026" publication tab removed.
- Contact links: the Volunteer (Volunteers) and Contact Us (Support Our Work) buttons now go to `/contact/#forpatientsvolunteers`; phone numbers on Contact and Volunteers are `tel:` links; the hours on Contact are no longer mailto links.
- Rexdale map embeds on Contact and Volunteers use the full address at street zoom (15).
- Typos fixed: "Filing the Gap" (Instagram caption and Dr. Cherry's bio), "give is grants", "cDCP". The "Strategic" typo was in the removed Spring Update 2026 tab.
- Impact counters show "$695,337 Saved Toronto Public Health", and all counters use thousands separators.
- `/support/` and `/privacy/` redirect to `/elementor-1654/` and `/elementor-4058/` (meta-refresh pages with a canonical link, so they work on GitHub Pages and Hostinger).
- Large section headings use regular-weight Arvo on every page (Home and the two "Our Impact" headings were bold). Card titles, page banners and the Annual Report promo stay bold.
- Checked mobile overflow at 390px: no page scrolls sideways in the rebuild; the About impact box and publication tabs fit.
- Header (every page): sticky, slimmer, animated underline on the current page; menu button below 1100px. On Home it floats over the hero and turns solid on scroll.
- Home redesigned: full-screen video hero (headline, mission line, Donate / Volunteer / Are You Eligible? buttons, 2025 impact numbers, pause button; poster only for reduced-motion or data-saver visitors), then restyled mission, before/after grid and video, news cards, CDCP cards and callout, 8-post Instagram grid with a Follow button, and an Annual Report banner. The old two-slide carousel, the dead "Click here" button and the Instagram "Load More" button were removed.
- Home revisions: hero video is now the volunteers clip; the mission section is on navy so the white logo reads; CDCP section simplified (plain icon list, one image, the two explanatory paragraphs in columns and a light note); "The most vulnerable Canadians still need your help" is now a short parallax banner over a streetcar video. Before/after moved to a light band and news to a navy band to keep the bands alternating.
- Home: hero button "Are You Eligible?" (which led to the government CDCP info) replaced by "Need Care?" to Services & Eligibility; new "How To Get Care" three-step section using existing Contact/Services wording; news is now the three most recent articles as cards linking to the source; before/after trimmed to three pairs; closing "How Can You Help?" section (Donate / Volunteer / donated equipment, copy from Support Our Work).
- Search and sharing: site name reads "Filling the Gap Dental Outreach" everywhere (titles, logo alt, footer); Home title is "Filling the Gap Dental Outreach | Affordable Urgent Dental Care in Toronto"; default meta description; canonical links; Open Graph / Twitter tags with a 1200×630 share image; schema.org data for the charity and both clinics on Home.
- Accessibility and speed: before/after photos have alt text; footer column titles are h2 (fixes heading order); cookie button text darkened for contrast; visible keyboard focus ring site-wide; unused Roboto Slab and Roboto weights dropped; hero headline no longer fades in (it is the page's largest paint). Lighthouse on Home: mobile 92 / 100 / 100 / 100, desktop 100 across the board (was 91 / 95 / 100 / 91).
- Footer (every page): new "General Inquiries" column with info@fillingthegap.ca after the two clinic columns.
- Theme picker (preview only): a floating palette tab on the right of every page switches between Theme 1 (current, default; id `harbour`), Theme 2 (navy + amber, Fraunces + Nunito Sans; `sunrise`), Theme 3 (blue + coral on cream, Lora + Nunito Sans; `coastal`) and Theme 4 (charcoal + sky blue, Plus Jakarta Sans; `slate`). The choice is remembered per browser. It appears only in preview builds (`NOINDEX=1`, or force it with `THEME_PICKER=1`); the live build has no picker and loads no extra fonts. To adopt a theme, copy its tokens from `src/css/themes.css` into `tokens.css` and its fonts into the Google Fonts link in `base.njk`. All four themes pass WCAG AA contrast.
- Home hero, calmer: the headline is Arvo Bold in sentence case (was Alfa Slab One in capitals; that font is no longer loaded), the subtitle uses the body font in sentence case, "Need Care?" is an underlined link next to Donate and Volunteer, the 2025 impact numbers moved into the navy mission section below, and the scroll cue is gone.
- Home mission section: on scroll the round logo fades in first, then the mission text (skipped for reduced motion).
- Softer colours (every page): dark sections use a deeper ink (#0f2f47) instead of #00406a, and light sections use white and a pale blue-tinted off-white (#f3f7fa) instead of grey #e4e7ed. The bright cyan #00afd1 is replaced by a soft teal (#7fd4e4) on dark backgrounds and a deep teal (#0e7c93) on light ones; the old solid-cyan blocks (impact counters, reviews, About accordion, Annual Report pages) are now pale teal (#e2f3f7). Every text colour now passes WCAG AA contrast. Home has fewer dark/light switches: only the hero and mission, the before/after section and the red-train banner are dark. The teeth pattern was recoloured (`teethBkg-soft.webp`), and the grey baked into `Untitled-2.webp` (Volunteers) and `lottie-still.webp` (Services) is now transparent.
- Home treatment on every other page (About, Our Team, Services & Eligibility, Support Our Work, Volunteers, Contact, Privacy, publications): a calmer photo hero with a sentence-case Arvo headline, an optional one-line lede and pill buttons (plain navy hero on About, Our Team and Privacy); sections rebuilt as alternating white / pale / navy bands with centred titles, white cards, rounded photos, the Home before/after and video styling, fade-in on scroll, restyled impact numbers, accordions, review and logo carousels, and pill tabs. Everything takes its colours, fonts and corner radius from the theme tokens, so the preview theme picker now restyles every page. The bands, pills and scroll reveal moved from Home's CSS/JS into the shared `components.css` / `components.js`.
- About: the first section is trimmed to a one-line intro in the hero plus three short Mission / Vision / Goals cards; the four long paragraphs (who we serve, our approach, volunteers welcome) were dropped, since Support Our Work and Volunteers cover them. Our Story rows carry their year (2007, 2017, 2020).
- Services: the "The Gap" statement is now the hero lede (its illustration `lottie-still.webp` was removed); the emergency notice is an h2 instead of a second h1.
- Contact: location cards in a row with the maps below; emails shown in lower case (they were forced to capitals); social buttons use theme colours instead of Facebook/Instagram/LinkedIn brand colours.
- Privacy: dark page switched to a light reading column. The teeth pattern images (`teethBkg*.webp`) are no longer used and were removed.
- Site icon: PNG favicons (32 and 192 px), an Apple touch icon and `favicon.ico`, all from the same tooth mark the original site uses. The old WebP-only icon did not show in Safari.
- Home mission logo is now an animated SVG traced from the round logo PNG (`scripts/trace-logo.py`): when the whole logo is on screen it plays once. The two figures and the arcs draw their outlines and fill in, the heart springs open, both heads drop in and bounce, "Filling the Gap" spins in letter by letter, "dental outreach" rises in, and the heart beats twice at the end (about 4.5 s). Visitors with reduced motion, or without JavaScript, see the finished logo. It keeps the brand white and cyan under every theme.

## Broken or odd links
- **Home "CLICK HERE" button** in the CDCP section links to `#` (nowhere).
- **Sponsor logos link to the wrong sites** on Support Our Work: ROI Corp → Toronto Public Health; HANSAmed and Accerta → Think Property; Canadian Dental Labs and Sonident → HealthEquity; HDA Crown and Bridge → Toronto Foundation.
- **Volunteer agreement "Download"** on Volunteers is plain text with no file.
- **Our Team volunteer photos** all link to greenshield.ca.

## Content
- About page has an "Our Team" heading with nothing under it (the team page lives at `/home/meet-our-team/` and isn't linked from anywhere in the nav).
- Shakespeare quote attribution is spurious.
- Testimonials on Services & Eligibility refer to "Urban Dental Clinic"; worth a one-line note that it is the Scarborough partner clinic.
- The Accerta sponsor card and a second testimonial carousel on Services are hidden on desktop on the live site (`elementor-hidden-desktop`); they were left out here too.

## Design / UX
- YouTube thumbnails (`hqdefault.jpg`) carry their own black letterbox bars, which show as thin dark strips on the video cards; `maxresdefault.jpg` would avoid them where it exists.
- Mobile Lighthouse LCP is about 3.2 s (simulated slow 4G), set by the web font (now Arvo Bold) arriving for the hero headline; dropping Alfa Slab One in October 2026 did not change it. Self-hosting or preloading that font would help but conflicts with the Google Fonts rule; non-blocking font CSS and bundled CSS were tried and made no measurable difference.
- `html lang` is `en-GB`; `en-CA` would be more accurate.
- `widgets.json` still holds the old Home news-tabs widget (`index:2011059`) that no template uses; it keeps `dose_play`, `nucleatum` and `cdcp-playbutton` images in the build.
- Instagram section is a static snapshot (8 posts as of 2026-10-18). Refresh manually or wire a feed service.
- Instagram auto-refresh (shelved October 2026): weekly GitHub Action using the Instagram API with Instagram Login. Needs a Business account, a Meta app in Development mode, an `IG_ACCESS_TOKEN` secret and a fine-grained `GH_SECRETS_TOKEN` (Secrets: write) so the workflow can store the renewed 60-day token. Preview only until `main` matches the live site.
- Google Maps iframes load third-party scripts on Contact and Volunteers; consider static map images with links.
- Images still lack alt text where the original had none.

## Hosting
- Live WordPress install serves injected casino/SEO spam on the homepage (hidden text with links to gambling sites). Take it offline once this site is live and change the hosting/WP passwords.
- The `/support/` and `/privacy/` redirects are meta-refresh pages. A server 301 in `.htaccess` would be better for search engines once the old WordPress `.htaccess` is gone from Hostinger.
- DNS is at Hostinger; MX records are Google Workspace and must be preserved when the A records move to GitHub Pages.
