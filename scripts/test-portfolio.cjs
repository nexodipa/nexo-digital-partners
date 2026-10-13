const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.equal((html.match(/class="portfolio-card"/g) || []).length, 7);
assert.ok(html.indexOf('portfolio-copy.js?') < html.indexOf('src="script.js'));
assert.ok(!html.includes('josuest-b.github.io'), 'Current public links must use the new account');
for (const id of ['volia-control', 'psicocalc', 'scriptorium', 'psyche-lab']) {
  const filename = id === 'psyche-lab' ? 'assets/portfolio/psyche-lab-screen.png' : `assets/portfolio/${id}-20260923.jpg`;
  assert.ok(html.includes(filename), `Missing current capture: ${id}`);
  const image = fs.readFileSync(path.join(root, filename));
  assert.equal(image.subarray(0, 3).toString('hex'), id === 'psyche-lab' ? '89504e' : 'ffd8ff');
  assert.ok(image.length > 10000, 'Capture must contain real image data');
}
assert.ok(html.includes('Ejemplo ficticio; no acredita validación clínica.'));
assert.ok(html.includes('Captura sin registros privados.'));
assert.ok(html.includes('href="cases/#psicocalc"'), 'Unvalidated clinical example must explain its scope before any tool access');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
assert.ok(script.includes('captureLink.textContent = "Ver captura"'));
for (const match of html.matchAll(/<img src="(assets\/portfolio\/[^\"]+)"/g)) {
  const pathname = new URL(match[1], 'https://example.invalid/').pathname.slice(1);
  assert.ok(fs.existsSync(path.join(root, pathname)), `Missing example: ${match[1]}`);
}
console.log('PASS: seven portfolio entries, current captures, links, copy loading and scope disclaimers.');
