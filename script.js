const menuButton = document.querySelector("#menu-button");
const siteNav = document.querySelector("#site-nav");
const languageSelect = document.querySelector("#language-select");
const quoteForm = document.querySelector("#quote-form");
const result = document.querySelector("#request-result");
const formNote = document.querySelector("#form-note");
const dialog = document.querySelector("#project-dialog");
const originalText = new WeakMap();
const originalAttributes = new WeakMap();
const supportedLanguages = Array.from(languageSelect.options, option => option.value);
const siteBase = new URL('./', document.baseURI);
const baseElement = document.querySelector('base') || document.head.appendChild(document.createElement('base'));
baseElement.href = siteBase.href;
const structuredSources = [...document.querySelectorAll('script[type="application/ld+json"]')].map(element => ({ element, data: JSON.parse(element.textContent) }));
let preparedMessage = "";
let previewTrigger = null;

function normalizeText(value) { return value.replace(/\s+/g, " ").trim(); }
function translateText(value, lang = document.documentElement.lang) {
  return window.NEXO_TRANSLATIONS?.[lang]?.[normalizeText(value)] || value;
}
function setLocalizedText(element, source) {
  element.textContent = translateText(source);
  originalText.set(element.firstChild, source);
}
function translateAttribute(element, attr, lang) {
  if (!element.hasAttribute(attr)) return;
  if (!originalAttributes.has(element)) originalAttributes.set(element, {});
  const originals = originalAttributes.get(element);
  if (!(attr in originals)) originals[attr] = element.getAttribute(attr);
  element.setAttribute(attr, translateText(originals[attr], lang));
}
function applyLanguage(requested, updateUrl = false) {
  const lang = supportedLanguages.includes(requested) ? requested : "es";
  languageSelect.value = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = window.NEXO_RTL?.includes(lang) ? "rtl" : "ltr";
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest('script, style, noscript, [translate="no"], [aria-hidden="true"]')) return NodeFilter.FILTER_REJECT;
      return normalizeText(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (!originalText.has(node)) originalText.set(node, node.textContent);
    const source = originalText.get(node);
    const translated = translateText(source, lang);
    node.textContent = translated === source ? source : source.match(/^\s*/)[0] + translated + source.match(/\s*$/)[0];
  });
  document.querySelectorAll("[placeholder], [aria-label], [title], [alt]").forEach(element => {
    if (element.closest('[translate="no"]')) return;
    ["placeholder", "aria-label", "title", "alt"].forEach(attr => translateAttribute(element, attr, lang));
  });
  document.title = "Nexo Digital Partners | " + translateText("Soluciones", lang);
  const description = translateText('Webs para salud y educación. Herramientas para ordenar el trabajo de tu negocio.', lang);
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = description;
  const localizedUrl = new URL(`locale/${lang}/`, siteBase);
  document.querySelector('link[rel="canonical"]').href = localizedUrl.href;
  document.querySelector('meta[property="og:url"]').content = localizedUrl.href;
  structuredSources.forEach(({ element, data }) => {
    const translated = JSON.parse(JSON.stringify(data));
    translated.inLanguage = lang;
    if (translated['@type'] === 'Organization') translated.description = description;
    if (translated['@type'] === 'FAQPage') translated.mainEntity.forEach(item => {
      item.name = translateText(item.name, lang);
      item.acceptedAnswer.text = translateText(item.acceptedAnswer.text, lang);
    });
    element.textContent = JSON.stringify(translated);
  });
  if (updateUrl) {
    const url = location.protocol.startsWith('http') ? localizedUrl : new URL(location.href);
    url.hash = location.hash;
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
  }
  try { localStorage.setItem("nexo-language", lang); } catch { /* Storage can be unavailable in private or file contexts. */ }
  if (!result.hidden) prepareRequest();
}
function closeMenu() {
  siteNav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") !== "true";
  siteNav.classList.toggle("open", expanded);
  menuButton.setAttribute("aria-expanded", String(expanded));
});
siteNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("click", event => { if (!event.target.closest(".site-header")) closeMenu(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && siteNav.classList.contains("open")) { closeMenu(); menuButton.focus(); } });
matchMedia("(min-width:961px)").addEventListener("change", closeMenu);
document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach(item => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    document.querySelectorAll(".portfolio-card").forEach(card => {
      card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
    });
  });
});
document.querySelectorAll("[data-project]").forEach(link => {
  link.addEventListener("click", () => {
    quoteForm.elements.project.value = link.dataset.project;
    result.hidden = true;
  });
});
// Local-only projects expose their real capture, not a misleading live-demo link.
document.querySelectorAll(".portfolio-card").forEach(card => {
  const liveLink = card.querySelector('a[href^="https://"], a[href^="demos/"]');
  if (liveLink) return;
  const captureLink = document.createElement("a");
  captureLink.className = "text-link";
  captureLink.href = card.querySelector(".project-image img").getAttribute("src");
  captureLink.target = "_blank";
  captureLink.rel = "noopener noreferrer";
  captureLink.textContent = "Ver captura";
  card.append(captureLink);
});
document.querySelectorAll("[data-preview]").forEach(button => {
  button.addEventListener("click", () => {
    previewTrigger = button;
    const card = button.closest(".portfolio-card");
    const thumbnail = button.querySelector("img");
    const preview = document.querySelector("#preview-image");
    document.querySelector("#preview-title").textContent = card.querySelector("h3").textContent;
    preview.src = thumbnail.src;
    preview.alt = thumbnail.alt;
    const paragraph = card.querySelector("p");
    setLocalizedText(document.querySelector("#preview-description"), originalText.get(paragraph.firstChild) || paragraph.textContent);
    dialog.showModal();
  });
});
document.querySelector("#close-preview").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener("close", () => previewTrigger?.focus());

function prepareRequest() {
  const data = new FormData(quoteForm);
  const lang = languageSelect.value;
  const fields = [
    ["Nombre / marca", data.get("name")],
    ["Contacto", data.get("contact")],
    ["Tipo de solucion", quoteForm.elements.project.selectedOptions[0].textContent],
    ["Contexto del proyecto", data.get("message")]
  ];
  preparedMessage = [
    window.NEXO_FORM_INTRO[lang],
    ...fields.map(([label, value]) => translateText(label) + ": " + String(value || "").trim()),
    "", window.NEXO_FORM_CLOSING[lang]
  ].join("\n");
  document.querySelector("#whatsapp-result").href = "https://wa.me/593987411592?text=" + encodeURIComponent(preparedMessage);
  document.querySelector("#email-result").href = "mailto:josuepug@gmail.com?subject=" + encodeURIComponent("Nexo Digital Partners - " + translateText("Iniciar proyecto")) + "&body=" + encodeURIComponent(preparedMessage);
  setLocalizedText(formNote, "Solicitud preparada.");
  result.hidden = false;
}
quoteForm.addEventListener("submit", event => { event.preventDefault(); prepareRequest(); });
quoteForm.addEventListener("input", () => { result.hidden = true; });
document.querySelector("#copy-request").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(preparedMessage);
    setLocalizedText(formNote, "Mensaje copiado.");
  } catch {
    setLocalizedText(formNote, "No se pudo copiar. Abre WhatsApp o correo.");
  }
});
window.lucide?.createIcons();
function resolveLanguage() {
  const requested = new URL(location.href).searchParams.get("lang");
  if (supportedLanguages.includes(requested)) return requested;
  const pathLanguage = location.pathname.match(/\/locale\/([a-z]{2})\/$/)?.[1];
  if (supportedLanguages.includes(pathLanguage)) return pathLanguage;
  try {
    const saved = localStorage.getItem("nexo-language");
    if (supportedLanguages.includes(saved)) return saved;
  } catch { /* Browser preferences still work without storage. */ }
  return (navigator.languages || [navigator.language])
    .map(locale => locale.toLowerCase().split("-")[0])
    .find(locale => supportedLanguages.includes(locale)) || "en";
}
applyLanguage(resolveLanguage());
languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value, true));
window.addEventListener("popstate", () => applyLanguage(resolveLanguage()));
