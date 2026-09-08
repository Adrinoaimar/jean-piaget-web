# I.E.P. Jean Piaget Sullana

Sitio institucional de la Institución Educativa Particular Jean Piaget, en Sullana, Piura, Perú.

HTML, CSS y JavaScript planos. Sin framework, sin paso de build, sin dependencias que instalar: se publica subiendo los archivos.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio |
| `nosotros.html` | Historia, misión, visión y esencia de marca |
| `niveles.html` | Inicial de 5 años y Primaria de 1.º a 5.º |
| `innovacion.html` | Computación, robótica, creatividad digital |
| `vida-escolar.html` | Actividades y calendario institucional |
| `galeria.html` | Galería de instalaciones y actividades |
| `admision.html` | Proceso, requisitos y formulario de solicitud |
| `contacto.html` | Datos de contacto, mapa y formulario |
| `jean-piaget.html` | Quién fue Jean Piaget y por qué el colegio lleva su nombre |
| `privacidad.html` · `terminos.html` | Textos legales en borrador |
| `404.html` | Página de error |

Recursos: `css/styles.css` (sistema de diseño), `css/fonts.css` y `fonts/` (tipografías), `js/main.js`, `img/logo.svg`.

## Sistema de diseño

Sigue la guía de marca de la institución.

**Color.** Verde institucional `#528C66`, verde profundo `#315F46`, crema `#FCF7CE`, rojo acento `#D92525`, tinta `#1E2B24`. El rojo se reserva para llamados a la acción. Todo se define como variables CSS en `:root`, con modo oscuro bajo `prefers-color-scheme`.

**Tipografía.** Source Serif 4 para títulos y Montserrat para textos, autoalojadas en `fonts/` con `font-display: swap`. No hay pedidos a servidores de terceros para cargar fuentes.

**Iconografía.** Phosphor Icons por CDN. Es la única dependencia externa del sitio.

**Movimiento.** Entradas al hacer scroll mediante IntersectionObserver, sin escuchar el evento de scroll. Todo respeta `prefers-reduced-motion`, y sin JavaScript la página se ve completa.

## Qué falta reemplazar

El contenido es un borrador de trabajo. Antes de publicarlo como sitio oficial:

- **Fotografías.** Cada marcador indica qué imagen corresponde. Si aparecen menores de edad hace falta la autorización firmada del padre, madre o apoderado.
- **Datos de contacto.** Dirección, teléfonos, correos y horarios son de ejemplo.
- **Cifras.** Los números de `niveles.html` son de referencia.
- **Textos legales.** `privacidad.html` y `terminos.html` son borradores que debe revisar un asesor legal según la Ley 29733 de Protección de Datos Personales.
- **Escudo.** `img/logo.svg` es una recreación vectorial aproximada. Conviene sustituirlo por el archivo original.

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
