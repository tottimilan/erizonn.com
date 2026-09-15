// Builds public/servicios/*.html from services-content.json and refreshes the shared footer on every page.
// Usage: npm run build:pages  (or node scripts/build-services.js [services-content.json])
const fs = require('fs');
const path = require('path');

const PUB = path.join(__dirname, '..', 'public');
const SITE = 'https://www.erizonn.com';
const contentFile = process.argv[2] || path.join(__dirname, 'services-content.json');
const MODIFIED = '2026-09-15';

const SERVICES = [
  ['apps-moviles', 'Apps móviles'],
  ['desarrollo-web', 'Webs y landing pages'],
  ['shopify-ecommerce', 'Shopify y ecommerce'],
  ['integraciones-automatizacion', 'Integraciones y automatización'],
  ['inteligencia-artificial', 'IA aplicada'],
  ['plataformas-a-medida', 'Plataformas a medida'],
  ['marketing-digital', 'Marketing digital y Ads'],
];
const LABEL = Object.fromEntries(SERVICES);
const FAQ_TOPIC = {
  'apps-moviles': 'apps móviles',
  'desarrollo-web': 'webs y landings',
  'shopify-ecommerce': 'Shopify y ecommerce',
  'integraciones-automatizacion': 'integraciones',
  'inteligencia-artificial': 'IA aplicada',
  'plataformas-a-medida': 'plataformas a medida',
  'marketing-digital': 'marketing y Ads',
};

const ICONS = {
  phone: '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  layout: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  bag: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  trending: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  megaphone: '<path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  message: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  card: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
  workflow: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  tel: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
};
const TILE_ICON = {
  'apps-moviles': 'phone', 'desarrollo-web': 'layout', 'shopify-ecommerce': 'bag', 'integraciones-automatizacion': 'link',
  'inteligencia-artificial': 'sparkles', 'plataformas-a-medida': 'layers', 'marketing-digital': 'trending',
};

const svg = (key, { width = 2, cls = '' } = {}) => {
  if (!ICONS[key]) throw new Error('unknown icon ' + key);
  return `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[key]}</svg>`;
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Allow only a single <span class="grad-text">…</span> in *_html fields.
const safeHtml = (s) => {
  const m = String(s).match(/^(.*?)<span class="grad-text">(.*?)<\/span>(.*)$/s);
  if (!m) return esc(s);
  if (/[<>]/.test(m[1] + m[2] + m[3])) throw new Error('unexpected markup in: ' + s);
  return `${esc(m[1])}<span class="grad-text">${esc(m[2])}</span>${esc(m[3])}`;
};
const plain = (s) => String(s).replace(/<[^>]+>/g, '');
const jsonld = (obj) => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c').split('\n').map((l) => '    ' + l).join('\n');

const navBlock = (currentPath) => `  <a class="skip-link" href="#main">Saltar al contenido</a>

  <nav class="nav" aria-label="Principal">
    <div class="nav-inner">
      <a href="/" class="nav-logo" aria-label="Erizonn — Inicio">erizonn<span>.</span></a>
      <button class="nav-toggle" id="navToggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="navLinks">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="navLinks">
        <li><a href="/#services">Servicios</a></li>
        <li><a href="/#process">Cómo trabajamos</a></li>
        <li><a href="/#projects">Proyectos</a></li>
        <li><a href="/support.html"${currentPath === '/support.html' ? ' aria-current="page"' : ''}>Soporte</a></li>
        <li><a href="${currentPath === '/' || currentPath.startsWith('/servicios/') ? '' : '/'}#contact" class="nav-cta">Contactar</a></li>
      </ul>
    </div>
  </nav>`;

const footerBlock = (onHome) => {
  const h = (anchor) => (onHome ? anchor : '/' + anchor);
  return `  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-brand">
          <a href="/" class="nav-logo" aria-label="Erizonn — Inicio">erizonn<span>.</span></a>
          <p class="footer-tagline">Agencia digital en Madrid desde 2020. Apps, webs, ecommerce, automatización e IA aplicada.</p>
        </div>
        <div>
          <h2>Empresa</h2>
          <ul class="footer-links">
            <li><a href="${h('#process')}">Cómo trabajamos</a></li>
            <li><a href="${h('#projects')}">Proyectos</a></li>
            <li><a href="${h('#faq')}">Preguntas frecuentes</a></li>
            <li><a href="/support.html">Soporte</a></li>
          </ul>
        </div>
        <div>
          <h2>Servicios</h2>
          <ul class="footer-links">
${SERVICES.map(([slug, label]) => `            <li><a href="/servicios/${slug}">${label}</a></li>`).join('\n')}
          </ul>
        </div>
        <div>
          <h2>Legal</h2>
          <ul class="footer-links">
            <li><a href="/privacy.html">Política de Privacidad</a></li>
            <li><a href="/terms.html">Términos de Uso</a></li>
            <li><a href="/data-deletion.html">Eliminación de Datos</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h2>Contacto</h2>
          <ul class="footer-links">
            <li><a href="mailto:apps@erizonn.com">apps@erizonn.com</a></li>
            <li><a href="tel:+34910626607">+34 910 626 607</a></li>
            <li>Paseo Ermita del Santo&nbsp;40<br>Local 1 · 28011 Madrid</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2020–2026 Erizonn Media S.L. Todos los derechos reservados.</span>
        <span>CIF B42866798 · Madrid, España</span>
      </div>
    </div>
    <div class="footer-wordmark" aria-hidden="true">erizonn<span>.</span></div>
  </footer>`;
};

const HEAD_JS = `<script>document.documentElement.classList.add('js');setTimeout(function(){if(!window.__ezReady)document.documentElement.classList.remove('js')},3000)</script>`;

function servicePage(p) {
  const url = `${SITE}/servicios/${p.slug}`;
  const name = LABEL[p.slug];
  if (!name) throw new Error('unknown slug ' + p.slug);
  const related = p.related.filter((s) => LABEL[s] && s !== p.slug);
  if (related.length !== 3) throw new Error(`${p.slug}: related must be 3 valid slugs, got ${p.related}`);
  const allPages = contentBySlug;
  for (const d of p.deliverables) if (!ICONS[d.icon]) throw new Error(`${p.slug}: bad icon ${d.icon}`);

  const ogImage = `${SITE}/og/${p.slug}.jpg`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: p.title_tag,
        description: p.meta_description,
        inLanguage: 'es-ES',
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': `${url}#service` },
        mainEntity: { '@id': `${url}#service` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 },
        dateModified: MODIFIED,
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name,
        serviceType: p.service_type,
        description: p.meta_description,
        url,
        image: ogImage,
        areaServed: { '@type': 'Country', name: 'España' },
        mainEntityOfPage: { '@id': `${url}#webpage` },
        provider: { '@type': 'ProfessionalService', '@id': `${SITE}/#organization`, name: 'Erizonn Media', legalName: 'Erizonn Media S.L.', url: `${SITE}/`, email: 'apps@erizonn.com', telephone: '+34 910 626 607', address: { '@type': 'PostalAddress', streetAddress: 'Paseo Ermita del Santo 40, Local 1', addressLocality: 'Madrid', addressRegion: 'Comunidad de Madrid', postalCode: '28011', addressCountry: 'ES' } },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Servicios', item: `${SITE}/#services` },
          { '@type': 'ListItem', position: 3, name, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  const mailSubject = encodeURIComponent(`Proyecto: ${name}`);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(p.title_tag)}</title>
  <meta name="description" content="${esc(p.meta_description)}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta name="theme-color" content="#07070d">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${url}">
  <link rel="alternate" type="text/markdown" href="/servicios/${p.slug}.md">
  <meta property="og:locale" content="es_ES">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Erizonn Media">
  <meta property="og:title" content="${esc(p.title_tag)}">
  <meta property="og:description" content="${esc(p.og_description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(name)} — Erizonn, agencia digital en Madrid">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(p.title_tag)}">
  <meta name="twitter:description" content="${esc(p.og_description)}">
  <meta name="twitter:image" content="${ogImage}">
  <script type="application/ld+json">
${jsonld(graph)}
  </script>
  <link rel="preload" href="/fonts/geist-latin-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/css/style.css">
  ${HEAD_JS}
</head>
<body>

${navBlock('/servicios/' + p.slug)}

  <main id="main">

    <header class="page-header">
      <div class="hero-bg" aria-hidden="true">
        <span class="blob blob--1"></span>
        <span class="blob blob--2"></span>
        <span class="noise"></span>
      </div>
      <div class="container">
        <nav class="breadcrumb" aria-label="Migas de pan">
          <ol>
            <li><a href="/">Inicio</a></li>
            <li><a href="/#services">Servicios</a></li>
            <li><span aria-current="page">${esc(name)}</span></li>
          </ol>
        </nav>
        <span class="eyebrow">${esc(p.eyebrow)}</span>
        <h1>${safeHtml(p.h1_html)}</h1>
        <p>${esc(p.lead)}</p>
        <div class="hero-cta">
          <a href="#contact" class="btn btn--primary">
            Cuéntanos tu proyecto
            ${svg('arrow', { cls: 'arrow' })}
          </a>
          <a href="#incluye" class="btn btn--ghost">Qué incluye</a>
        </div>
        <ul class="hero-points">
${p.hero_points.map((t) => `          <li>${svg('check', { width: 2.5 })}${esc(t)}</li>`).join('\n')}
        </ul>
      </div>
    </header>

    <section class="section" id="incluye" aria-labelledby="incluye-title">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Qué incluye</span>
          <h2 class="section-title" id="incluye-title">${safeHtml(p.deliverables_title_html)}</h2>
          <p class="section-subtitle">${esc(p.deliverables_intro)}</p>
        </div>
        <div class="service-grid">
${p.deliverables.map((d, i) => `          <div class="feature reveal"${i % 3 ? ` style="--d:.${String(i % 3 * 6).padStart(2, '0')}s"` : ''}>
            <span class="feature-icon">${svg(d.icon)}</span>
            <h3>${esc(d.title)}</h3>
            <p>${esc(d.text)}</p>
          </div>`).join('\n')}
        </div>
      </div>
    </section>

    <section class="section" id="casos" aria-labelledby="casos-title">
      <span class="divider-glow" aria-hidden="true"></span>
      <div class="container split">
        <div class="split-sticky reveal">
          <div class="section-head">
            <span class="eyebrow">Casos de uso</span>
            <h2 class="section-title" id="casos-title">${safeHtml(p.use_cases_title_html)}</h2>
            <p class="section-subtitle">${esc(p.use_cases_intro)}</p>
          </div>
        </div>
        <ol class="usecases">
${p.use_cases.map((u) => `          <li class="usecase reveal">
            <h3>${esc(u.title)}</h3>
            <p>${esc(u.text)}</p>
          </li>`).join('\n')}
        </ol>
      </div>
    </section>

    <section class="section" id="enfoque" aria-labelledby="enfoque-title">
      <span class="divider-glow" aria-hidden="true"></span>
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Cómo lo hacemos</span>
          <h2 class="section-title" id="enfoque-title">${safeHtml(p.approach_title_html)}</h2>
        </div>
        <ul class="approach reveal">
${p.approach_points.map((a) => `          <li>
            <span class="approach-check">${svg('check', { width: 3 })}</span>
            <h3>${esc(a.title)}</h3>
            <p>${esc(a.text)}</p>
          </li>`).join('\n')}
        </ul>
        <div class="tech-row reveal">
          <p class="sectors-label">Tecnologías habituales</p>
          <ul class="chips">
${p.tech.map((t) => `            <li>${esc(t)}</li>`).join('\n')}
          </ul>
        </div>
      </div>
    </section>

    <section class="section" id="faq" aria-labelledby="faq-title">
      <span class="divider-glow" aria-hidden="true"></span>
      <div class="container split">
        <div class="split-sticky reveal">
          <div class="section-head">
            <span class="eyebrow">Preguntas frecuentes</span>
            <h2 class="section-title" id="faq-title">Dudas sobre <span class="grad-text">${esc(FAQ_TOPIC[p.slug])}</span></h2>
          </div>
          <div class="faq-aside">
            <p>¿Tienes otra pregunta? Escríbenos y te contestamos en menos de 48 horas.</p>
            <a href="mailto:apps@erizonn.com?subject=${mailSubject}" class="btn btn--ghost">apps@erizonn.com</a>
          </div>
        </div>
        <div class="faq reveal">
${p.faqs.map((f) => `          <details class="faq-item">
            <summary>${esc(f.q)}<span class="faq-plus" aria-hidden="true"></span></summary>
            <div class="faq-answer">
              <p>${esc(f.a)}</p>
            </div>
          </details>`).join('\n')}
        </div>
      </div>
    </section>

    <section class="section" id="relacionados" aria-labelledby="related-title">
      <span class="divider-glow" aria-hidden="true"></span>
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Otros servicios</span>
          <h2 class="section-title" id="related-title">Lo que suele ir de la mano</h2>
        </div>
        <div class="related">
${related.map((s, i) => {
    const rp = allPages[s];
    return `          <article class="tile reveal"${i ? ` style="--d:.${String(i * 8).padStart(2, '0')}s"` : ''}>
            <div class="tile-top">
              <span class="tile-icon${s === 'inteligencia-artificial' ? ' tile-icon--violet' : ''}">${svg(TILE_ICON[s])}</span>
            </div>
            <h3>${esc(LABEL[s])}</h3>
            <p>${esc(rp ? rp.og_description : '')}</p>
            <a class="tile-link" href="/servicios/${s}">Ver servicio<span class="visually-hidden">: ${esc(LABEL[s])}</span> ${svg('arrow')}</a>
          </article>`;
  }).join('\n')}
        </div>
      </div>
    </section>

    <section class="section" id="contact" aria-labelledby="contact-title">
      <div class="container">
        <div class="cta reveal">
          <span class="eyebrow">Contacto</span>
          <h2 class="cta-title" id="contact-title">${safeHtml(p.cta_title_html)}</h2>
          <p class="cta-text">${esc(p.cta_text)}</p>
          <div class="cta-actions">
            <a href="mailto:apps@erizonn.com?subject=${mailSubject}" class="btn btn--primary btn--lg">
              ${svg('mail')}
              apps@erizonn.com
            </a>
            <a href="tel:+34910626607" class="btn btn--ghost btn--lg">
              ${svg('tel')}
              +34 910 626 607
            </a>
          </div>
          <ul class="cta-meta">
            <li>${svg('clock')}Lunes a viernes, 9:00 – 18:00 (hora de Madrid)</li>
            <li>${svg('pin')}Paseo Ermita del Santo 40, Madrid</li>
          </ul>
        </div>
      </div>
    </section>

  </main>

${footerBlock(false)}

  <script src="/js/main.js" defer onerror="document.documentElement.classList.remove('js')"></script>

</body>
</html>
`;
}

let contentBySlug = {};
if (fs.existsSync(contentFile)) {
  const pages = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
  contentBySlug = Object.fromEntries(pages.map((p) => [p.slug, p]));
  fs.mkdirSync(path.join(PUB, 'servicios'), { recursive: true });
  for (const p of pages) {
    fs.writeFileSync(path.join(PUB, 'servicios', p.slug + '.html'), servicePage(p));
    console.log('built servicios/' + p.slug + '.html');
  }
}

// Refresh the shared footer on existing pages.
for (const file of ['index.html', 'support.html', 'privacy.html', 'terms.html', 'data-deletion.html', '404.html']) {
  const p = path.join(PUB, file);
  let h = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
  const re = /  <footer class="footer">[\s\S]*?<\/footer>/;
  if (!re.test(h)) throw new Error('no footer in ' + file);
  h = h.replace(re, footerBlock(file === 'index.html'));
  fs.writeFileSync(p, h);
}
console.log('footers refreshed');

module.exports = { SERVICES, LABEL };
