/* Headless verification: console errors, preloader completion, i18n,
   menu, and screenshots at desktop + mobile sizes. */
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://localhost:3000/';
const OUT = '/tmp/infrastatera-shots';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-first-run', '--hide-scrollbars'],
});

const errors = [];
const page = await browser.newPage();
page.on('console', (msg) => {
  if (['error', 'warning'].includes(msg.type())) {
    errors.push(`[console.${msg.type()}] ${msg.text()}`);
  }
});
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));
page.on('requestfailed', (req) =>
  errors.push(`[requestfailed] ${req.url()} ${req.failure()?.errorText}`));

/* ---------- Desktop ---------- */
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle0' });
await sleep(3500); // preloader + hero intro

const preloaderGone = await page.evaluate(() => {
  const p = document.querySelector('.preloader');
  return !p || getComputedStyle(p).display === 'none';
});
console.log('preloader finished:', preloaderGone);

const heroVisible = await page.evaluate(() => {
  const line = document.querySelector('.hero-title .line');
  if (!line) return 'no .line spans';
  const m = getComputedStyle(line).transform;
  return m === 'none' || m.includes('matrix(1, 0, 0, 1, 0, 0)') ? 'visible' : m;
});
console.log('hero title lines:', heroVisible);

const webgl = await page.evaluate(() =>
  document.querySelector('.hero').classList.contains('no-webgl') ? 'fallback' : 'webgl');
console.log('hero renderer:', webgl);

await page.screenshot({ path: `${OUT}/01-desktop-hero.png` });

// scroll through sections for reveal screenshots
for (const [i, sel] of ['#solutions', '#services', '#cas-usage', '#partenaires', '#methodologie', '#contact'].entries()) {
  await page.evaluate((s) => document.querySelector(s).scrollIntoView({ behavior: 'instant', block: 'start' }), sel);
  await sleep(1300);
  await page.screenshot({ path: `${OUT}/0${i + 2}-desktop-${sel.slice(1)}.png` });
}

// language toggle check
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(400);
await page.click('.lang-btn[data-lang="fr"]');
await sleep(400);
const frTitle = await page.evaluate(() => document.querySelector('.hero-title').textContent.trim());
console.log('FR hero title:', JSON.stringify(frTitle));
await page.screenshot({ path: `${OUT}/08-desktop-hero-fr.png` });
await page.click('.lang-btn[data-lang="en"]');
await sleep(400);
const enTitle = await page.evaluate(() => document.querySelector('.hero-title').textContent.trim());
console.log('EN hero title:', JSON.stringify(enTitle));

// horizontal overflow check
const overflowDesktop = await page.evaluate(() =>
  document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('desktop horizontal overflow px:', overflowDesktop);

/* ---------- Mobile ---------- */
const mob = await browser.newPage();
mob.on('pageerror', (err) => errors.push(`[mobile pageerror] ${err.message}`));
await mob.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await mob.goto(URL, { waitUntil: 'networkidle0' });
await sleep(3500);
await mob.screenshot({ path: `${OUT}/09-mobile-hero.png` });

const overflowMobile = await mob.evaluate(() =>
  document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('mobile horizontal overflow px:', overflowMobile);

// burger menu
await mob.tap('.nav-burger');
await sleep(900);
await mob.screenshot({ path: `${OUT}/10-mobile-menu.png` });
const menuVisible = await mob.evaluate(() =>
  getComputedStyle(document.querySelector('.mobile-menu')).visibility);
console.log('mobile menu visibility after open:', menuVisible);
await mob.tap('.mobile-menu a[href="#services"]');
await sleep(1200);
await mob.screenshot({ path: `${OUT}/11-mobile-services.png` });

await mob.evaluate(() => document.querySelector('#cas-usage').scrollIntoView({ behavior: 'instant' }));
await sleep(1300);
await mob.screenshot({ path: `${OUT}/12-mobile-cas.png` });
await mob.evaluate(() => document.querySelector('#methodologie').scrollIntoView({ behavior: 'instant' }));
await sleep(1300);
await mob.screenshot({ path: `${OUT}/13-mobile-methodo.png` });

console.log('\n--- console/page errors ---');
console.log(errors.length ? errors.join('\n') : '(none)');

await browser.close();
