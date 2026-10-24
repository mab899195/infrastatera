// InfraStatera — demo catalog.
//
// To add a demo, copy one block below and fill it in. That's it: the /demo page
// builds its cards from this list. Put screenshots in assets/img/ (a desktop
// shot about 800x500 and, optionally, a phone shot about 780x1688).
//
//   status:      short label shown above the title ("New demo", "Deployed in the field", "Beta"...)
//   title:       demo name
//   description: one or two sentences
//   tags:        a few short keywords
//   url:         link to the live demo
//   desktop:     desktop screenshot path + alt text
//   phone:       optional phone screenshot path + alt text (remove the line if none)

window.INFRASTATERA_DEMOS = [
  {
    status: 'New demo',
    title: 'Defect Capture',
    description: 'Photograph a concrete defect, rate it with AASHTO condition states and pin it on the map. Engineers review it from the office instantly and flag repair, reinforce or revisit.',
    tags: ['Inspections', 'AASHTO', 'Map review', 'PDF export'],
    url: 'https://mab899195.github.io/defect-capture-demo/',
    desktop: { src: 'assets/img/defect-capture-office.jpg', alt: 'Office view of Defect Capture: a map of defects colored by condition state beside a list sorted worst first' },
    phone: { src: 'assets/img/defect-capture-phone.jpg', alt: 'Field view of Defect Capture on a phone: defect cards with photos and condition states' }
  },
  {
    status: 'Deployed in the field',
    title: 'Field Management App',
    description: "Daily logs, plans and material requests from the foreman's phone to the office dashboard. In daily use by a Caltrans contractor's crew.",
    tags: ['Daily logs', 'Material requests', 'Submittals & RFIs', 'Multi-project'],
    url: 'https://kanaan-pm-demo.vercel.app',
    desktop: { src: 'assets/img/field-app-office.jpg', alt: 'Office dashboard of the Field Management App showing projects, working days, submittals, RFIs and material requests' },
    phone: { src: 'assets/img/field-app-phone.jpg', alt: 'Field app on a phone showing working day 60 of 180 and buttons for material requests, tasks, photos and daily reports' }
  }
];

// Renders the catalog into any element with [data-demo-grid].
// Image paths are relative to the site root; data-base adjusts them for pages in subfolders.
(function () {
  'use strict';
  var grid = document.querySelector('[data-demo-grid]');
  if (!grid || !window.INFRASTATERA_DEMOS) return;
  var base = grid.getAttribute('data-base') || '';

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function img(spec, w, h) {
    var i = document.createElement('img');
    i.src = base + spec.src;
    i.alt = spec.alt || '';
    i.width = w; i.height = h;
    i.loading = 'lazy';
    return i;
  }

  window.INFRASTATERA_DEMOS.forEach(function (d) {
    var card = el('article', 'demo-card');

    var media = el('a', 'demo-card-media');
    media.href = d.url; media.target = '_blank'; media.rel = 'noopener';
    media.setAttribute('aria-label', 'Open the ' + d.title + ' demo');
    var stage = el('div', 'device-stage device-stage--card');
    var browser = el('div', 'device-browser');
    var bar = el('div', 'device-bar');
    bar.setAttribute('aria-hidden', 'true');
    bar.appendChild(el('span')); bar.appendChild(el('span')); bar.appendChild(el('span'));
    browser.appendChild(bar);
    browser.appendChild(img(d.desktop, 800, 500));
    stage.appendChild(browser);
    if (d.phone) {
      var phone = el('div', 'device-phone');
      phone.appendChild(img(d.phone, 780, 1688));
      stage.appendChild(phone);
    } else {
      stage.classList.add('device-stage--no-phone');
    }
    media.appendChild(stage);
    card.appendChild(media);

    var body = el('div', 'demo-card-body');
    body.appendChild(el('p', 'tier', d.status));
    body.appendChild(el('h2', null, d.title));
    body.appendChild(el('p', 'demo-card-text', d.description));
    if (d.tags && d.tags.length) {
      var tags = el('ul', 'tags');
      d.tags.forEach(function (t) { tags.appendChild(el('li', null, t)); });
      body.appendChild(tags);
    }
    var actions = el('div', 'demo-actions');
    var open = el('a', 'btn btn-primary', 'Open demo');
    open.href = d.url; open.target = '_blank'; open.rel = 'noopener';
    var talk = el('a', 'btn btn-outline', 'Build one like this');
    talk.href = (base || './') + '#contact';
    actions.appendChild(open); actions.appendChild(talk);
    body.appendChild(actions);
    card.appendChild(body);

    grid.appendChild(card);
  });
})();
