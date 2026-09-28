const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const url = process.env.NEXO_TEST_URL || pathToFileURL(path.resolve(__dirname, '../index.html')).href;
  const output = path.resolve(__dirname, '../verification/languages');
  fs.mkdirSync(output, { recursive: true });
  try {
    const context = await browser.newContext({ locale: 'de-DE' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url);
    assert.equal(await page.locator('html').getAttribute('lang'), 'de');
    const languages = await page.locator('#language-select option').evaluateAll(nodes => nodes.map(n => n.value));
    for (const width of [1440, 1280, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const lang of languages) {
        await page.selectOption('#language-select', lang);
        assert.equal(new URL(page.url()).searchParams.get('lang'), lang);
        assert.equal(await page.locator('html').getAttribute('dir'), ['ar','he'].includes(lang) ? 'rtl' : 'ltr');
        const issues = await page.evaluate(() => {
          const bad = [];
          if (document.documentElement.scrollWidth > innerWidth + 1) bad.push('page overflow');
          const items = [...document.querySelector('.site-header').children].filter(e => e.getClientRects().length && getComputedStyle(e).position !== 'absolute');
          for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
            const a = items[i].getBoundingClientRect(), b = items[j].getBoundingClientRect();
            if (Math.min(a.right,b.right) - Math.max(a.left,b.left) > 1 && Math.min(a.bottom,b.bottom) - Math.max(a.top,b.top) > 1) bad.push('header overlap');
          }
          return bad;
        });
        assert.deepEqual(issues, [], `${lang} at ${width}`);
        if ([1440,390].includes(width) && ['en','de','ja','ar','he'].includes(lang)) {
          await page.screenshot({ path: path.join(output, `${lang}-${width}.png`), fullPage: true });
          await page.screenshot({ path: path.join(output, `${lang}-${width}-header.png`) });
        }
      }
    }
    await page.goto(url + '?lang=fr#contacto');
    assert.equal(await page.locator('html').getAttribute('lang'), 'fr');
    await page.selectOption('#language-select','en');
    assert.equal(new URL(page.url()).hash, '#contacto');
    await page.goto(url);
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.locator('[name="name"]').fill('International test');
    await page.locator('[name="contact"]').fill('test@example.com');
    await page.locator('[name="message"]').fill('Demo request');
    await page.locator('button[type="submit"]').click();
    await page.selectOption('#language-select','de');
    assert.equal(await page.locator('[name="message"]').inputValue(), 'Demo request');
    assert.ok(new URL(await page.locator('#whatsapp-result').getAttribute('href')).searchParams.get('text').includes('International test'));
    assert.deepEqual(errors, []);
    console.log('PASS: 12 languages, 6 widths, header, RTL, URL, browser preference, persistence and form.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
