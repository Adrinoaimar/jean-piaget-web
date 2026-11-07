# Selección editorial de fotos de Sullana

La selección usa diez escenas representativas de las fotografías entregadas para Jean Piaget Sullana. No se incorporan imágenes del lote de Tambogrande. Cada fotografía nueva tiene un único lugar dentro de estas tres páginas.

| Página y ubicación | Archivo derivado | Original | Encuadre |
|---|---|---|---|
| Niveles, experiencias | reconocimiento-acompanado | IMG_0241.JPG.jpeg | Vertical 4:5: docente y estudiante con medalla; se retira espacio periférico. |
| Vida escolar, canto | canto-con-cajon | IMG_5300.JPEG | Fotografía completa. |
| Vida escolar, expresión | voz-en-escena | IMG_5316.JPEG | Fotografía completa. |
| Vida escolar, danza | danza-compartida | IMG_5255.JPEG | Fotografía completa: ambas participantes. |
| Vida escolar, equipo | ritmo-en-equipo | IMG_5335.JPEG | Fotografía completa: movimiento y escenario. |
| Vida escolar, acompañamiento | acompanamiento-en-escena | IMG_5285.JPEG | Cuadrado: docente y dos participantes; se retira pared y suelo vacíos. |
| Galería, comunidad | companeros-con-uniforme | IMG_9806.JPG | Fotografía horizontal completa. |
| Galería, comunidad | logros-compartidos | IMG_0303.JPG.jpeg | Fotografía horizontal completa. |
| Galería, talento | una-voz-propia | IMG_5291.JPEG | Fotografía completa: participante con micrófono. |
| Galería, talento | talento-en-compania | IMG_5327.JPEG | Fotografía completa: trío de participantes. |

## Criterios

- Una toma por escena; no incorporar ráfagas ni versiones casi iguales en una misma página.
- Las fotos con medallas describen solo lo visible; no se atribuye un concurso, grado, año ni premio específico.
- Mantener contexto y rostros naturales; no reconstruir ni alterar personas.
- Respetar la paleta, tipografías, recortes transparentes de las cabeceras y movimiento reducido existentes.
- Conservar los originales fuera del repositorio y publicar únicamente derivados optimizados sin metadatos EXIF.
- Revisar móvil, escritorio, carga de imágenes y visor con teclado antes de publicar.

## Verificación local — 2026-11-06

- Niveles, Vida escolar y Galería probados en Chrome a 320, 390, 768 y 1440 px: sin desbordamiento horizontal ni imágenes rotas.
- Las diez imágenes nuevas tienen una sola ubicación; las treinta variantes WebP existen y no contienen EXIF ni XMP. Enlaces locales y atributos de las imágenes validados.
- Galería: ocho fotografías, apertura en 1440 px para las fotos nuevas, avance por botón y flechas, cierre con Escape y recuperación del foco y del desplazamiento.
- Contenido visible sin JavaScript y con movimiento reducido. Un contexto móvil nuevo a 390 px y densidad 2 seleccionó la variante de 960 px.
- `node --check js/main.js`, `git diff --check` y revisión estática independiente sin hallazgos.
- Capturas de comprobación conservadas fuera del repositorio. Publicación en producción pendiente.
