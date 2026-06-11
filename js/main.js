/* InfraStatera — interaction & animation layer.
   Animations only engage when GSAP loaded AND motion is allowed;
   otherwise the page stays fully visible and functional. */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const animate = hasGsap && !reducedMotion;

  // Gate hidden initial states before first paint.
  if (animate) document.documentElement.classList.add('js-anim');

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Split hero title into masked lines ---------- */
  function splitHeroTitle() {
    const title = document.querySelector('.hero-title');
    if (!title) return [];
    const lines = title.innerHTML.split(/<br\s*\/?>/i);
    title.innerHTML = lines
      .map((l) => `<span class="line-mask"><span class="line">${l.trim()}</span></span>`)
      .join('');
    return title.querySelectorAll('.line');
  }

  /* ---------- Navbar hide/show ---------- */
  function initNav() {
    const navbar = document.querySelector('.navbar');
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      if (document.body.classList.contains('menu-open')) return;
      const y = window.scrollY;
      if (y > lastY && y > 120) navbar.classList.add('nav-hidden');
      else navbar.classList.remove('nav-hidden');
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    const burger = document.querySelector('.nav-burger');
    const menu = document.querySelector('.mobile-menu');
    if (!burger || !menu) return;

    const links = menu.querySelectorAll('.mobile-link, .mobile-menu-foot > *');
    let open = false;
    let tl = null;

    if (animate) {
      tl = gsap.timeline({ paused: true })
        .set(menu, { visibility: 'visible' })
        .to(menu, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.inOut' })
        .from(links, { y: 36, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }, '-=0.2');
      tl.eventCallback('onReverseComplete', () => gsap.set(menu, { visibility: 'hidden' }));
    }

    function setOpen(next) {
      open = next;
      document.body.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      if (tl) {
        open ? tl.play() : tl.reverse();
      } else {
        menu.style.visibility = open ? 'visible' : 'hidden';
        menu.style.clipPath = open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)';
      }
    }

    burger.addEventListener('click', () => setOpen(!open));
    menu.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener('click', () => setOpen(false)));
  }

  /* ---------- Preloader + hero intro ---------- */
  function initIntro(lines) {
    const preloader = document.querySelector('.preloader');
    const num = document.querySelector('.preloader-num');
    const heroBits = [
      document.querySelector('.tagline'),
      document.querySelector('.hero-sub'),
      document.querySelector('.hero-foot .btn-primary'),
      ...document.querySelectorAll('.hero-annot'),
      document.querySelector('.hero-scroll'),
    ].filter(Boolean);

    gsap.set(heroBits, { opacity: 0, y: 24 });

    const count = { v: 0 };
    const tl = gsap.timeline();

    tl.to(count, {
      v: 100,
      duration: 1.1,
      ease: 'power2.inOut',
      onUpdate: () => { num.textContent = Math.round(count.v); },
    })
      .to('.preloader-bar-fill', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0)
      .to('.preloader-center, .preloader-corner', { opacity: 0, duration: 0.3 }, '+=0.1')
      .to(preloader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        onComplete: () => { preloader.style.display = 'none'; },
      }, '<0.1')
      .to(lines, { y: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.35')
      .to(heroBits, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power2.out' }, '-=0.6');

    return tl;
  }

  /* ---------- Scroll reveals ---------- */
  function initReveals() {
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  }

  /* ---------- Stat count-ups ---------- */
  function initCountUps() {
    document.querySelectorAll('[data-countup]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const text = el.textContent;
          const match = text.match(/(\d+(?:[.,]\d+)?)/);
          if (!match) return;
          const target = parseFloat(match[1].replace(',', '.'));
          const prefix = text.slice(0, match.index);
          const suffix = text.slice(match.index + match[1].length);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: 'power3.out',
            onUpdate: () => { el.textContent = prefix + Math.round(obj.v) + suffix; },
          });
        },
      });
    });
  }

  /* ---------- Méthodologie progress line ---------- */
  function initMethodoLine() {
    const line = document.querySelector('.methodo-line');
    if (!line) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', () => {
      gsap.to(line, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 55%', scrub: 0.5 },
      });
    });
    mm.add('(max-width: 860px)', () => {
      gsap.to(line, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 55%', scrub: 0.5 },
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = 18;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
        const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
        gsap.to(el, { x, y, duration: 0.4, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
      });
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initMenu();

    if (!animate) return; // content fully visible via CSS; nothing else to do

    const lines = splitHeroTitle();
    initIntro(lines);
    initReveals();
    initCountUps();
    initMethodoLine();
    initMagnetic();

    // i18n rewrites innerHTML on language switch — re-split the hero
    // title and show it instantly (the intro has already played).
    document.addEventListener('langchange', () => {
      const newLines = splitHeroTitle();
      gsap.set(newLines, { y: 0 });
    });

    window.addEventListener('load', () => ScrollTrigger.refresh());
  });
})();
