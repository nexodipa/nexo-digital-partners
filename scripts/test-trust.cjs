const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

(async () => {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.end(fs.readFileSync(file));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    for (const lang of ['es','en','de','fr','pt','it','ru','cs','zh','ja','he','ar']) {
      const raw = await (await fetch(`${origin}/locale/${lang}/`)).text();
      assert.ok(raw.includes(`<base href="../../">`));
      assert.ok(raw.includes(`locale/${lang}/`));
      await page.goto(`${origin}/locale/${lang}/`);
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      const visibleDescription = await page.locator('.hero-lead').innerText();
      assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), visibleDescription);
      assert.ok(raw.includes(visibleDescription), 'Crawler must see translated description without JS');
      assert.equal(await page.locator('.brand').getAttribute('href'), '#home');
      assert.equal(await page.locator('a[href="demos/volia-control/"]').evaluate(a => new URL(a.href).pathname), '/demos/volia-control/');
    }
    await page.selectOption('#language-select', 'fr');
    assert.equal(new URL(page.url()).pathname, '/locale/fr/');
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'), 'fr');
    for (const width of [320,390,1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/cases/', '/delivery/']) {
        await page.goto(origin + route);
        await page.selectOption('#case-language','en');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${route} at ${width}`);
      }
    }
    assert.deepEqual(errors, []);
    console.log('PASS: 12 static localized descriptions, reload, relative links, cases and delivery at 3 widths.');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
