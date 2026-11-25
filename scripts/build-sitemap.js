// Builds sitemap.xml with EN/FR hreflang alternates. Reads the origin from robots.txt.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
const origin = (robots.match(/Sitemap:\s*(https:\/\/[^/\s]+)/) || [])[1];
if (!origin) throw new Error('robots.txt needs a Sitemap: line');

const pages = ['', 'about.html', 'projects.html', 'experience.html', 'learning.html', 'contact.html'];
const today = new Date().toISOString().slice(0, 10);
const url = (lang, page) => `${origin}/${lang === 'fr' ? 'fr/' : ''}${page}`;

const entry = (lang, page) => `  <url>
    <loc>${url(lang, page)}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${url('en', page)}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${url('fr', page)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url('en', page)}"/>
  </url>`;

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.flatMap((p) => [entry('en', p), entry('fr', p)]).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log('sitemap.xml written for ' + origin);
