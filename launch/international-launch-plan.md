# Plan de lanzamiento internacional | Nexo Brief y Nexo Catalog

Preparado el 2026-10-27. Nada de esto está publicado: cada paso externo lo aprueba y ejecuta Josué. Este plan no garantiza ventas; define qué se prueba y cómo se sabe si funcionó.

## Diagnóstico

Hoy hay dos herramientas verificadas, una publicada en Gumroad (Brief, USD 0+) y cuatro publicaciones en LinkedIn y Facebook en español, con cero ventas ni descargas medidas. El problema no es el producto sino la audiencia: un recurso gratuito sin tráfico no se descubre solo. Gumroad Discover exige requisitos adicionales y no hay reseñas que den confianza.

Por eso el plan trata los dos productos como imán de contactos y prueba de criterio, no como fuente de ingresos. El dinero real está en el servicio (Landing Express desde USD 150 en Fiverr), y el camino es: alguien descarga la herramienta, ve cómo trabaja Nexo y pide una propuesta.

## Posicionamiento en inglés

Frase única: "Free, offline tools to scope a web project and clean a product CSV, built by an independent studio in Ecuador."

Lo que se puede afirmar: funcionan en el navegador, sin cuenta, sin envío de datos a Nexo, con interfaz en español e inglés, y tienen límites documentados. Lo que no se afirma: ahorro de tiempo cuantificado, clientes, reseñas, compatibilidad con ERP, ni nada que no esté medido.

## Listado Gumroad: Nexo Brief (reemplaza el texto actual)

**Title:** Nexo Brief | Digital project brief tool (EN / ES)

**Summary:** Turn a vague idea into a one-page brief before you hire anyone or write any code.

**Description:**

Most web, dashboard and automation projects go wrong at the start: the goal is fuzzy, the scope keeps growing and nobody wrote down what "done" means. Nexo Brief gives you a structured form to settle that first.

It covers goal, audience, requirements, limits, content, data and delivery conditions, then exports everything as JSON or Markdown so you can send it to a freelancer, an agency or your own team.

What you get: a single HTML tool that opens offline in your browser, an English and Spanish interface, manual save in the browser, JSON import and export, Markdown export, printing through the browser, and a fictional example with a bilingual guide.

What it is not: it does not generate content with AI, translate your answers, or include consulting or custom development. It needs no account, sends nothing to us, and its exports are not encrypted, so do not enter sensitive data.

Pay what you want, including zero. If it saves you a bad kickoff call, a contribution helps us keep building free tools.

**Tags:** project brief, web design, freelancer, scope, template, productivity

## Listado Gumroad: Nexo Catalog (nuevo; archivo `products/nexo-catalog-v1.zip`)

**Title:** Nexo Catalog | Product CSV checker (EN / ES)

**Summary:** Find duplicate SKUs, missing prices and negative stock in a product CSV before you import it anywhere.

**Description:**

Importing a messy product CSV into a shop or inventory system can silently overwrite good data. Nexo Catalog checks the file first, entirely in your browser.

Map five columns (SKU, product, category, price, stock), pick your decimal separator, review every record, and export either the valid rows or a full review report. Duplicate SKUs are set aside together so you decide which to keep, prices and stock are validated, and text that starts like a spreadsheet formula is flagged.

Limits: 2 MB, 5,000 records and 60 columns. Prices take up to two decimals without thousands separators. Your original file is never modified.

What it is not: not an ERP integration, not an inventory system, no AI or OCR. Nothing is uploaded, stored or tracked, and reloading the page clears the session. We do not promise compatibility with every importer, so check the exports before using them elsewhere.

Pay what you want, including zero.

**Tags:** csv, ecommerce, product catalog, sku, data cleaning, inventory

**Antes de publicar:** el ZIP pasó una prueba de carga desde `file://` sin errores de red ni de consola. Falta una descarga de prueba desde Gumroad y una portada propia (no inventar una captura: tomarla de la herramienta real con el ejemplo ficticio cargado).

## Calendario de catorce días

| Día | Acción | Quién | Qué se mide |
| --- | --- | --- | --- |
| 1 | Actualizar el listado de Brief y publicar el de Catalog | Josué | Ambos enlaces abren bien |
| 2 | Publicar en LinkedIn en inglés (texto A) con enlace a Brief | Josué | Impresiones y clics |
| 4 | Publicar en LinkedIn en inglés (texto B) con enlace a Catalog | Josué | Impresiones y clics |
| 5 | Mostrar Catalog en una comunidad de comercio electrónico o de datos donde el autopromocionarse esté permitido (leer antes las reglas) | Josué | Descargas, comentarios |
| 7 | Revisar Gumroad: descargas, aportaciones, correos recogidos | Josué | Descargas totales |
| 9 | Publicar el caso de uso de Brief con ejemplo ficticio (texto C) | Josué | Respuestas |
| 11 | Escribir a tres personas que hayan comentado o descargado, preguntando qué faltó | Josué | Respuestas útiles |
| 14 | Decisión: seguir, cambiar de ángulo o parar | Josué y Claude | Ver criterio abajo |

## Textos en inglés (borradores para revisar)

**A | Brief**
Most freelance projects I see go wrong before any design starts: the goal is fuzzy, the scope grows, and nobody wrote down what "done" means. I built a small tool to settle that first. Nexo Brief is a free one-page project brief: goal, audience, requirements, limits, content, data, delivery. It runs offline in your browser, exports JSON and Markdown, and works in English and Spanish. No account, nothing sent to me. Pay what you want, including zero: [link]

**B | Catalog**
Before importing a product CSV into a shop, I run it through a checker so duplicate SKUs, missing prices and negative stock don't overwrite good data. I packaged mine as a free tool: Nexo Catalog. It runs entirely in your browser, never modifies your file, and exports the valid rows or a full review report. It is not an ERP integration and it has documented limits (2 MB, 5,000 rows). Pay what you want: [link]

**C | Caso de uso**
A short example of what a filled-in brief looks like for a fictional dental clinic website: goal, three audiences, what is in and out of scope, content owner, delivery date. If you are about to hire someone for a web project, filling this in first usually saves the first two calls. The tool and the example are free: [link]

Si alguien responde pidiendo trabajo, la respuesta lleva a Landing Express en Fiverr (USD 150, siete días, dos revisiones) o a la página de contacto del sitio.

## Criterio de decisión al día 14

Seguir con el ángulo actual si hay al menos 25 descargas y dos conversaciones sobre trabajo pagado. Cambiar de ángulo (otro público, otra comunidad, otra herramienta) si hay descargas pero ninguna conversación. Parar y reasignar el tiempo a prospección directa en Ecuador si hay menos de 10 descargas, porque la audiencia internacional costaría más tiempo del que devuelve.

## Riesgos y límites

- El alemán y los demás idiomas del sitio no tienen revisión nativa; el inglés es el único idioma de venta en este plan.
- Gumroad permite recursos digitales, no servicios: el listado no debe vender consultoría.
- Comunidades como Reddit sancionan la autopromoción; leer las reglas y aportar antes de enlazar.
- Cualquier cifra de uso o ahorro se publica solo si se midió.
