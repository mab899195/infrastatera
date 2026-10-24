// InfraStatera — small page behaviors: mobile menu, announcement bar, footer year.
(function () {
  'use strict';

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () {
      setOpen(!menu.classList.contains('is-open'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Dismissible announcement (remembered per browser)
  var bar = document.getElementById('announce');
  var KEY = 'infrastatera-announce-submittal-generator';
  if (bar) {
    try {
      if (localStorage.getItem(KEY) === 'dismissed') bar.hidden = true;
    } catch (e) { /* storage unavailable */ }
    var close = bar.querySelector('.announce-close');
    if (close) {
      close.addEventListener('click', function () {
        bar.hidden = true;
        try { localStorage.setItem(KEY, 'dismissed'); } catch (e) { /* ignore */ }
      });
    }
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
