# franciscoimperial.com

Portfolio de **Francisco José Imperial Gomariz**, diseñador gráfico y director de arte que
estudia DAM + DAW. La web está publicada en **[franciscoimperial.com](https://franciscoimperial.com)**.

La propia web es el proyecto 00 del portfolio. La diseñé y la programé yo, con vibe coding
y Claude como herramienta principal: yo dirijo, reviso y audito, y no se publica código que
no haya comprobado. El proceso completo está en
[Cómo hice esta web](https://franciscoimperial.com/como-hice-esta-web.html).

## Tecnología

- HTML, CSS y JavaScript, sin frameworks, sin dependencias y sin paso de compilación.
- Imágenes WebP en dos tamaños con `srcset` y vídeos H.264 comprimidos con ffmpeg.
- Animaciones en CSS (entrada, máscaras, parallax) que respetan `prefers-reduced-motion`.

## Qué incluye el código

| Archivo | Qué hace |
|---|---|
| `index.html` | Portada: foto a pantalla completa, índice de proyectos y un capítulo por proyecto |
| `producto.html`, `editorial.html`, `identidad.html`, `tres-d.html`… | Una página por proyecto |
| `styles.css` | Todo el diseño. Va por rondas comentadas, de la primera versión al rediseño oscuro |
| `script.js` | Menú, visor 360°, selector de colores, ampliación de imágenes, vídeos, parallax y animaciones al hacer scroll |
| `.htaccess` | Seguridad del servidor: cabeceras, protección de las imágenes y redirección a https |

## Accesibilidad y seguridad

- Auditada con WCAG 2.1 AA: contraste, teclado, foco visible, títulos, reflujo a 320 px
  y movimiento que se puede pausar.
- Content Security Policy y cabeceras de seguridad en el servidor (HSTS, `nosniff`,
  `frame-ancestors`).

## Lo que no está en este repositorio

Las imágenes, los vídeos, mis tipografías propias (diseñadas en equipo) y el CV no se
publican aquí: son mi trabajo y solo se muestran dentro de la web. Por eso, si clonas el
repositorio, las páginas se verán sin imágenes.

© 2026 Francisco José Imperial Gomariz. El código se comparte como muestra de trabajo;
no tiene licencia de reutilización.
