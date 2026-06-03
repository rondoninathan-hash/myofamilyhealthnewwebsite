# Myo Family Health

Marketing website for **Myo Family Health** — myofunctional therapy for happier,
healthier families, serving the Sacramento Valley & San Francisco Bay Area, in
person and online.

This is a single-page static site (no build step required).

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | The full single-page site (hero, about, symptoms, resources, contact, modals, footer). |
| `styles.css` | Design tokens and all component styles. |
| `app.js` | Interactions: sticky nav, mobile menu, scroll reveal, review/symptom/FAQ modals, badge popovers, contact widget tabs, and form validation. |
| `assets/` | Logo and photography (`logo-tree.png`, `hero-amy.jpeg`, `about-holistic.jpg`). |

## Running locally

It's a plain static site, so any static file server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or simply open `index.html` in a browser.

## Notes

- Fonts (DM Sans, Newsreader) load from Google Fonts via `<link>` tags.
- The contact section embeds the SimplePractice scheduling and contact widgets
  (`amy-rondoni.clientsecure.me`) via `<iframe>`, with a fallback contact form.
- Designed mobile-first and responsive down to small phone widths.
