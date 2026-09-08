# I.E.P. Jean Piaget Sullana — Sitio institucional

Sitio web institucional estático (HTML/CSS/JS puro, sin dependencias) para la Institución Educativa Particular Jean Piaget, en Sullana, Piura, Perú.

Diseño alineado a la guía de marca: paleta verde institucional (`#528C66`), verde profundo (`#315F46`), crema (`#FCF7CE`) y rojo de acento (`#D92525`); tipografía Source Serif 4 para títulos y Montserrat para textos.

## Contenido

- `index.html` — Inicio
- `nosotros.html` — Esencia de marca, historia, misión, visión, público
- `niveles.html` — Nivel Inicial (5 años) y Nivel Primario (1.º a 5.º)
- `innovacion.html` — Computación, robótica, creatividad digital, aprendizaje práctico
- `vida-escolar.html` — Actividades y convivencia escolar
- `galeria.html` — Galería de fotos (con placeholders)
- `admision.html` — Proceso de admisión, requisitos, vacantes y formulario
- `contacto.html` — Datos de contacto, mapa y formulario
- `css/styles.css` — Estilos del sistema de marca
- `js/main.js` — Menú móvil y formularios
- `img/logo.svg` — Escudo institucional (versión vectorial recreada)

> **Notas:**
> - Todo el contenido (textos, dirección, teléfonos, aranceles, vacantes) es de ejemplo (placeholder) y debe reemplazarse por la información real de la institución.
> - Las fotografías son marcadores de posición (`.ph`, con ícono y etiqueta) listos para reemplazar por fotos reales de estudiantes e instalaciones.
> - El logo en `img/logo.svg` es una recreación vectorial aproximada del escudo institucional; si contás con el archivo original en alta calidad, reemplazalo directamente.

## Cómo verlo localmente

Abrí `index.html` en el navegador, o serví la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8000
```

Luego visitá `http://localhost:8000`.

## Publicar con GitHub Pages

1. Configuración del repo → Pages → Source: rama `main`, carpeta `/ (root)`.
2. El sitio quedará disponible en `https://<usuario>.github.io/<repo>/`.
