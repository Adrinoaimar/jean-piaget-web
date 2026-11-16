# Migración Jean Piaget Sullana — 16 de noviembre de 2026

## Publicación
- Principal: https://jeanpiagetsullana.pages.dev/
- Respaldo conservado: https://adrinoaimar.github.io/jean-piaget-web/index.html
- Cloudflare Pages gratuito, proyecto jeanpiagetsullana, integración nativa GitHub Adrinoaimar/jean-piaget-web, rama main, framework None, raíz del repositorio.
- Excepción aprobada por el usuario: build `sh scripts/build-public.sh`, salida `dist`, para publicar solo archivos públicos. No se utilizó Direct Upload.
- El segundo commit se desplegó automáticamente; el panel indica Automatic deployments enabled.
- Admin, JS/CSS administrativos, docs, scripts, backend SQL/funciones y README no se copian a dist. El panel anterior de GitHub sigue protegido por Auth y RLS; ocultar su enlace o noindex no constituye seguridad.

## Auditoría y cambios
- Sitio estático: HTML, CSS, JS, imágenes WebP/JPEG/PNG y fuentes WOFF2 locales. Sin dependencias nuevas.
- 15 documentos HTML originales; 12 páginas públicas de contenido, un panel, un error y una redirección a Tambogrande.
- No existían canonical, sitemap.xml ni robots.txt. Open Graph usaba el dominio antiguo.
- Recursos y navegación relativos funcionan desde la raíz. Cloudflare redirige HTML a rutas sin extensión (308); canónicas y sitemap usan las respuestas finales 200. Inicio /index.html se consolida en /.
- Títulos y descripciones internos ya eran únicos y pertinentes; se conservaron. Se optimizaron título, descripción y Open Graph de Inicio.
- Se añadieron canonical y og:url a las 12 páginas públicas y se actualizaron sus imágenes Open Graph al nuevo dominio.
- Sitemap de 12 URL, excluye admin, 404 y redirección Tambogrande; sin lastmod inventado. Robots permite rastrear y referencia sitemap.
- 404 incorpora noindex. Admin ya tenía noindex,nofollow.
- School JSON-LD incluye nombre institucional, URL, logotipo y Sullana/Piura/PE. No se añadieron reseñas, precios, coordenadas ni direcciones no corroboradas.
- Los resultados públicos de búsqueda incluían directorios con una dirección diferente de la web aprobada. No se modificó el texto ni se afirmó que esos registros correspondieran inequívocamente a esta institución. No se creó ni reclamó Google Business Profile.
- CORS de la función jean-piaget-intake en Supabase actualizado exclusivamente para admitir el nuevo origen; GitHub permanece permitido. Autenticación JWT y validaciones se conservaron.

## Pruebas
- 12 páginas en Cloudflare con HTTP 200, sin noindex accidental y canonical correcto. Ver verificacion.json.
- 54 recursos HTML locales y 13 recursos referenciados por CSS (fuentes/import) con HTTP 200.
- Las rutas /admin, /admin.html, /js/admin.js, /css/admin.css, /docs/base-de-datos.md, /supabase/config.toml y /README.md devuelven 404 en Cloudflare.
- Comparación automatizada contra commit aprobado 915a44d: contenido de body idéntico en todos los HTML; sin cambios en CSS, JS, fotografías ni fuentes.
- Navegador en 1280 px y 390 px: fuentes cargadas, sin desbordamiento horizontal. Recursos principales de imágenes cargados.
- GitHub Pages continúa con HTTP 200; las 12 páginas originales respondieron 200 en la auditoría inicial.
- HTTPS válido; /robots.txt y /sitemap.xml responden 200, XML parseable.
- Preview de Cloudflare devuelve X-Robots-Tag: noindex; dominio principal no tiene ese bloqueo.
- OPTIONS de formularios: Cloudflare y GitHub 204; origen ajeno 403. Payload vacío 400 con mensaje de consentimiento.
- Contacto y Admisión: envíos sintéticos reales devuelven 200 success:true y confirmación de registro. Se crearon dos solicitudes identificadas «PRUEBA TECNICA MIGRACION - IGNORAR», correo prueba-migracion@example.invalid. Pueden archivarse en el panel. No se usaron datos personales reales.
- Una petición con User-Agent Python-urllib recibió 403; navegador y simulación Googlebot recibieron 200. La inspección real Google para smartphones confirmó acceso, rastreo e indexación permitidos y la canónica correcta; por eso no se debilitaron protecciones de Cloudflare.

## Google y pendientes externos
- Propiedad de prefijo https://jeanpiagetsullana.pages.dev/ verificada mediante etiqueta HTML de Google. Mantener dicha etiqueta.
- Sitemap enviado y reenviado tras validar el acceso. Estado inicial de Search Console: No se ha podido obtener. No confundir envío aceptado con lectura/indexación completa.
- Prueba en tiempo real de portada: «La URL está disponible para Google» y «La página se puede indexar». Google para smartphones: obtención correcta, rastreo Sí, indexación Sí, canónica declarada correcta.
- Solicitar indexación: Google devolvió «Cuota superada» y pidió volver mañana. La solicitud NO quedó aceptada. Reintentar el 17/11/2026: Search Console > propiedad > Inspección de URL > https://jeanpiagetsullana.pages.dev/ > Solicitar indexación.
- Revisar Sitemaps y Páginas cuando Google procese los datos. La portada aún no figura indexada en el informe; no se garantiza posición ni plazo.
- Core Web Vitals: aún no hay datos de campo de la nueva propiedad; no se afirma que estén aprobados. No se alteraron animaciones ni diseño para optimizar puntuaciones.
- Supabase muestra aviso de período de gracia terminado: el proyecto puede dejar de servir al agotar cuota. No se cambiaron plan, facturación ni límites. Los envíos de prueba funcionaron hoy.
- Google Business Profile: revisar ficha inequívoca y datos con el titular antes de cualquier alta o reclamación. No se realizaron cambios.

## Reproducción
Ejecutar desde raíz: `python3 docs/migracion-20261116/verificar.py`. Solo inspecciona páginas y recursos; no envía formularios.
