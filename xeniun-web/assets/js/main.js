/* Xeniun — interface layer (no dependencies) */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------
     i18n — Spanish lives in the HTML (SEO + no-JS). English below.
     ------------------------------------------------------------------ */
  var EN = {
    'meta.title': 'Xeniun — Technology Research, Development & Innovation',
    'meta.description': 'Xeniun is a technology R&D and innovation firm based in Santo Domingo. Software and artificial intelligence, electrical and telecommunications engineering, energy, industry and technology consulting.',
    'skip': 'Skip to content',
    'menu.open': 'Open menu',
    'menu.close': 'Close menu',
    'nav.capabilities': 'Capabilities',
    'nav.method': 'Method',
    'nav.sectors': 'Sectors',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'cta.talk': 'Let’s talk',
    'hero.eyebrow': 'Research · Development · Innovation',
    'hero.title': '<span class="line"><span>We turn</span></span> <span class="line"><span>research into</span></span> <span class="line"><span class="grad">competitive advantage.</span></span>',
    'hero.lead': 'Xeniun is a technology R&D and innovation firm. We bring together software, artificial intelligence and electrical, telecommunications and energy engineering for organizations that need to stay one step ahead.',
    'hero.cta1': 'Start a project',
    'hero.cta2': 'Explore capabilities',
    'hero.spec.k1': 'Core',
    'hero.spec.v1': 'Technology R&D&I',
    'hero.spec.k2': 'Practices',
    'hero.spec.v2': '5 integrated disciplines',
    'hero.spec.k3': 'Base',
    'hero.spec.v3': 'Santo Domingo, DR',
    'hero.spec.k4': 'Coordinates',
    'hero.scroll': 'Scroll to explore',
    'manifesto.label': 'Manifesto',
    'manifesto.text': 'We don’t sell technology. We design your organization’s next state: we research the problem, build the solution and take it into operation, with laboratory rigor and engineering discipline.',
    'mq.1': 'Applied research',
    'mq.2': 'Artificial intelligence',
    'mq.3': 'Custom software',
    'mq.4': 'Electrical engineering',
    'mq.5': 'Telecommunications',
    'mq.6': 'Energy',
    'mq.7': 'Industrial automation',
    'mq.8': 'IoT',
    'mq.9': 'Digital transformation',
    'cap.label': 'Capabilities',
    'cap.title': 'Five disciplines.<br>One accountable team.',
    'cap1.title': 'Research, Development & Innovation',
    'cap1.text': 'Applied research that becomes product. We explore, validate and transfer technology from hypothesis to working prototype.',
    'cap1.t1': 'Applied research',
    'cap1.t2': 'Rapid prototyping',
    'cap1.t3': 'Proofs of concept',
    'cap1.t4': 'Technology transfer',
    'cap1.t5': 'Technology scouting',
    'cap1.t6': 'Intellectual property',
    'cap1.fig': 'Fig. 01 — Double helix · Applied research',
    'cap2.title': 'Software & Artificial Intelligence',
    'cap2.text': 'Custom platforms, AI models and intelligent automation, designed to scale with your operation and deliver measurable decisions.',
    'cap2.t1': 'Custom software',
    'cap2.t2': 'Machine learning',
    'cap2.t3': 'Computer vision',
    'cap2.t4': 'Generative AI & agents',
    'cap2.t5': 'Data analytics',
    'cap2.t6': 'Systems integration',
    'cap2.fig': 'Fig. 02 — Neural network · Software & AI',
    'cap3.title': 'Electrical Engineering & Telecommunications',
    'cap3.text': 'Design and deployment of electrical, electronic and communication systems to international standards, with an uncompromising focus on reliability.',
    'cap3.t1': 'Electrical design',
    'cap3.t2': 'Electronics & embedded systems',
    'cap3.t3': 'Networks & fiber optics',
    'cap3.t4': 'Radio frequency',
    'cap3.t5': 'Critical infrastructure',
    'cap3.t6': 'Regulatory compliance',
    'cap3.fig': 'Fig. 03 — Signal field · Electrical & Telecom',
    'cap4.title': 'Energy & Industry',
    'cap4.text': 'Solutions that cut operating costs and risk: energy efficiency, renewables, industrial automation and IoT for connected plants.',
    'cap4.t1': 'Energy efficiency',
    'cap4.t2': 'Renewable energy',
    'cap4.t3': 'Industrial automation',
    'cap4.t4': 'Industrial IoT',
    'cap4.t5': 'SCADA & telemetry',
    'cap4.t6': 'Predictive maintenance',
    'cap4.fig': 'Fig. 04 — Toroidal reactor · Energy & Industry',
    'cap5.title': 'Technology Consulting',
    'cap5.text': 'We advise executive teams on technology decisions: strategy, architecture, digital transformation and complex program management.',
    'cap5.t1': 'Technology strategy',
    'cap5.t2': 'Digital transformation',
    'cap5.t3': 'Solution architecture',
    'cap5.t4': 'Cybersecurity',
    'cap5.t5': 'Program management',
    'cap5.t6': 'Technical due diligence',
    'cap5.fig': 'Fig. 05 — Structural lattice · Consulting',
    'method.label': 'Method',
    'method.title': 'From the lab<br>to operation.',
    'method.intro': 'A process built to reduce uncertainty at every stage. We measure each solution’s maturity on the TRL scale (Technology Readiness Level), the standard used by NASA and the European Union.',
    'method.trl': 'Technology readiness level · TRL',
    'step1.title': 'Discover',
    'step1.text': 'Challenge assessment, business goals, constraints and success criteria.',
    'step2.title': 'Research',
    'step2.text': 'State of the art, hypotheses and technical and economic feasibility.',
    'step3.title': 'Prototype',
    'step3.text': 'Proof of concept and working prototype validated with real data.',
    'step4.title': 'Deploy',
    'step4.text': 'Detailed engineering, development, integration and commissioning.',
    'step5.title': 'Evolve',
    'step5.text': 'Operation, support, impact measurement and continuous improvement.',
    'sectors.label': 'Sectors',
    'sectors.title': 'Applied technology<br>where it matters most.',
    'sectors.intro': 'We bring research-grade solutions to industries where reliability, efficiency and security are not optional.',
    'sec1.title': 'Energy',
    'sec1.text': 'Generation, distribution, renewables and efficiency.',
    'sec2.title': 'Telecommunications',
    'sec2.text': 'Networks, connectivity and data infrastructure.',
    'sec3.title': 'Industry & manufacturing',
    'sec3.text': 'Automation, industrial IoT and process control.',
    'sec4.title': 'Public sector',
    'sec4.text': 'Digital government, infrastructure and critical services.',
    'sec5.title': 'Healthcare',
    'sec5.text': 'Clinical platforms, data and connected devices.',
    'sec6.title': 'Finance',
    'sec6.text': 'Analytics, automation and risk models.',
    'sec7.title': 'Logistics',
    'sec7.text': 'Traceability, route optimization and telemetry.',
    'sec8.title': 'Academia & research',
    'sec8.text': 'R&D partnerships, laboratories and transfer.',
    'about.label': 'About',
    'about.title': 'Laboratory rigor.<br>Execution speed.',
    'about.big.title': 'Made in the Caribbean.<br>Built for the world.',
    'about.big.text': 'From Santo Domingo, Xeniun brings together engineers, data scientists and energy and telecommunications specialists to design technology to international standards.',
    'p1.title': 'Scientific rigor',
    'p1.text': 'Every decision is backed by evidence, data and measurable tests.',
    'p2.title': 'End-to-end engineering',
    'p2.text': 'From hardware to software, from idea to operation: one accountable team.',
    'p3.title': 'Speed with method',
    'p3.text': 'Prototypes in weeks, not years, without compromising quality or security.',
    'p4.title': 'Confidentiality & IP',
    'p4.text': 'We protect your intellectual property and your data from day one.',
    'stat1': 'integrated practice areas',
    'stat2': 'TRL levels, from idea to operation',
    'stat3': 'the year we started',
    'stat4': 'view: hardware, software and strategy',
    'contact.label': 'Contact',
    'contact.title': 'Facing a challenge that <span class="grad">has no solution yet?</span>',
    'contact.text': 'Tell us what you want to achieve. A specialist from our team will review your case and reply personally.',
    'contact.write': 'Write to us',
    'contact.where': 'Location',
    'contact.city': 'Santo Domingo, Dominican Republic',
    'contact.follow': 'Follow us',
    'form.name': 'Name',
    'form.company': 'Company',
    'form.email': 'Work email',
    'form.area': 'Area of interest',
    'form.a1': 'R&D&I',
    'form.a2': 'Software & AI',
    'form.a3': 'Electrical & Telecom',
    'form.a4': 'Energy & Industry',
    'form.a5': 'Consulting',
    'form.message': 'What do you want to achieve?',
    'form.consent': 'I agree that Xeniun may use this data solely to respond to my request.',
    'form.submit': 'Send request',
    'footer.tagline': 'Technology research, development and innovation.',
    'footer.top': 'Back to top ↑',
    'footer.rights': 'All rights reserved.',
    // Runtime-only strings
    'form.err': 'Please complete the highlighted fields.',
    'form.sending': 'Sending…',
    'form.ok': 'Thank you. We have received your request and will be in touch shortly.',
    'form.mail': 'Opening your email client to send the request…',
    'form.fail': 'We could not send your request. Please write to us directly.'
  };

  var ES_RUNTIME = {
    'menu.open': 'Abrir menú',
    'menu.close': 'Cerrar menú',
    'form.err': 'Por favor completa los campos marcados.',
    'form.sending': 'Enviando…',
    'form.ok': 'Gracias. Hemos recibido tu solicitud y te contactaremos en breve.',
    'form.mail': 'Abriendo tu cliente de correo para enviar la solicitud…',
    'form.fail': 'No pudimos enviar tu solicitud. Escríbenos directamente.'
  };

  var ES = {};
  var lang = 'es';

  function harvestSpanish() {
    ES['meta.title'] = document.title;
    ES['meta.description'] = $('meta[name="description"]').getAttribute('content');
    $$('[data-i18n]').forEach(function (el) { ES[el.getAttribute('data-i18n')] = el.textContent.trim(); });
    $$('[data-i18n-html]').forEach(function (el) { ES[el.getAttribute('data-i18n-html')] = el.innerHTML.trim(); });
    Object.keys(ES_RUNTIME).forEach(function (k) { ES[k] = ES_RUNTIME[k]; });
  }

  function t(key) {
    var dict = lang === 'en' ? EN : ES;
    return dict[key] != null ? dict[key] : (ES[key] != null ? ES[key] : key);
  }

  function setLang(next, persist) {
    lang = next === 'en' ? 'en' : 'es';
    root.setAttribute('lang', lang);
    document.title = t('meta.title');
    $('meta[name="description"]').setAttribute('content', t('meta.description'));
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    $$('.lang__btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    splitWords();
    updateManifesto();
    if (persist) {
      try { localStorage.setItem('xeniun-lang', lang); } catch (e) { /* storage unavailable */ }
    }
  }

  function initialLang() {
    var saved = null;
    try { saved = localStorage.getItem('xeniun-lang'); } catch (e) { /* storage unavailable */ }
    if (saved === 'es' || saved === 'en') return saved;
    var nav = (navigator.language || 'es').toLowerCase();
    return nav.indexOf('es') === 0 ? 'es' : (nav.indexOf('en') === 0 ? 'en' : 'es');
  }

  /* ------------------------------------------------------------------
     Header: glass on scroll, hide on scroll down
     ------------------------------------------------------------------ */
  var header = $('#site-header');
  var lastY = window.scrollY;
  function onScrollHeader() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    var menuOpen = menuToggle && menuToggle.getAttribute('aria-expanded') === 'true';
    if (!menuOpen && y > 160 && y > lastY + 4) header.classList.add('is-hidden');
    else if (y < lastY - 4 || y <= 160) header.classList.remove('is-hidden');
    lastY = y;
  }

  /* ------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------ */
  var menuToggle = $('.menu-toggle');
  var mobileMenu = $('#mobile-menu');
  function setMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', t(open ? 'menu.close' : 'menu.open'));
    mobileMenu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) header.classList.remove('is-hidden');
  }
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', mobileMenu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { setMenu(false); menuToggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180) setMenu(false); });
  }

  /* ------------------------------------------------------------------
     Active nav link
     ------------------------------------------------------------------ */
  function initActiveNav() {
    var links = $$('.nav a');
    if (!('IntersectionObserver' in window) || !links.length) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        var link = map[en.target.id];
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'capacidades', 'metodo', 'sectores', 'nosotros', 'contacto'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  function initReveal() {
    var els = $$('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Manifesto: words light up as you read
     ------------------------------------------------------------------ */
  var manifesto = $('[data-split]');
  var words = [];
  function splitWords() {
    if (!manifesto) return;
    var text = manifesto.textContent.trim();
    manifesto.innerHTML = '';
    words = text.split(/\s+/).map(function (w, i, arr) {
      var span = document.createElement('span');
      span.className = 'w';
      span.textContent = w;
      manifesto.appendChild(span);
      if (i < arr.length - 1) manifesto.appendChild(document.createTextNode(' '));
      return span;
    });
  }
  function updateManifesto() {
    if (!manifesto || !words.length) return;
    var r = manifesto.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
    p = reduceMotion ? 1 : Math.max(0, Math.min(1, p));
    var n = Math.round(p * words.length);
    for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < n);
  }

  /* ------------------------------------------------------------------
     TRL meter fills with method section progress
     ------------------------------------------------------------------ */
  var trlBar = $('.trl__bar');
  var method = $('#metodo');
  function updateTRL() {
    if (!trlBar || !method) return;
    var r = method.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.75 - r.top) / (r.height * 0.75);
    p = reduceMotion ? 1 : Math.max(0, Math.min(1, p));
    trlBar.style.setProperty('--trl', p.toFixed(3));
  }

  /* ------------------------------------------------------------------
     Counters
     ------------------------------------------------------------------ */
  function initCounters() {
    var els = $$('[data-count]');
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    els.forEach(function (el) {
      var from = Number(el.getAttribute('data-count-from') || 0);
      el.textContent = String(from);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target;
        var to = Number(el.getAttribute('data-count'));
        var from = Number(el.getAttribute('data-count-from') || 0);
        var start = performance.now();
        var dur = 1600;
        (function step(now) {
          var k = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - k, 4);
          el.textContent = String(Math.round(from + (to - from) * eased));
          if (k < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Pointer effects: card spotlight + magnetic buttons
     ------------------------------------------------------------------ */
  function initPointer() {
    if (reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
    $$('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    $$('.magnetic').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18;
        var y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* ------------------------------------------------------------------
     Contact form — POST to data-endpoint if set, otherwise mailto
     ------------------------------------------------------------------ */
  function initForm() {
    var form = $('#contact-form');
    if (!form) return;
    var status = $('.form__status', form);

    function setStatus(msg, kind) {
      status.textContent = msg;
      status.className = 'form__status' + (kind ? ' is-' + kind : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('input[required], textarea[required]', form).forEach(function (input) {
        var valid = input.type === 'checkbox' ? input.checked : input.checkValidity() && input.value.trim() !== '';
        var holder = input.type === 'checkbox' ? input.closest('.consent') : input.closest('.field');
        if (holder) holder.classList.toggle('is-invalid', !valid);
        input.setAttribute('aria-invalid', String(!valid));
        if (!valid && ok) { ok = false; input.focus(); }
      });
      if (!ok) { setStatus(t('form.err'), 'error'); return; }

      var data = {
        name: form.name.value.trim(),
        company: form.company.value.trim(),
        email: form.email.value.trim(),
        area: (form.querySelector('input[name="area"]:checked') || {}).value || '',
        message: form.message.value.trim(),
        lang: lang
      };
      var endpoint = form.getAttribute('data-endpoint');

      if (endpoint) {
        setStatus(t('form.sending'));
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          setStatus(t('form.ok'), 'ok');
        }).catch(function () { setStatus(t('form.fail'), 'error'); });
        return;
      }

      var to = form.getAttribute('data-mailto');
      var subject = '[' + data.area + '] ' + data.name + (data.company ? ' — ' + data.company : '');
      var body = data.message + '\n\n—\n' + data.name + (data.company ? '\n' + data.company : '') + '\n' + data.email;
      setStatus(t('form.mail'), 'ok');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });

    $$('input, textarea', form).forEach(function (input) {
      input.addEventListener('input', function () {
        var holder = input.type === 'checkbox' ? input.closest('.consent') : input.closest('.field');
        if (holder) holder.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
      });
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  harvestSpanish();
  splitWords();
  var startLang = initialLang();
  if (startLang !== 'es') setLang(startLang, false);

  $$('.lang__btn').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
  });

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  initActiveNav();
  initReveal();
  initCounters();
  initPointer();
  initForm();

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScrollHeader();
      updateManifesto();
      updateTRL();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Fallback in case the 3D scene never reports ready (blocked script, old browser)
  setTimeout(function () { root.classList.add('is-ready'); }, 3500);
})();
