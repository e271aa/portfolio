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

The site is static: `npm run build` writes everything to `dist/`. It is hosted on Cloudflare Pages
(`https://portfolio.e271aa.blog`), connected to the GitHub repository: a push to `main` publishes.

Pages settings: build command `npm run build`, output `dist`, Node 22, and these variables
(they are baked in at build time, so change them and publish again):

| Variable | Value |
|---|---|
| `VITE_SITE_URL` | `https://portfolio.e271aa.blog` (no trailing slash; share image and canonical link) |
| `VITE_DEMO_URL` | `https://demo.e271aa.blog/casa` (empty = no demo button) |
| `VITE_NOOK_REPO_URL` | address of the public Nook repository (empty = no code button) |

`public/404.html` is the not-found page, `public/sitemap.xml` and `public/robots.txt` hold the
domain by hand. The share image comes from `scripts/og-image.svg`:

```bash
rsvg-convert -w 1200 -h 630 scripts/og-image.svg -o public/og-image.png
```

After publishing, `scripts/check-sites.sh` checks the site, CVs, 404, demo and the demo WebSocket from
outside. Link previews can be refreshed at the LinkedIn Post Inspector.

## The Nook demo

`https://demo.e271aa.blog/casa` is a Home Assistant with a simulated house. For now it runs on the Mac
(`~/nook-publico`, containers `nook-ha` and `nook-tunnel`, Cloudflare Tunnel); the Raspberry Pi is down.

Update the Nook:

```bash
cd ~/nook-publico
git pull
docker compose up -d --build
docker compose ps          # nook-ha should say healthy, nook-tunnel running
```

If the demo is down:

1. `scripts/check-sites.sh` shows which part fails. A 502 or 1033 from Cloudflare means the tunnel is not connected.
2. The Mac sleeping or leaving the network is the usual cause. Wake it, then `docker compose ps` in `~/nook-publico`.
3. `docker compose up -d` brings both containers back; `docker logs nook-tunnel --tail 20` should show registered connections.
4. If it will be down for long, set `VITE_DEMO_URL` empty on Pages and publish again: the button disappears instead of leading to an error.

Never touch the personal Home Assistant (port 8123) or `acasa_demo/config` from here.

## Monitoring

Use an external monitor, because a check running on the Mac stops when the Mac sleeps. UptimeRobot
(free plan, 5 minute interval, email alert) with two HTTP(s) monitors: `https://portfolio.e271aa.blog/`
and `https://demo.e271aa.blog/casa`.

## Notes

- Portuguese copy is European Portuguese (pt-PT).
