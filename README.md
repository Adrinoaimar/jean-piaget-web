# Colegio Jean Piaget — Sitio institucional

Sitio web institucional estático (HTML/CSS/JS puro, sin dependencias) para el Colegio Jean Piaget.

## Contenido

- `index.html` — Inicio
- `nosotros.html` — Historia, misión, visión, equipo directivo
- `niveles.html` — Nivel Inicial, Primario y Secundario
- `admisiones.html` — Proceso de admisión, requisitos y aranceles
- `contacto.html` — Datos de contacto, mapa y formulario
- `css/styles.css` — Estilos (paleta azul marino / dorado, estilo elegante y sobrio)
- `js/main.js` — Menú móvil y formulario de contacto

> **Nota:** todo el contenido (textos, direcciones, teléfonos, aranceles, nombres del equipo) es de ejemplo (placeholder) y debe reemplazarse por la información real de la institución antes de publicar el sitio.

## Cómo verlo localmente

Abrí `index.html` en el navegador, o serví la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8000
```

Luego visitá `http://localhost:8000`.

## Publicar con GitHub Pages

1. Configuración del repo → Pages → Source: rama `main`, carpeta `/ (root)`.
2. El sitio quedará disponible en `https://<usuario>.github.io/<repo>/`.
