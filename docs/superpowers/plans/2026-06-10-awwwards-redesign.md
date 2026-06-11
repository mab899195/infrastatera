# InfraStatera Dark Engineering Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the InfraStatera landing page as a dark, awwwards-level experience with GSAP scroll animations and a Three.js wireframe hero, preserving all content and FR/EN i18n.

**Architecture:** Static single-page site (GitHub Pages). `index.html` keeps every existing `data-i18n` key and section anchor but gains animation hooks (classes/data attributes), a hero `<canvas>`, a preloader, and a mobile menu. `css/style.css` is rewritten as a dark design system. Two new ES modules: `js/scene.js` (Three.js) and `js/main.js` (GSAP). Libraries from CDN; Vite only for local dev.

**Tech Stack:** GSAP 3 + ScrollTrigger (CDN UMD), Three.js (CDN ES module via importmap), Fontshare fonts (Clash Display + Archivo or similar), vanilla JS.

**Spec:** `docs/superpowers/specs/2026-06-10-awwwards-redesign-design.md`

---

### Task 1: HTML restructure (`index.html`)

**Files:** Modify: `index.html`

- [ ] Keep ALL existing `data-i18n` keys, section ids (`#solutions #services #cas-usage #partenaires #methodologie #contact`), and content. Verify afterwards with:
  `grep -o 'data-i18n="[^"]*"' index.html | sort > /tmp/new.txt` and diff against the same grep on `git show HEAD:index.html` — sets must be identical.
- [ ] Add `<head>` font links (Fontshare CDN), preconnects, meta description, dark `theme-color`.
- [ ] Add preloader markup (`.preloader` with logo + counter) as first body element.
- [ ] Nav: keep links/lang-toggle/CTA; add `.nav-burger` button (3 spans) and `.mobile-menu` full-screen overlay duplicating nav links (reuse same i18n keys).
- [ ] Hero: add `<canvas id="hero-canvas">` plus a hidden static SVG fallback (`.hero-fallback`, wireframe truss drawing); keep tagline/title/sub/CTA elements with their keys; add scroll indicator.
- [ ] Sections: add `data-reveal` attributes on animatable blocks, wrap stats with `data-countup`, add `.methodo-line` element (SVG/div) for the progress line.
- [ ] Scripts at end of body, in order: GSAP + ScrollTrigger UMD CDN, `assets/i18n.js`, `js/main.js` (defer), `js/scene.js` as `<script type="module">` with importmap for `three`.
- [ ] Add `js` class gate: `<script>document.documentElement.classList.add('js')</script>` in head so no-JS users see content (CSS only hides initial states under `.js`).
- [ ] Commit: `feat: restructure markup for dark redesign`

### Task 2: CSS design system rewrite (`css/style.css`)

**Files:** Rewrite: `css/style.css`

- [ ] Tokens: `--bg:#0A0A0C`, `--bg-elev:#111114`, `--ink:#F4F2EE`, `--ink-dim:rgba(244,242,238,.6)`, `--red:#FF3008`, `--line:rgba(244,242,238,.12)`, fluid type scale with `clamp()`, display font for h1/h2/big numbers.
- [ ] Global: dark body, blueprint grid background (CSS `linear-gradient` grid lines at low opacity), red selection color, custom scrollbar.
- [ ] Preloader: fixed full-screen, logo + counter, curtain panels for the wipe.
- [ ] Navbar: fixed, blur/transparent dark, `.nav-hidden` (translateY(-100%)) state; burger styles; mobile menu overlay (clip-path or translateY) with oversized links.
- [ ] Hero: 100svh, canvas absolute behind content, huge clamp() display title, split-line mask styles (`.line-mask{overflow:hidden}` children translateY), scroll indicator animation.
- [ ] Solutions: two-column → stacked on mobile; pain items with left red tick line; solution card with subtle red glow border (`box-shadow`/gradient border).
- [ ] Services: grid of cards with oversized ghost index numbers, hover lift + border highlight; respect touch (no hover-dependent info).
- [ ] Cas d'usage: giant stat numerals in display font, red; cards on `--bg-elev`.
- [ ] Partners: monochrome ticker, dim text, red separator glyphs; keep duplicated track for seamless CSS loop.
- [ ] Méthodologie: vertical (mobile) / horizontal (desktop) steps with a track line; `.methodo-line` scaleY/scaleX origin for draw effect.
- [ ] Footer: oversized contact heading, magnetic button base styles.
- [ ] `@media (prefers-reduced-motion: reduce)`: kill marquee animation, show all content, no transforms.
- [ ] Breakpoints: ~1024px, 768px, 480px. Verify no horizontal overflow at 390px.
- [ ] Commit: `feat: dark engineering design system`

### Task 3: Three.js hero scene (`js/scene.js`)

**Files:** Create: `js/scene.js`

- [ ] ES module importing `three` from importmap (CDN). Wrap entire init in `try/catch`; on failure or `!WebGLRenderingContext`, add `.no-webgl` class to hero → CSS shows `.hero-fallback` SVG and hides canvas.
- [ ] Scene: parametric truss/bridge built from `BufferGeometry` lines (`LineSegments`, white @ ~0.25 opacity) + red glowing node points (`Points` with additive blending). Slow continuous rotation; mouse-move parallax (lerped) on desktop only.
- [ ] Sizing: `ResizeObserver`/resize handler, `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`. Mobile (<768px): reduce segment counts ~50%, skip parallax.
- [ ] Pause rendering when hero is off-screen (`IntersectionObserver`) and under `prefers-reduced-motion` render a single static frame.
- [ ] Commit: `feat: three.js wireframe hero scene`

### Task 4: GSAP animation layer (`js/main.js`)

**Files:** Create: `js/main.js`; Modify: `assets/i18n.js` (one line)

- [ ] Reduced-motion gate at top: if `matchMedia('(prefers-reduced-motion: reduce)')` matches → skip preloader (remove node), set all `[data-reveal]` visible, init only functional behaviors (nav, menu, lang).
- [ ] Preloader: counter 0→100 (~0.9s), curtain wipe, then hero intro timeline.
- [ ] Split-text: helper that wraps hero title lines (`<br>`-separated) in `.line-mask > .line` spans and animates translateY/stagger. Re-runs when language changes.
- [ ] i18n hook: append `document.dispatchEvent(new CustomEvent('langchange'))` at end of `setLanguage()` in `assets/i18n.js`; `main.js` listens and re-splits hero title (instant set, no replay).
- [ ] Nav: hide on scroll-down / show on scroll-up (ScrollTrigger or scroll listener with threshold); burger toggles `.mobile-menu` with GSAP timeline; menu link click closes menu then scrolls.
- [ ] Scroll reveals: `gsap.utils.toArray('[data-reveal]')` → `ScrollTrigger` fade/translateY/stagger per section.
- [ ] Count-ups: for `[data-countup]`, parse numeric part (handles `−15%` and `6 mois/months`), tween textContent of the number only, fire once on enter.
- [ ] Méthodologie line: scaleX/scaleY tween scrubbed to section scroll.
- [ ] Magnetic buttons: pointer-fine only; translate button toward cursor within radius, spring back on leave.
- [ ] Commit: `feat: gsap animation layer`

### Task 5: Verification & polish

- [ ] `npm run dev` (background), `curl -s localhost:3000 | head` sanity check.
- [ ] Browser check (DevTools/screenshot tooling available locally): console clean of errors; desktop ~1440px and mobile 390px layouts; FR/EN toggle translates everything incl. re-split hero title; all anchors scroll; preloader doesn't trap reduced-motion users.
- [ ] `grep` i18n key diff (Task 1 command) — identical sets.
- [ ] Fix anything found; final commit: `feat: awwwards dark engineering redesign`.
