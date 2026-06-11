/* InfraStatera — hero scene: parametric box-truss wireframe.
   Degrades to the static SVG fallback if WebGL is unavailable. */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

const hero = document.querySelector('.hero');
const canvas = document.getElementById('hero-canvas');

function showFallback() {
  if (hero) hero.classList.add('no-webgl');
}

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

function buildTruss(bays, bayLen, width, height) {
  const bottom = [];
  const top = [];
  for (let i = 0; i <= bays; i++) {
    const x = (i - bays / 2) * bayLen;
    // gentle arc: raise mid-span slightly
    const arch = Math.sin((i / bays) * Math.PI) * 0.35;
    bottom.push([
      new THREE.Vector3(x, arch * 0.4, -width / 2),
      new THREE.Vector3(x, arch * 0.4, width / 2),
    ]);
    top.push([
      new THREE.Vector3(x, height + arch, -width / 2),
      new THREE.Vector3(x, height + arch, width / 2),
    ]);
  }

  const linePts = [];
  const seg = (a, b) => linePts.push(a, b);

  for (let i = 0; i <= bays; i++) {
    const [bl, br] = bottom[i];
    const [tl, tr] = top[i];
    seg(bl, br); // bottom transverse
    seg(tl, tr); // top transverse
    seg(bl, tl); // verticals
    seg(br, tr);

    if (i < bays) {
      const [bl2, br2] = bottom[i + 1];
      const [tl2, tr2] = top[i + 1];
      seg(bl, bl2); seg(br, br2); // bottom chords
      seg(tl, tl2); seg(tr, tr2); // top chords
      // alternating diagonals on both side faces
      if (i % 2 === 0) { seg(bl, tl2); seg(br, tr2); }
      else             { seg(tl, bl2); seg(tr, br2); }
      // lateral bracing on top plane
      if (i % 2 === 0) seg(tl, tr2); else seg(tr, tl2);
    }
  }

  const nodePts = [];
  for (let i = 0; i <= bays; i++) nodePts.push(...bottom[i], ...top[i]);

  return { linePts, nodePts };
}

function glowTexture() {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,72,40,1)');
  g.addColorStop(0.35, 'rgba(255,48,8,0.85)');
  g.addColorStop(1, 'rgba(255,48,8,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

function init() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0a0c, 6, 14);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 1.1, 7.2);
  camera.lookAt(0, 0.5, 0);

  const group = new THREE.Group();
  scene.add(group);

  const bays = isMobile ? 6 : 12;
  const { linePts, nodePts } = buildTruss(bays, 0.95, 0.9, 0.85);

  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xf0eee9, transparent: true, opacity: 0.22, fog: true,
  });
  group.add(new THREE.LineSegments(lineGeo, lineMat));

  const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodePts);
  const nodeMat = new THREE.PointsMaterial({
    size: 0.09, map: glowTexture(), transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, color: 0xff3008, fog: true,
  });
  group.add(new THREE.Points(nodeGeo, nodeMat));

  // ambient dust field
  const dustCount = isMobile ? 60 : 160;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3]     = (Math.random() - 0.5) * 14;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 7;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.025, color: 0xf0eee9, transparent: true, opacity: 0.35,
    depthWrite: false, fog: true,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  group.rotation.x = 0.16;

  function resize() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // mouse parallax (desktop only), lerped for weight
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  if (!isMobile && !reducedMotion) {
    window.addEventListener('pointermove', (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  let visible = true;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(hero);

  const clock = new THREE.Clock();

  function render() {
    const t = clock.getElapsedTime();
    current.x += (target.x - current.x) * 0.04;
    current.y += (target.y - current.y) * 0.04;
    group.rotation.y = t * 0.08 + current.x * 0.12;
    group.rotation.x = 0.16 + current.y * 0.06;
    group.position.y = Math.sin(t * 0.4) * 0.06;
    dust.rotation.y = t * 0.012;
    renderer.render(scene, camera);
  }

  if (reducedMotion) {
    group.rotation.y = 0.5;
    renderer.render(scene, camera);
    return;
  }

  renderer.setAnimationLoop(() => {
    if (visible && !document.hidden) render();
  });
}

if (!hero || !canvas || !supportsWebGL()) {
  showFallback();
} else {
  try {
    init();
  } catch (err) {
    console.warn('Hero scene failed, using static fallback:', err);
    showFallback();
  }
}
