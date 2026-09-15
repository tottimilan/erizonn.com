// SEO pass for the hand-written pages: robots meta, JSON-LD graphs built from visible content,
// extra "¿Qué es Erizonn?" FAQ and contextual links to service pages on the home page.
const fs = require('fs');
const path = require('path');

const PUB = path.join(__dirname, '..', 'public');
const SITE = 'https://www.erizonn.com';
const MODIFIED = '2026-09-15';
const ROBOTS_META = '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">';

const SERVICE_LABELS = [
  ['apps-moviles', 'Apps móviles'],
  ['desarrollo-web', 'Webs y landing pages'],
  ['shopify-ecommerce', 'Shopify y ecommerce'],
  ['integraciones-automatizacion', 'Integraciones y automatización'],
  ['inteligencia-artificial', 'IA aplicada'],
  ['plataformas-a-medida', 'Plataformas a medida'],
  ['marketing-digital', 'Marketing digital y Ads'],
];
const CONTENT = JSON.parse(fs.readFileSync(path.join(__dirname, 'services-content.json'), 'utf8'));
const SERVICES = SERVICE_LABELS.map(([slug, name]) => {
  const p = CONTENT.find((c) => c.slug === slug);
  if (!p) throw new Error('missing content for ' + slug);
  return [slug, name, p.service_type];
});
const MONTHS = { enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12 };
function visibleUpdated(html, label) {
  const m = html.match(/<p class="updated">Última actualización: (\d{1,2}) de ([a-záéíóú]+) de (\d{4})<\/p>/);
  if (!m || !MONTHS[m[2]]) throw new Error(label + ': visible update date not found');
  return `${m[3]}-${String(MONTHS[m[2]]).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

const read = (f) => fs.readFileSync(path.join(PUB, f), 'utf8').replace(/\r\n/g, '\n');
const write = (f, s) => fs.writeFileSync(path.join(PUB, f), s);
const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const jsonld = (obj) => '  <script type="application/ld+json">\n' + JSON.stringify(obj, null, 2).replace(/</g, '\\u003c').split('\n').map((l) => '    ' + l).join('\n') + '\n  </script>';

function replaceOnce(h, a, b, label) {
  const n = h.split(a).length - 1;
  if (n !== 1) throw new Error(`${label}: expected 1 match, got ${n}: ${a.slice(0, 80)}`);
  return h.replace(a, b);
}

function faqsFrom(html) {
  const out = [];
  const re = /<details class="faq-item">\s*<summary>([\s\S]*?)<span class="faq-plus"[\s\S]*?<div class="faq-answer">\s*<p>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html))) out.push({ q: decode(m[1]), a: decode(m[2]) });
  return out;
}

function meta(html, name) {
  const m = html.match(new RegExp(`<meta name="${name}" content="([^"]*)">`));
  return m ? m[1] : '';
}
const titleOf = (html) => decode(html.match(/<title>([\s\S]*?)<\/title>/)[1]);

function setHeadSeo(html, graph, label) {
  // robots meta
  html = html.replace(/  <meta name="robots" content="index, follow[^"]*">/, '  ' + ROBOTS_META);
  if (!html.includes(ROBOTS_META)) throw new Error(label + ': robots meta not set');
  // replace existing JSON-LD or insert before the font preload
  const block = jsonld(graph);
  if (/  <script type="application\/ld\+json">[\s\S]*?<\/script>/.test(html)) {
    html = html.replace(/  <script type="application\/ld\+json">[\s\S]*?<\/script>/, block);
  } else {
    html = replaceOnce(html, '  <link rel="preload" href="/fonts/geist-latin-var.woff2"', block + '\n  <link rel="preload" href="/fonts/geist-latin-var.woff2"', label);
  }
  return html;
}

const ORG_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;
const orgRef = { '@id': ORG_ID };

const organization = {
  '@type': 'ProfessionalService',
  '@id': ORG_ID,
  name: 'Erizonn Media',
  legalName: 'Erizonn Media S.L.',
  alternateName: 'Erizonn',
  url: `${SITE}/`,
  logo: { '@type': 'ImageObject', url: `${SITE}/logo-512.png`, width: 512, height: 512 },
  image: `${SITE}/og-image.jpg`,
  description: 'Agencia digital en Madrid fundada en 2020. Desarrollo de apps móviles, webs, tiendas Shopify y ecommerce B2B, integraciones y automatización, inteligencia artificial aplicada, plataformas a medida y marketing digital.',
  foundingDate: '2020',
  taxID: 'B42866798',
  vatID: 'ESB42866798',
  telephone: '+34 910 626 607',
  email: 'apps@erizonn.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Paseo Ermita del Santo 40, Local 1',
    addressLocality: 'Madrid',
    addressRegion: 'Comunidad de Madrid',
    postalCode: '28011',
    addressCountry: 'ES',
  },
  hasMap: 'https://www.google.com/maps/search/?api=1&query=Paseo%20Ermita%20del%20Santo%2040%2C%2028011%20Madrid',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  areaServed: { '@type': 'Country', name: 'España' },
  knowsLanguage: 'es',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'apps@erizonn.com',
    telephone: '+34 910 626 607',
    areaServed: 'ES',
    availableLanguage: ['Spanish'],
  },
  knowsAbout: ['Desarrollo de apps móviles', 'React Native', 'Desarrollo web', 'Next.js', 'Astro', 'Shopify', 'Ecommerce B2B', 'Integraciones con ERP', 'Automatización de procesos', 'WhatsApp Business API', 'Inteligencia artificial aplicada', 'Plataformas de formación online', 'SEO', 'Google Ads', 'Social Ads'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de Erizonn',
    itemListElement: SERVICES.map(([slug, name, type]) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', '@id': `${SITE}/servicios/${slug}#service`, name, serviceType: type, url: `${SITE}/servicios/${slug}` },
    })),
  },
};

const orgSummary = {
  '@type': 'ProfessionalService',
  '@id': ORG_ID,
  name: organization.name,
  legalName: organization.legalName,
  url: organization.url,
  email: organization.email,
  telephone: organization.telephone,
  address: organization.address,
};

const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE}/`,
  name: 'Erizonn Media',
  alternateName: 'Erizonn',
  inLanguage: 'es-ES',
  publisher: orgRef,
};

function webPage(html, url, type = 'WebPage', extra = {}) {
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name: titleOf(html),
    description: meta(html, 'description'),
    inLanguage: 'es-ES',
    isPartOf: { '@id': WEBSITE_ID },
    about: orgRef,
    publisher: orgRef,
    primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/og-image.jpg` },
    dateModified: MODIFIED,
    ...extra,
  };
}

const breadcrumb = (url, name) => ({
  '@type': 'BreadcrumbList',
  '@id': `${url}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name, item: url },
  ],
});

const faqPage = (url, faqs) => ({
  '@type': 'FAQPage',
  '@id': `${url}#faq`,
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

// ---------------- index.html ----------------
let home = read('index.html');

const WHAT_Q = '¿Qué es Erizonn Media?';
if (!home.includes(`<summary>${WHAT_Q}`)) {
  const firstFaq = '          <details class="faq-item">\n            <summary>¿Cuánto cuesta un proyecto?';
  const whatFaq = `          <details class="faq-item">
            <summary>${WHAT_Q}<span class="faq-plus" aria-hidden="true"></span></summary>
            <div class="faq-answer">
              <p>Erizonn Media es una agencia digital de Madrid fundada en 2020. Diseñamos y desarrollamos <a href="/servicios/apps-moviles">apps móviles</a>, <a href="/servicios/desarrollo-web">webs</a>, <a href="/servicios/shopify-ecommerce">tiendas Shopify</a>, <a href="/servicios/integraciones-automatizacion">integraciones</a>, <a href="/servicios/inteligencia-artificial">soluciones de IA aplicada</a> y <a href="/servicios/plataformas-a-medida">plataformas a medida</a>, y gestionamos <a href="/servicios/marketing-digital">marketing digital</a> para empresas de toda España.</p>
            </div>
          </details>
`;
  home = replaceOnce(home, firstFaq, whatFaq + firstFaq, 'home what faq');
}

// Contextual links inside existing answers (visible text unchanged).
const linkPairs = [
  ['<p>Sí. Integramos Shopify con ERP, pasarelas de pago,', '<p>Sí. <a href="/servicios/integraciones-automatizacion">Integramos Shopify con ERP</a>, pasarelas de pago,'],
  ['<p>Donde aporta valor real: asistentes que preparan respuestas,', '<p>Donde aporta valor real: <a href="/servicios/inteligencia-artificial">asistentes que preparan respuestas</a>,'],
];
for (const [a, b] of linkPairs) if (!home.includes(b)) home = replaceOnce(home, a, b, 'home link');

const homeFaqs = faqsFrom(home);
if (homeFaqs.length !== 7 || homeFaqs[0].q !== WHAT_Q) throw new Error('home faqs unexpected: ' + homeFaqs.length);

home = setHeadSeo(home, {
  '@context': 'https://schema.org',
  '@graph': [
    organization,
    website,
    webPage(home, `${SITE}/`, 'WebPage', { mainEntity: orgRef }),
    faqPage(`${SITE}/`, homeFaqs),
  ],
}, 'index');
write('index.html', home);
console.log('index.html: faqs', homeFaqs.length);

// ---------------- support.html ----------------
let support = read('support.html');
const supportFaqs = faqsFrom(support);
if (supportFaqs.length < 4) throw new Error('support faqs not found');
support = setHeadSeo(support, {
  '@context': 'https://schema.org',
  '@graph': [
    webPage(support, `${SITE}/support.html`, 'ContactPage', { breadcrumb: { '@id': `${SITE}/support.html#breadcrumb` } }),
    breadcrumb(`${SITE}/support.html`, 'Soporte y contacto'),
    faqPage(`${SITE}/support.html`, supportFaqs),
    { ...organization, hasOfferCatalog: undefined, knowsAbout: undefined },
  ],
}, 'support');
write('support.html', support);
console.log('support.html: faqs', supportFaqs.length);

// ---------------- legal pages ----------------
for (const [file, name] of [['privacy.html', 'Política de privacidad'], ['terms.html', 'Términos de uso'], ['data-deletion.html', 'Eliminación de datos']]) {
  let h = read(file);
  const url = `${SITE}/${file}`;
  h = setHeadSeo(h, {
    '@context': 'https://schema.org',
    '@graph': [
      webPage(h, url, 'WebPage', { dateModified: visibleUpdated(h, file) }),
      orgSummary,
    ],
  }, file);
  write(file, h);
  console.log(file, 'updated');
}
