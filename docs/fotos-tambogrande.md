# Fotografías de Tambogrande

## Uso y procedencia

Ocho escenas seleccionadas del lote de Tambogrande proporcionado por el usuario. El 9 de noviembre de 2026 el usuario solicita crear una URL para la sede de Tambogrande y enlazarla desde Sullana. Se recupera la página `tambogrande.html`, con identidad local explícita y fondos retirados. No se trasladan contactos, dirección, horarios, grados ni logros de Sullana.

URL prevista: `https://adrinoaimar.github.io/jean-piaget-web/tambogrande.html`. La disponibilidad pública depende de la publicación autorizada de la rama.

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

## Recuperación del 9 de noviembre de 2026

La página, sus estilos, este documento y las dieciséis variantes WebP se recuperan del commit `557393f`. Se conserva el retorno «Inicio · Sullana» y la marca Tambogrande visible también en móvil. Las dimensiones declaradas corresponden a los archivos recuperados; cada uno de los ocho motivos aparece una sola vez. Los elementos de aula útiles para comprender la escena se conservan deliberadamente. Esta recuperación no incorpora nuevas generaciones ni modifica los originales. La revisión del navegador y la publicación quedan a cargo de la integración principal.

## Retiro de docentes — 9 de noviembre de 2026

Por solicitud del usuario se retiran únicamente las dos profesoras de la escena `acompanamiento-en-aula`. Se conserva el grupo de tres estudiantes, la mesa y los útiles, con fondo transparente. Edición con image_gen integrado; exportación WebP a 480/960 px conservando alfa. Se actualizan dimensiones, versión de recurso, texto alternativo y descripción de la tarjeta.

Prompt: retirar completamente a las dos mujeres con vestidos grises situadas detrás de la mesa; conservar los tres estudiantes, sus rasgos, uniformes, poses y objetos; completar mínimamente bordes ocultos, sin inventar personas, fondo, texto, brillo ni sombras. Mantener transparencia alfa real.
