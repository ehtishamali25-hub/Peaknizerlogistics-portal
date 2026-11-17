// scripts/prerender.mjs
// Turns the public pages of the site into real HTML files after "vite build",
// so Google, Bing and AI assistants get the full page text without running JavaScript.
//
// It runs automatically as part of:  npm run build   (see package.json)
// It needs Chromium once on each machine:  npx playwright install chromium
//
// Which pages: every page listed in src/seo/seoPages.js. To pre-render a new page
// (for example /faq), add it to seoPages.js. On Render, also add a Rewrite rule for it
// ( /faq -> /faq/index.html ) above the "/*" rule.
//
// What it writes into dist/:
//   index.html             the homepage, as finished HTML
//   <page>/index.html      every other public page (dist/services/index.html, ...)
//   app.html               the plain app shell for login, portal pages and unknown addresses.
//                          It is marked "noindex", so those addresses stay out of Google.
//
// If any page fails, the build fails, and Render keeps the version that is live now.

import { chromium } from 'playwright';
import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { SEO_PAGES, SITE } from '../src/seo/seoPages.js';

const DIST = path.resolve('dist');
const PORT = 4179;
const LOCAL = `http://localhost:${PORT}`;
const ROUTES = Object.keys(SEO_PAGES);
const MIN_WORDS = 50;

const MIME = {
  '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.html': 'text/html',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.gif': 'image/gif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.txt': 'text/plain', '.xml': 'application/xml',
};

// 1. Keep the untouched app shell, and save the "noindex" copy as dist/app.html
const shell = await readFile(path.join(DIST, 'index.html'), 'utf8');
if (!shell.includes('<div id="root"></div>')) {
  console.error('dist/index.html is not the plain app shell. Run "vite build" before this script.');
  process.exit(1);
}
const appShell = shell
  .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, nofollow" />')
  .replace(/\s*<link rel="canonical"[^>]*>/, '')
  .replace(/\s*<meta property="og:url"[^>]*>/, '');
if (!appShell.includes('content="noindex, nofollow"')) {
  console.error('Could not add the noindex tag to app.html. Check the robots tag in index.html.');
  process.exit(1);
}
await writeFile(path.join(DIST, 'app.html'), appShell);

// 2. A small local server: real files when they exist, otherwise the app shell (like the live site)
const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, LOCAL).pathname);
    const file = path.join(DIST, urlPath);
    if (file.startsWith(DIST) && existsSync(file) && statSync(file).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(await readFile(file));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(shell);
    }
  } catch {
    res.writeHead(400);
    res.end();
  }
});
await new Promise((resolve) => server.listen(PORT, resolve));

const browser = await chromium.launch();
const results = [];
let failed = 0;

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  // Only this local copy of the site is loaded. Calls to the backend, fonts or other
  // websites are blocked, so a sleeping server can never stop the build.
  await page.route('**/*', (r) => (r.request().url().startsWith(LOCAL) ? r.continue() : r.abort()));

  try {
    await page.goto(LOCAL + route, { waitUntil: 'load', timeout: 60000 });

    // Wait until RouteSeo has set this page's own title
    const wantTitle = SEO_PAGES[route].title;
    await page.waitForFunction((t) => document.title === t, wantTitle, { timeout: 20000 });

    // Wait until the page text stops changing (counters and animations have finished)
    await page.waitForFunction(() => {
      const text = document.querySelector('#root')?.innerText || '';
      const w = window;
      if (text.trim().length < 50 || text !== w.__lastText) {
        w.__lastText = text;
        w.__sameSince = Date.now();
        return false;
      }
      return Date.now() - w.__sameSince > 1200;
    }, null, { timeout: 20000, polling: 200 });
    await page.waitForTimeout(300);

    const info = await page.evaluate(() => ({
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') || '',
      words: (document.querySelector('#root')?.innerText || '').split(/\s+/).filter(Boolean).length,
    }));

    const wantCanonical = SITE + (route === '/' ? '/' : route);
    if (info.h1.includes('Page not found')) throw new Error('the app showed "Page not found" (is the route in App.jsx?)');
    if (info.canonical !== wantCanonical) throw new Error(`canonical is "${info.canonical}", expected "${wantCanonical}"`);
    if (info.robots !== 'index, follow') throw new Error(`robots tag is "${info.robots}"`);
    if (info.words < MIN_WORDS) throw new Error(`only ${info.words} words of text`);

    // Clean up the head: exactly one of each SEO tag, and no <noscript> fallback
    // (the page itself is real HTML now)
    await page.evaluate(() => {
      document.querySelectorAll('body noscript').forEach((n) => n.remove());
      const keyOf = (el) =>
        el.tagName === 'META' ? (el.getAttribute('name') || el.getAttribute('property') || '') :
        el.tagName === 'LINK' && el.getAttribute('rel') === 'canonical' ? 'canonical' : '';
      const seen = new Map();
      for (const el of document.head.querySelectorAll('meta[name], meta[property], link[rel="canonical"]')) {
        const key = keyOf(el);
        if (!key || key === 'viewport') continue;
        if (seen.has(key)) seen.get(key).remove();
        seen.set(key, el);
      }
    });

    let html = '<!DOCTYPE html>\n' + (await page.evaluate(() => document.documentElement.outerHTML));
    html = html.replaceAll(LOCAL, SITE);

    const outDir = path.join(DIST, route);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), html);

    const warn = [];
    if (info.h1.length !== 1) warn.push(`${info.h1.length} h1 headings`);
    if (pageErrors.length) warn.push(`page error: ${pageErrors[0]}`);
    results.push(`  ok    ${route.padEnd(12)} ${String(info.words).padStart(5)} words${warn.length ? '   (note: ' + warn.join('; ') + ')' : ''}`);
  } catch (err) {
    failed++;
    results.push(`  FAIL  ${route.padEnd(12)} ${err.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();

console.log('\nPre-rendered pages:');
console.log(results.join('\n'));
if (failed) {
  console.error(`\n${failed} page(s) failed, so the build is stopped. The live site is not changed.`);
  process.exit(1);
}
console.log(`\nDone: ${ROUTES.length} pages pre-rendered, plus dist/app.html for all other addresses.\n`);
