# InfraStatera — website

Static one-page site for [infrastatera.com](https://infrastatera.com), served by GitHub Pages from the `main` branch (custom domain set in `CNAME`).

## Structure

```
index.html          Single page: hero, live demos, services, process, why us, contact
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

## Editing

- **Demo links** live in `index.html` (search for `vercel.app` and `defect-capture-demo`).
- **Colors** are CSS variables at the top of `css/style.css`: `--blue` for buttons and links, `--brand` / `--tier` for the logo red-orange and small labels.
- **Hero photo**: `assets/img/hero-interchange.jpg` — "Aerial Night View of City Highway Interchange" by Raj Manohar on Pexels (free to use).
