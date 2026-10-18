# Improvements backlog

Phase 1 reproduces the live WordPress site as-is, including its mistakes. These were noticed during the port and are worth fixing in phase 2.

## Done (October 2026, requested by the owner)
- Cookie bar now hides when Accept is clicked (the bar's `display: flex` was overriding `hidden`; a global `[hidden]` rule fixes it).
- Home: "Our Mission:" label added; Volunteer/Patients/Donate cards removed; sections reordered to mission, before/after, video, featured news, CDCP.
- Home featured news: the June 2026 CBC article was replaced with VOCM's October 7, 2026 report on the CDA assessment.
- "Urban Dental Clinic" renamed to "Filling the Gap Scarborough" everywhere. The Scarborough email address `urbandental@ccrihc.org` is unchanged.
- Footer reorganised into Quick Links plus one column per location, with icons, clickable email and phone, bold phone numbers and hours, and a separate legal bar.
- About: "Spring Update 2026" publication tab removed.

## Broken or odd links
- **Contact `#forpatients` anchor does not exist.** The header "Volunteer" button on Home, the "Contact Us" button on Support Our Work, and the "Volunteer" button on Volunteers all point to `/contact/#forpatients`. The Contact page only has `#patients`, `#forpatientsvolunteers` and `#donors`.
- **Home "CLICK HERE" button** in the CDCP section links to `#` (nowhere).
- **Sponsor logos link to the wrong sites** on Support Our Work: ROI Corp → Toronto Public Health; HANSAmed and Accerta → Think Property; Canadian Dental Labs and Sonident → HealthEquity; HDA Crown and Bridge → Toronto Foundation.
- **Rexdale phone and hours** on Contact link to the Scarborough mailto (`urbandental@ccrihc.org`). Phone numbers should be `tel:` links.
- **Volunteer agreement "Download"** on Volunteers is plain text with no file.
- **Our Team volunteer photos** all link to greenshield.ca.
- Several "Open in Maps" / map embeds point at `21 Panorama Court, Etobicoke` at zoom 10 (too far out).

## Content
- "695337 Saved Toronto Public Health" has no unit (presumably dollars).
- About page has an "Our Team" heading with nothing under it (the team page lives at `/home/meet-our-team/` and isn't linked from anywhere in the nav).
- Typos: "Filing the Gap" (Instagram caption), "give is grants" (Toronto Foundation), "Strategic", "cDCP".
- Shakespeare quote attribution is spurious.
- Testimonials on Services & Eligibility refer to "Urban Dental Clinic"; worth a one-line note that it is the Scarborough partner clinic.
- The Accerta sponsor card and a second testimonial carousel on Services are hidden on desktop on the live site (`elementor-hidden-desktop`); they were left out here too.

## Design / UX
- Slugs `/elementor-1654/` (Support Our Work) and `/elementor-4058/` (Privacy Policy) are meaningless; add redirects to `/support/` and `/privacy/`.
- Heading weights are inconsistent between pages because the live site loaded different Arvo weights per page. Pick one.
- Mobile: the About page impact box and the publications tabs overflow on narrow screens on the live site.
- Instagram section is a static snapshot (20 posts as of 2026-10-18). Refresh manually or wire a feed service.
- The "Load More" button under the Instagram grid just opens the profile.
- Google Maps iframes load third-party scripts on Contact and Volunteers; consider static map images with links.
- Images still lack alt text where the original had none.

## Hosting
- Live WordPress install serves injected casino/SEO spam on the homepage (hidden text with links to gambling sites). Take it offline once this site is live and change the hosting/WP passwords.
- DNS is at Hostinger; MX records are Google Workspace and must be preserved when the A records move to GitHub Pages.
