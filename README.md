# I.E.P. Jean Piaget Sullana

Sitio institucional de la Institución Educativa Particular Jean Piaget, en Sullana, Piura, Perú.

HTML, CSS y JavaScript planos. Sin framework, sin paso de build, sin dependencias que instalar: se publica subiendo los archivos.

Lema institucional: **Dios, labor y lealtad**.

## Paleta institucional

Verdes `#216055`, `#0A332B`; amarillos `#F8B815`, `#F8D200`; neutros `#F8F7F4`, `#EBEBDF`. Degradados circulares para verdes, amarillos y neutros; lineales para verdes y amarillos. Colores proporcionados por el usuario.

El marfil domina las superficies, el verde establece jerarquía y el amarillo se reserva para la acción principal y detalles pequeños. En móvil: menú desplazable, controles de 44 px o más, títulos y retratos compactos, galería en una columna.

Para separar los uniformes blancos, los recortes usan escenarios verdes con degradado de luminosidad y sombras que siguen la transparencia. El marfil se reserva para lectura; el amarillo permanece en detalles y acción principal.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio |
| `nosotros.html` | Historia, misión, visión y identidad institucional |
| `niveles.html` | Inicial de 3 a 5 años y Primaria de 1.º a 6.º |
| `innovacion.html` | Computación, robótica, creatividad digital |
| `vida-escolar.html` | Actividades y calendario institucional |
| `taller-familiar.html` | Landing del taller familiar y consulta por WhatsApp |
| `galeria.html` | Galería de instalaciones y actividades |
| `tambogrande.html` | Redirección de compatibilidad hacia la web independiente de Tambogrande |
| `admision.html` | Proceso, requisitos y formulario de solicitud |
| `contacto.html` | Datos de contacto, mapa y formulario |
| `jean-piaget.html` | Quién fue Jean Piaget y por qué el colegio lleva su nombre |
| `privacidad.html` · `terminos.html` | Textos legales en borrador |
| `404.html` | Página de error |

Recursos: `css/styles.css` (base), `css/creative.css` (dirección visual y movimiento), `css/family-landing.css` (landing del taller), `css/fonts.css` y `fonts/` (tipografías), `js/main.js`, `js/family-landing.js`, `img/`.

La landing del taller ofrece un formulario breve que abre un mensaje editable en WhatsApp; la página no guarda las respuestas y la familia decide si enviar el mensaje.

## Imágenes

| Archivo | Origen |
|---|---|
| `img/escudo.png` | Escudo oficial de la institución, con el fondo blanco recortado y transparencia |
| `img/favicon.png` | El mismo escudo, reducido para la pestaña del navegador |
| `img/og-image.jpg` | Tarjeta para redes sociales, escudo sobre el verde institucional |
| `img/jean-piaget.jpg` | Retrato de Jean Piaget en Ann Arbor, 1967. Dominio público, anuario Ensian de la Universidad de Michigan, vía Wikimedia Commons |
| `img/recortes/*.webp` | Doce recortes con transparencia derivados de las fotografías proporcionadas para el sitio |
| `img/fotos/*.webp` | Fotografías optimizadas de estudiantes, aula y proyectos escolares |
| `img/taller-familiar/*.jpg` | Fotografías promocionales ilustrativas generadas para la landing, no corresponden a estudiantes reales |
| `img/taller-familiar/family-*.webp` | Recortes transparentes generados para el hero y la invitación final del taller |
| `img/logo.svg` | Recreación vectorial anterior al escudo oficial. Ya no se usa en el sitio |

## Selección de fotos de Sullana — noviembre de 2026

Diez fotografías aportadas por el usuario se distribuyen entre Niveles, Vida escolar y Galería. Cada archivo nuevo se usa una sola vez en estas páginas; se eliminaron retratos y tomas similares de la galería para evitar repeticiones. Tambogrande tiene repositorio, recursos y despliegue propios en https://adrinoaimar.github.io/jean-piaget-tambogrande-web/. Inicio enlaza a ese sitio externo.

Los derivados están en `img/fotos/sullana/`, con anchos de 480, 960 y 1440 píxeles, orientación corregida y sin metadatos EXIF. Los originales se conservan fuera del repositorio. `srcset` y `sizes` ajustan la descarga a la pantalla; el visor abre la versión de 1440 píxeles. La selección y los encuadres se documentan en `docs/fotos-sullana.md`.

## Sistema de diseño

Sigue la guía de marca de la institución.

La capa `css/creative.css` incorpora degradados de verde profundo, lima y dorado, marcos orgánicos para los recortes y una navegación flotante.

**Color.** Verde institucional `#528C66`, verde profundo `#315F46`, crema `#FCF7CE`, rojo acento `#D92525`, tinta `#1E2B24`. El rojo se reserva para llamados a la acción. Todo se define como variables CSS en `:root`, con modo oscuro bajo `prefers-color-scheme`.

**Tipografía.** Montserrat para títulos y textos, Source Serif 4 para firmas y citas, autoalojadas en `fonts/` con `font-display: swap`. No hay pedidos a servidores de terceros para cargar fuentes.

**Iconografía.** Phosphor Icons por CDN. Es la única dependencia externa del sitio.

**Movimiento.** Entradas al hacer scroll mediante IntersectionObserver, sin escuchar el evento de scroll. Las cabeceras coordinan la entrada de texto, fotografías y marcos. Todo respeta `prefers-reduced-motion`, y sin JavaScript la página se ve completa. La galería incorpora un visor ampliado con botones, flechas de teclado y cierre con Escape.

## Qué falta reemplazar

El contenido es un borrador de trabajo. Antes de publicarlo como sitio oficial:

- **Fotografías.** El sitio integra retratos con transparencia y fotografías de aula y proyectos. Las imágenes se declaran directamente en el HTML; la galería reúne ocho imágenes ampliables. Si aparecen menores de edad hace falta la autorización firmada del padre, madre o apoderado.
- **Datos confirmados por el usuario (2026-11-09).** Inicial de 3 a 5 años; Primaria de 1.º a 6.º; Av. José de Lama #489, Sullana; consultas +51 959 425 312; horario escolar de 7:20 a. m. a 1:50 p. m. Los correos electrónicos y el horario de atención administrativa siguen pendientes de confirmación.
- **Textos legales.** `privacidad.html` y `terminos.html` son borradores que debe revisar un asesor legal según la Ley 29733 de Protección de Datos Personales.
- **Escudo.** Ya está el oficial en `img/escudo.png`. Si aparece una versión vectorial o en mayor resolución, conviene reemplazarla: el escudo tiene texto fino que se lee mejor cuanto mayor sea el original.

## Activar el envío de los formularios

Los formularios de admisión y contacto ya están conectados a [Web3Forms](https://web3forms.com), que recibe el envío y lo reenvía por correo. Falta un solo paso, que solo puede dar la institución:

1. Entrar a [web3forms.com](https://web3forms.com) y escribir el correo donde se quieren recibir los mensajes.
2. Llega una clave de acceso a ese correo.
3. Abrir `js/main.js` y pegar la clave en la primera línea de configuración:

```js
var FORM = {
  ACCESS_KEY: "pega-aquí-la-clave",
  ...
```

Hasta que la clave esté puesta, el formulario no simula un envío falso: valida los campos y, al enviar, le muestra al visitante el correo y el WhatsApp para escribir directamente.

La clave de acceso es pública por diseño y solo autoriza a enviar mensajes a ese correo. No da acceso a ninguna cuenta, así que no hay problema en que esté en el repositorio.

Para cambiar el correo de destino más adelante hay que generar una clave nueva. Los avisos de contacto que ve el visitante están en el mismo bloque `FORM`, en `EMAIL` y `WHATSAPP`.

## Verlo localmente

```bash
python3 -m http.server 8000
```

Luego abrir `http://localhost:8000`.

## Publicación

Publicado con GitHub Pages desde la rama `main`, carpeta raíz.

## Actualización institucional — noviembre de 2026

Admisión incluye copia del DNI de ambos padres para Inicial y Primaria, entrevista con Dirección y entrevista con Psicología. El selector ofrece las tres edades de Inicial y los seis grados de Primaria. Se sustituye la sección de cifras de ejemplo por una explicación de cada etapa. El lema se presenta en este orden: identificación institucional, «Dios, labor y lealtad» y Sullana. La página propia de Tambogrande no hereda los datos de contacto o niveles confirmados únicamente para Sullana.

## Separación de sedes — 9 de noviembre de 2026

Sullana se mantiene en este repositorio y despliegue. Tambogrande se traslada a `Adrinoaimar/jean-piaget-tambogrande-web`, con sus propios archivos, logo transparente y GitHub Pages. Las publicaciones son independientes. La ruta antigua `tambogrande.html` solo redirige al nuevo sitio y ofrece un enlace manual de respaldo. No se sirven fotografías, estilos o fuentes de Tambogrande desde Sullana.
