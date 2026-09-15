const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(compression());

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

app.get('/favicon.ico', (req, res) => {
  res.redirect(301, '/favicon.svg');
});

// Keep a single URL per page: legacy pages live at *.html, service pages without extension.
const querySuffix = (req) => {
  const i = req.originalUrl.indexOf('?');
  return i === -1 ? '' : req.originalUrl.slice(i);
};

app.get(['/index', '/index.html'], (req, res) => {
  res.redirect(301, `/${querySuffix(req)}`);
});

app.get(/^\/(support|privacy|terms|data-deletion)\/?$/, (req, res) => {
  res.redirect(301, `/${req.params[0]}.html${querySuffix(req)}`);
});

app.get(/^\/servicios\/?$/, (req, res) => {
  res.redirect(301, '/#services');
});

app.get(/^\/servicios\/([a-z0-9-]+)(?:\.html|\/)$/, (req, res) => {
  res.redirect(301, `/servicios/${req.params[0]}${querySuffix(req)}`);
});

app.get(['/404', '/404.html'], (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.xml')) {
      res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
    }
    if (filePath.endsWith('.txt')) {
      res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    }
    if (filePath.endsWith('.woff2')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
}));

app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
