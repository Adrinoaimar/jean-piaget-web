# Seguimiento SEO Jean Piaget Sullana

Mercado: Sullana, Piura, Perú. Campaña: Admisión 2027.

`tracking.json` contiene la línea base, palabras propuestas, páginas prioritarias y reglas de medición. `plan-90-dias.md` define hitos y fuentes. Son documentación privada del repositorio: el build público no los copia.

Desde la raíz del repositorio:

```bash
python3 scripts/check-seo.py --output /ruta/informe-seo.json
node --test tests/metrics.test.mjs
sh scripts/build-public.sh
```

El comprobador solo lee HTTP y metadatos; no comprueba el índice de Google/Bing, no envía sitemaps, no rellena formularios y no usa credenciales. Los estados de indexación se consultan en las herramientas oficiales. Revisión semanal manual; no hay tareas programadas instaladas.

Rollback de las optimizaciones: base `474e20f`; aplicar `git revert` a los commits de cambios en orden inverso y comprobar el despliegue. No usar reset forzado sobre main. Mantener el build `sh scripts/build-public.sh` con salida `dist`: el HTML fuente lleva noindex para el respaldo GitHub y la salida pública de Cloudflare elimina solo ese marcador.
