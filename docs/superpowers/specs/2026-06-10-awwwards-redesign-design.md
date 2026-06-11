# InfraStatera "Dark Engineering" Redesign — Design Spec

**Date:** 2026-06-10
**Status:** Approved by user

## Goal

Redesign the InfraStatera landing page (infrastatera.com) to awwwards-level visual quality using GSAP and Three.js, while keeping all existing content, sections, and the FR/EN i18n system. Must be mobile-friendly and deployable to GitHub Pages unchanged (static files, no new build requirements).

## Decisions (confirmed with user)

- **Content:** Keep existing InfraStatera copy, sections, and `data-i18n` keys / `assets/i18n.js` translations. Do not invent a fictional portfolio.
- **Direction:** Dark engineering — near-black `#0A0A0C` canvas, massive display type, red `#FF3008` as sole accent, blueprint/grid motifs, structural wireframe imagery.
- **Stack:** GSAP 3 + ScrollTrigger and Three.js, loaded from CDN. Vite stays for local dev only.

## Architecture

Static single-page site, same file layout:

- `index.html` — same sections and i18n keys; markup may be restructured (wrappers, split-text spans, canvas element) but every existing `data-i18n` key is preserved.
- `css/style.css` — fully rewritten for the dark design system.
- `js/scene.js` — NEW. Three.js hero scene (wireframe truss/bridge, red glowing nodes, slow rotation, mouse parallax).
- `js/main.js` — NEW. GSAP animations: preloader, nav behavior, split-text reveals, ScrollTrigger section reveals, stat count-ups, methodology progress line, magnetic buttons, mobile menu.
- `assets/i18n.js` — unchanged unless new keys are needed for new UI strings (e.g., menu labels); existing keys untouched.
- Typography: distinctive display font (Clash Display or similar via Fontshare CDN) + clean grotesk body font. No system-font default look.

## Section-by-section behavior

1. **Preloader** — ~1s logo/counter reveal, curtain wipe into hero. Skipped entirely under reduced motion.
2. **Navbar** — fixed, glass-dark, hides on scroll-down / shows on scroll-up. Mobile: hamburger opening a full-screen overlay menu.
3. **Hero** — Three.js canvas behind a huge split-text headline (line-by-line reveal). Scroll indicator at bottom.
4. **Solutions** — pain items stagger in; solution card with glowing red border.
5. **Services** — oversized 01–04 index numbers, hover tilt/lift cards, staggered reveal.
6. **Cas d'usage** — stats (−15%, 6 months) count up on scroll into view.
7. **Partners** — marquee restyled as monochrome technical ticker.
8. **Méthodologie** — red progress line draws down the 4 steps with scroll.
9. **Footer** — huge contact type, magnetic hover button on the mailto CTA.

## Error handling / resilience

- `prefers-reduced-motion: reduce` → no preloader, no scroll animations, static hero fallback.
- WebGL unavailable or scene init throws → static SVG structure shown in hero instead of canvas; site fully usable.
- Mobile (< 768px): simplified Three.js scene (lower geometry density, no mouse parallax) or static fallback if performance is poor.
- All content readable and reachable with JS disabled (animations are enhancement; initial element states must not hide content without JS — use a `.js` class gate or GSAP-set initial states).

## Testing / verification

- Run `npm run dev`, load the page, check the browser console for errors.
- Verify desktop and mobile (≈390px) viewports: layout, menu, hero scene fallback.
- Verify FR/EN toggle still translates all sections.
- Verify anchors (#solutions, #services, #cas-usage, #partenaires, #methodologie, #contact) still work.
