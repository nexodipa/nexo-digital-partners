const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const base = process.env.NEXO_CASE_URL || pathToFileURL(path.resolve('cases/index.html')).href;
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const lang of ['es', 'en']) {
        await page.goto(`${base}?lang=${lang}#catalog`);
        assert.equal(await page.locator('html').getAttribute('lang'), lang);
        assert.equal(await page.locator('.case-study').count(), 2);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.locator('#international').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
        await page.selectOption('#case-language', lang === 'es' ? 'en' : 'es');
        assert.equal(new URL(page.url()).hash, '#catalog');
        await page.reload();
        assert.equal(await page.locator('html').getAttribute('lang'), lang === 'es' ? 'en' : 'es');
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${base}?lang=es`);
    await page.locator('#international').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
    await page.screenshot({ path: 'verification/cases-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}?lang=en`);
    await page.locator('#international').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
    await page.screenshot({ path: 'verification/cases-mobile.png', fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS: 2 cases, ES/EN, 4 widths, images, URL, persistence, no horizontal overflow or JS errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
