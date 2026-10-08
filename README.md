# Ruben Martins — Portfolio

Personal portfolio site, in Portuguese (pt-PT) and English.

## Stack

- **React 19** + **Vite 8**, plain JavaScript (`.jsx`)
- **Tailwind CSS 4** through `@tailwindcss/vite` (no `tailwind.config.js`: colours and fonts are CSS variables in `src/index.css`)
- **Framer Motion** (loaded with `LazyMotion`), **i18next** for the two languages, **Lucide** icons
- Inter and Fira Code are self-hosted with Fontsource (no Google Fonts)

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # output in dist/
npm run preview  # serve the built site
```

## Where things live

| What | Where |
|---|---|
| All text, both languages | `src/i18n/pt.json`, `src/i18n/en.json` |
| Email, LinkedIn, GitHub | `src/data/contacts.js` |
| Skills and their levels | `src/data/skills.js` |
| Colours (dark and light theme) | `src/index.css` |
| Photo, CVs, favicons | `public/` |

## Updating the CVs

CVs exported from Canva carry the wrong title, author and language in their properties. Clean each
new export before replacing the files in `public/` (macOS only; the script checks that the pages are
unchanged and only ends with "OK" if they are):

```bash
python3 scripts/clean-cv-pdf.py ~/Downloads/CV_PT.pdf public/Ruben_Martins_CV_PT.pdf --title "Ruben Martins — CV" --author "Ruben Martins" --lang pt-PT
python3 scripts/clean-cv-pdf.py ~/Downloads/CV_EN.pdf public/Ruben_Martins_CV_EN.pdf --title "Ruben Martins — CV" --author "Ruben Martins" --lang en-GB
```

## Publishing

`npm run build` writes the whole site to `dist/` (plain static files), so any static host works
(a small web server behind a Cloudflare Tunnel, Cloudflare Pages, GitHub Pages...). Before building
for the real address, create `.env.production` with `VITE_SITE_URL=https://your-domain` (no trailing
slash): it is used for the share image in the link previews. `public/404.html` is the not-found page.
The share image comes from `scripts/og-image.svg`:

```bash
rsvg-convert -w 1200 -h 630 scripts/og-image.svg -o public/og-image.png
```

## Notes

- Portuguese copy is European Portuguese (pt-PT).
