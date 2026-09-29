(() => {
  const select = document.querySelector('#case-language');
  const textNodes = [...document.querySelectorAll('[data-en]')];
  const images = [...document.querySelectorAll('[data-alt-en]')];
  const spanish = new Map(textNodes.map(node => [node, node.textContent]));
  const spanishAlt = new Map(images.map(node => [node, node.alt]));
  const supported = value => ['es', 'en'].includes(value);
  const url = new URL(location.href);
  let saved;
  try { saved = localStorage.getItem('nexo-case-language'); } catch {}
  function apply(lang) {
    document.documentElement.lang = lang;
    select.value = lang;
    textNodes.forEach(node => { node.textContent = lang === 'en' ? node.dataset.en : spanish.get(node); });
    images.forEach(node => { node.alt = lang === 'en' ? node.dataset.altEn : spanishAlt.get(node); });
    document.title = lang === 'en' ? 'Project notes | Nexo Digital Partners' : 'Casos de proyecto | Nexo Digital Partners';
    try { localStorage.setItem('nexo-case-language', lang); } catch {}
  }
  const requested = url.searchParams.get('lang');
  apply(supported(requested) ? requested : supported(saved) ? saved : navigator.language.startsWith('es') ? 'es' : 'en');
  select.addEventListener('change', () => {
    apply(select.value);
    const next = new URL(location.href);
    next.searchParams.set('lang', select.value);
    history.replaceState(null, '', next);
  });
})();
