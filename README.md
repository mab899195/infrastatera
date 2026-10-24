# InfraStatera — website

Static one-page site for [infrastatera.com](https://infrastatera.com), served by GitHub Pages from the `main` branch (custom domain set in `CNAME`).

## Structure

```
index.html          Homepage: hero, featured demos, services, process, why us, contact
demo/index.html     All demos page (infrastatera.com/demo), built from js/demos.js
js/demos.js         Demo catalog: add new demos here
css/style.css       All styles (Open Sans, showroom layout, responsive)
js/main.js          Mobile menu, dismissible announcement bar, footer year
assets/logo.svg     Brand mark (hexagon + I-beam)
assets/favicon.svg
assets/img/         Hero photo and demo screenshots
```

No build step is needed. To preview locally:

```bash
npx vite        # or: python3 -m http.server 3000
```

## Adding a demo

1. Add screenshots to `assets/img/` (desktop ~800×500, optional phone ~780×1688).
2. Open `js/demos.js`, copy one `{ ... }` block in `INFRASTATERA_DEMOS` and fill it in. The order in the list is the order on the page.
3. The demo appears on [infrastatera.com/demo](https://infrastatera.com/demo/) automatically.

The homepage shows two featured demos as large tiles (hand-written in `index.html`) plus a "See all demos" button. Swap a featured tile there only if you want a new demo on the homepage too.

## Editing

- **Featured demo links** on the homepage live in `index.html` (search for `vercel.app` and `defect-capture-demo`); the full list lives in `js/demos.js`.
- **Colors** are CSS variables at the top of `css/style.css`: `--blue` for buttons and links, `--brand` / `--tier` for the logo red-orange and small labels.
- **Hero photo**: `assets/img/hero-interchange.jpg` — "Aerial Night View of City Highway Interchange" by Raj Manohar on Pexels (free to use).
