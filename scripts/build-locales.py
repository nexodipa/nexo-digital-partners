"""Build crawler-readable metadata for shareable language URLs using the UI catalogue."""
from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://nexodipa.github.io/nexo-digital-partners/'
SOURCE = 'Webs para salud y educación. Herramientas para ordenar el trabajo de tu negocio.'
catalogue = json.loads(subprocess.check_output(['node', '-e', """
const fs=require('node:fs'),vm=require('node:vm');
const c=vm.createContext({window:{}});
for(const f of ['translations.js','studio-copy.js','locale-completion.js','portfolio-copy.js','audit-copy.js']) vm.runInContext(fs.readFileSync(f,'utf8'),c);
process.stdout.write(JSON.stringify(c.window.NEXO_TRANSLATIONS));
"""], cwd=ROOT, encoding='utf-8'))


class LocalizedHead(HTMLParser):
    def __init__(self, lang):
        super().__init__(convert_charrefs=False)
        self.lang = lang
        self.output = []
        self.in_head = False
        self.suppress = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'head':
            self.in_head = True
        if not self.in_head:
            self.output.append(self.get_starttag_text())
            return
        title = 'Nexo Digital Partners | ' + catalogue[self.lang].get('Soluciones', 'Soluciones')
        description = catalogue[self.lang][SOURCE]
        url = BASE + 'locale/' + self.lang + '/'
        if tag == 'title':
            self.output.append('<title>' + escape(title))
            self.suppress = True
            return
        if tag == 'meta':
            key = attrs.get('name', attrs.get('property'))
            values = {'description': description, 'og:description': description, 'og:title': title, 'og:url': url}
            if key in values:
                attrs['content'] = values[key]
        if tag == 'link' and attrs.get('rel') == 'canonical':
            attrs['href'] = url
        # Body and its source-key translation catalogue stay identical in every variant.
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.suppress = True
            return
        self.output.append('<' + tag + ''.join(' ' + k + '="' + escape(v or '', quote=True) + '"' for k, v in attrs.items()) + '>')

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        if tag == 'script' and self.suppress:
            self.suppress = False
            return
        if tag == 'title':
            self.suppress = False
        if tag == 'head':
            self.output.append('<base href="../../">')
            for lang in catalogue:
                self.output.append('<link rel="alternate" hreflang="' + lang + '" href="' + BASE + 'locale/' + lang + '/">')
            self.in_head = False
        self.output.append('</' + tag + '>')

    def handle_data(self, data):
        if not self.suppress:
            self.output.append(data)

    def handle_entityref(self, name):
        if not self.suppress:
            self.output.append('&' + name + ';')

    def handle_charref(self, name):
        if not self.suppress:
            self.output.append('&#' + name + ';')

    def handle_decl(self, decl):
        self.output.append('<!' + decl + '>')

    def handle_comment(self, data):
        self.output.append('<!--' + data + '-->')


for language in catalogue:
    parser = LocalizedHead(language)
    parser.feed((ROOT / 'index.html').read_text(encoding='utf-8'))
    target = ROOT / 'locale' / language / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(''.join(parser.output), encoding='utf-8')
print(f'Built {len(catalogue)} shareable language pages with static localized metadata.')
