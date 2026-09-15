// Generates public/robots.txt, public/llms.txt, public/llms-full.txt and public/servicios/<slug>.md
// from the site sources. Run after build-services.js and seo-pages.js (npm run build:pages).
const fs = require('fs');
const path = require('path');

const PUB = path.join(__dirname, '..', 'public');
const SITE = 'https://www.erizonn.com';
const content = JSON.parse(fs.readFileSync(path.join(__dirname, 'services-content.json'), 'utf8'));
const read = (f) => fs.readFileSync(path.join(PUB, f), 'utf8');

const decode = (s) => String(s)
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/\s+/g, ' ')
  .trim();

function faqsFrom(html) {
  const out = [];
  const re = /<details class="faq-item">\s*<summary>([\s\S]*?)<span class="faq-plus"[\s\S]*?<div class="faq-answer">\s*<p>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html))) out.push({ q: decode(m[1]), a: decode(m[2]) });
  return out;
}

function tilesFrom(html) {
  const out = [];
  const re = /<article class="tile[^"]*"[^>]*>[\s\S]*?<span class="tile-kicker">([\s\S]*?)<\/span>[\s\S]*?<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html))) out.push({ kicker: decode(m[1]), title: decode(m[2]), text: decode(m[3]) });
  return out;
}

function stepsFrom(html) {
  const out = [];
  const re = /<li class="timeline-step">[\s\S]*?<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html))) out.push({ title: decode(m[1]), text: decode(m[2]) });
  return out;
}

function listFrom(html, startMarker) {
  const i = html.indexOf(startMarker);
  if (i < 0) return [];
  const end = html.indexOf('</ul>', i);
  return [...html.slice(i, end).matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => decode(m[1]));
}

const between = (html, a, b) => {
  const i = html.indexOf(a);
  const j = html.indexOf(b, i);
  if (i < 0 || j < 0) throw new Error(`section not found: ${a}`);
  return html.slice(i, j);
};

const home = read('index.html');
const support = read('support.html');
const homeFaqs = faqsFrom(home);
const supportFaqs = faqsFrom(support);
const tiles = tilesFrom(home);
const steps = stepsFrom(home);
const sectors = listFrom(home, '<p class="sectors-label">');
const tech = listFrom(home, '<ul class="marquee-list">');

const whyHtml = between(home, 'id="why"', 'id="projects"');
const why = [...whyHtml.matchAll(/<div class="feature[^"]*"[^>]*>[\s\S]*?<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)].map((m) => ({ title: decode(m[1]), text: decode(m[2]) }));
const projectsHtml = between(home, 'id="projects"', 'id="faq"');
const projectsIntro = decode((projectsHtml.match(/<p class="section-subtitle">([\s\S]*?)<\/p>/) || [])[1] || '');
const projectTypes = [...projectsHtml.matchAll(/<div class="vault-info">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)].map((m) => ({ title: decode(m[1]), text: decode(m[2]) }));

if (homeFaqs.length < 6 || supportFaqs.length < 4 || tiles.length !== 7 || steps.length !== 4 || !sectors.length || !tech.length || why.length !== 6 || projectTypes.length !== 6 || !projectsIntro) {
  throw new Error(`extraction failed: faqs ${homeFaqs.length}/${supportFaqs.length}, tiles ${tiles.length}, steps ${steps.length}, sectors ${sectors.length}, tech ${tech.length}, why ${why.length}, projects ${projectTypes.length}`);
}

const LABEL = {
  'apps-moviles': 'Apps móviles',
  'desarrollo-web': 'Webs y landing pages',
  'shopify-ecommerce': 'Shopify y ecommerce',
  'integraciones-automatizacion': 'Integraciones y automatización',
  'inteligencia-artificial': 'IA aplicada',
  'plataformas-a-medida': 'Plataformas a medida',
  'marketing-digital': 'Marketing digital y Ads',
};
const pages = Object.keys(LABEL).map((slug) => {
  const p = content.find((c) => c.slug === slug);
  if (!p) throw new Error('missing content for ' + slug);
  return p;
});

const SUMMARY = 'Erizonn Media (también «Erizonn») es una agencia digital con sede en Madrid (España), fundada en 2020. Diseña, desarrolla y lanza apps móviles para iOS y Android, webs y landing pages, tiendas Shopify y ecommerce B2B, integraciones y automatizaciones, soluciones de inteligencia artificial aplicada con supervisión humana y plataformas de software a medida, y gestiona marketing digital (SEO, Google Ads y Social Ads).';

const FACTS = [
  'Nombre: Erizonn Media (también «Erizonn»). Razón social Erizonn Media S.L., CIF B42866798, IVA intracomunitario ESB42866798.',
  'Sede: Paseo Ermita del Santo 40, Local 1, 28011 Madrid, España.',
  'Contacto: apps@erizonn.com · +34 910 626 607 · lunes a viernes, 9:00–18:00 (hora de Madrid).',
  'Fundada en 2020. Trabaja en español con empresas de toda España.',
  'Web oficial: https://www.erizonn.com',
  `Sectores con experiencia: ${sectors.join('; ')}.`,
  `Tecnologías habituales: ${tech.join('; ')}.`,
  `Forma de trabajo: ${steps.map((s) => s.title).join(' → ')}, con entregas frecuentes.`,
  'Proyectos: Erizonn no publica casos ni clientes en su web; muestra proyectos similares bajo petición.',
];

// ---------- robots.txt ----------
const robots = `# Erizonn Media — ${SITE}
# Buscadores y asistentes de IA son bienvenidos a leer este sitio.
# Resumen para modelos de lenguaje: ${SITE}/llms.txt

User-agent: *
Allow: /

# Buscadores y asistentes de IA (búsqueda, respuestas y entrenamiento)
User-agent: Googlebot
User-agent: Bingbot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: GPTBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: ClaudeBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot
User-agent: Applebot-Extended
User-agent: DuckAssistBot
User-agent: Amazonbot
User-agent: Meta-ExternalAgent
User-agent: MistralAI-User
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

// ---------- per-service markdown ----------
const faqMd = (faqs, h) => faqs.map((f) => `${h} ${f.q}\n\n${f.a}`).join('\n\n');

function serviceBody(p, level) {
  // level: heading prefix for the service title ('#' in the .md file, '##' inside llms-full.txt)
  const sub = level + '#';
  const subsub = sub + '#';
  return `${decode(p.h1_html)}. ${p.lead}

${sub} Qué incluye

${p.deliverables_intro}

${p.deliverables.map((d) => `- **${d.title}:** ${d.text}`).join('\n')}

${sub} Casos de uso: ${decode(p.use_cases_title_html)}

${p.use_cases_intro}

${p.use_cases.map((u) => `- **${u.title}:** ${u.text}`).join('\n')}

${sub} Cómo lo hacemos: ${decode(p.approach_title_html)}

${p.approach_points.map((a) => `- **${a.title}:** ${a.text}`).join('\n')}

Tecnologías habituales: ${p.tech.join('; ')}.

${sub} Preguntas frecuentes

${faqMd(p.faqs, subsub)}

Contacto: apps@erizonn.com · +34 910 626 607.`;
}

for (const p of pages) {
  const url = `${SITE}/servicios/${p.slug}`;
  const md = `# ${LABEL[p.slug]} — Erizonn Media

> ${p.meta_description}

Versión HTML: ${url}

${serviceBody(p, '#')}
`;
  fs.writeFileSync(path.join(PUB, 'servicios', `${p.slug}.md`), md);
}

// ---------- llms.txt ----------
const llms = `# Erizonn Media

> ${SUMMARY}

${FACTS.map((f) => `- ${f}`).join('\n')}

## Servicios

${pages.map((p) => `- [${LABEL[p.slug]}](${SITE}/servicios/${p.slug}.md): ${p.meta_description} Versión HTML: ${SITE}/servicios/${p.slug}`).join('\n')}

## Empresa

- [Inicio](${SITE}/): Servicios, forma de trabajo, sectores y preguntas frecuentes de Erizonn Media.
- [Soporte y contacto](${SITE}/support.html): Canales de contacto, horario, datos fiscales y ayuda para usuarios de las apps de Erizonn Media.
- [Contenido completo en texto](${SITE}/llms-full.txt): Todo el contenido de la web en un único documento Markdown.

## Optional

- [Política de privacidad](${SITE}/privacy.html): Tratamiento de datos personales en las apps y servicios de Erizonn Media.
- [Términos de uso](${SITE}/terms.html): Condiciones de uso de las apps y servicios.
- [Eliminación de datos](${SITE}/data-deletion.html): Cómo solicitar la eliminación de una cuenta y sus datos.
`;

// ---------- llms-full.txt ----------
const section = (title, body) => `## ${title}\n\n${body.trim()}\n`;

const full = `# Erizonn Media — contenido completo

> ${SUMMARY}

Fuente: ${SITE} · Idioma: español (España)

${section('Datos de la empresa', FACTS.map((f) => `- ${f}`).join('\n'))}
${section('Servicios (resumen)', tiles.map((t) => `- **${t.title}** (${t.kicker}): ${t.text}`).join('\n'))}
${section('Cómo trabajamos', steps.map((s, i) => `${i + 1}. **${s.title}:** ${s.text}`).join('\n'))}
${section('Por qué Erizonn', why.map((w) => `- **${w.title}:** ${w.text}`).join('\n'))}
${section('Tipos de proyectos', `${projectsIntro}\n\n${projectTypes.map((t) => `- **${t.title}:** ${t.text}`).join('\n')}`)}
${section('Preguntas frecuentes', faqMd(homeFaqs, '###'))}
# Servicios en detalle

${pages.map((p) => `## ${LABEL[p.slug]}\n\nURL: ${SITE}/servicios/${p.slug}\n\n${serviceBody(p, '##')}\n`).join('\n')}
# Soporte para usuarios de las apps

URL: ${SITE}/support.html

${faqMd(supportFaqs, '##')}

# Contacto

Escribe a apps@erizonn.com o llama al +34 910 626 607 (lunes a viernes, 9:00–18:00, hora de Madrid). Respuesta en menos de 48 horas.
`;

fs.writeFileSync(path.join(PUB, 'robots.txt'), robots);
fs.writeFileSync(path.join(PUB, 'llms.txt'), llms);
fs.writeFileSync(path.join(PUB, 'llms-full.txt'), full);
console.log('robots.txt', robots.length, 'llms.txt', llms.length, 'llms-full.txt', full.length, 'md pages', pages.length);
console.log('home faqs', homeFaqs.length, 'support faqs', supportFaqs.length, 'why', why.length, 'project types', projectTypes.length);
