# Fotografías de Tambogrande

## Uso y procedencia

Ocho escenas seleccionadas del lote de Tambogrande proporcionado por el usuario. Su integración en la misma web fue solicitada expresamente, con fondos retirados. Se presentan en `tambogrande.html`, con identidad local explícita y accesos desde Inicio y Galería. No se trasladan contactos, grados ni logros de Sullana.

Cada imagen aparece una sola vez: un grupo en portada, tres escenas de aprendizaje, un retrato en comunidad y tres grupos en galería. Las variantes WebP conservan transparencia y se exportan a 480 y 960 px. Los originales permanecen fuera del repositorio.

| Recurso | Fuente | Ubicación |
| --- | --- | --- |
| companeros-de-camino | IMG_9895.JPG | Portada |
| concentracion-al-aprender | IMG_9906.JPG | Aprendizaje |
| aprender-con-movimiento | IMG_9735.JPG | Aprendizaje |
| acompanamiento-en-aula | IMG_9731.JPG | Aprendizaje |
| confianza-para-crecer | IMG_9741.JPG | Comunidad |
| ideas-en-clase | IMG_9913.JPG | Galería |
| encuentro-en-patio | DJI_20261019080238_0023_D.JPG | Galería |
| participacion-compartida | IMG_9592.JPG | Galería |

## Edición y prompts

Modo: herramienta integrada `image_gen`, edición con referencia y `transparent_background: true`. Pillow se usa únicamente para conversión y redimensionamiento del resultado RGBA, conservando su canal alfa. La edición generativa puede introducir variaciones finas respecto de la fotografía original; no se considera una extracción píxel a píxel. No se atribuyen nombres a estudiantes.

Prompt común: retirar completamente el entorno, conservar rostros, poses, uniformes y emblemas de referencia; fondo realmente transparente, sin nuevos personajes ni partes del cuerpo, sin embellecimiento, sin marco, sin sombra añadida ni tablero de transparencia dibujado.

Instrucción por escena:

- **Compañeros:** conservar los cuatro estudiantes completos; retirar pared, escaleras, barandillas y suelo.
- **Concentración:** conservar estudiante, brazos, mesa, cuaderno, lápiz y útiles; retirar paredes, carteles y mobiliario distante.
- **Movimiento:** conservar docente, tres estudiantes, mesa roja, bolsos y sillas; retirar televisor, pizarra, paredes y suelo. No reconstruir partes ocultas.
- **Acompañamiento:** conservar tres estudiantes de primer plano y dos docentes, mesa roja, sillas y útiles; retirar personas y muebles distantes y el aula.
- **Confianza:** conservar estudiante y uniforme; retirar pared, barandilla y reflejos. Mantener el corte inferior original, sin inventar piernas.
- **Ideas:** conservar estudiantes, escritorios, sillas y cuadernos; retirar paredes, pizarra, aros y suelo.
- **Patio:** conservar docente y comunidad presentes; retirar techo, vigas, edificios y suelo. No inventar piernas.
- **Participación:** conservar personas reales, uniformes y zapatos; retirar pared y retratos impresos en carteles.

Una segunda pasada solicita corregir únicamente la máscara alfa: eliminar halos difusos del fondo, mantener las siluetas y no añadir brillo ni sombra. Se conserva el resultado con mejor apariencia al componerlo sobre el verde del sitio.

## Revisión

Se revisan composición, proporciones, legibilidad y navegación móvil. Los archivos incluyen alfa; el entorno original ya no aparece. Los elementos de aula útiles para comprender la escena se conservan deliberadamente. Publicación en producción pendiente de revisión del PR.
