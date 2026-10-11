const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto('https://nexodipa.github.io/psyche-lab-sitio-web/?lang=es');
    await page.selectOption('#language-select', 'es');
    const section = page.locator('#sobre-mi');
    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    assert.match(await section.innerText(), /Edwin Josué Puglla Gangotena/);
    assert.match(await section.innerText(), /no ofrece diagnóstico ni psicoterapia/);
    await section.screenshot({ path: 'assets/cases/psyche-identity-20261011.png' });
    console.log('Captured current public Psyche Lab identity section without altering its DOM.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
