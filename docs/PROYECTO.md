# IMAX — estado completo del proyecto

Última actualización: 2026-10-11. Sitio en vivo: **https://grupoimax.mx** (GitHub Pages, rama `gh-pages`).
Antes de trabajar, lee también `AGENTS.md` (reglas de Max), `docs/BITACORA.md` (historial de decisiones),
`docs/PENDIENTES.md` y `docs/VIDEO.md`.

---

## 1. El negocio

- **IMAX / i-MAX** — «Inmobiliaria, desarrolladora y constructora de naves y parques industriales.»
- Qué hace (dicho por Max): renta y venta de naves industriales y de parques industriales; construye naves a la
  medida (build-to-suit) y desarrolla parques industriales completos.
- Dominio `grupoimax.mx` (registrado en GoDaddy). Logo: hexágono azul con una «i» y punto naranja, texto «i-MAX».
- Lo que **no** sabemos (no inventarlo): ciudades donde opera, inventario de naves, cifras, clientes, teléfono,
  WhatsApp, correo, dirección. Max va a mandar **fotos y videos reales** de naves y parques que ha hecho IMAX
  (se guardarán en `material-real/`, ignorada por git).

## 2. El sitio hoy, sección por sección (de arriba a abajo)

Regla general: **nada se mueve con el scroll**; cada sección se anima sola, rápido, cuando aparece
(lo controla `fx/auto.js`, función `onShow` con IntersectionObserver). Las escenas con video miden una pantalla
(`fx/sin-scroll.css`). Hay un botón «Repetir» en las escenas con animación larga.

### Barra superior
- Logo `img/logo.webp`, menú: «Qué hacemos» (abre un mega menú con 4 opciones e imagen de vista previa),
  «La nave» (#anatomia), «Parques» (#parque), «Proceso» (#proceso) y botón amarillo/negro «Cotizar» (#contacto).
- En celular: botón de menú circular.

### 1. Portada — `#inicio` (`.hero`)
- La palabra **IMAX** gigante es una «placa» de concreto con las letras recortadas; dentro de las letras se ve el
  video de la nave al anochecer (`media/hero-loop*.mp4`, bucle de 8 s, 4K).
- Al cargar, cada letra se abre de abajo hacia arriba como cortina de andén con un filo amarillo (`fx/portada.js`).
- A los ~1.4 s la cámara entra sola por el asta de la M (zoom ~1.2 s) y queda la nave a pantalla completa con la
  frase «Una sola empresa responde por el terreno, el proyecto, la obra y el inmueble.» (palabra por palabra,
  `fx/kinetic.js`) y botones Renta / Venta / Construcción a la medida / Parques industriales.
- Bajo IMAX: «Inmobiliaria, desarrolladora y constructora de naves y parques industriales.»
- En celular la palabra va más al centro y el zoom se compensa (`dive` en `fx/portada.js`).

### 2. Servicios — `#servicios` (`.svc`)
- Título «Cuatro formas de trabajar con IMAX» + texto; **4 tarjetas en cuadrícula** (Renta, Venta, A la medida,
  Parques) con foto, título, texto y enlace. 2×2 en celular (ahí se oculta el texto largo).
- Al aparecer, las tarjetas **caen** y rebotan (`fx/auto.js`, bloque «2. Servicios»).
- Al pasar el cursor: la tarjeta sube con sombra y **marco amarillo** (CSS en `styles.css`, `.svc__item a:hover`).
- Debajo: nota «¿No sabes cuál te conviene?» + botón Cotizar + «Imágenes ilustrativas».

### 3. De polvo a nave — `#anatomia` (`.anat`) — opción **A** elegida
- Video 4K (`media/despiece*.mp4`, 5.4 s): terreno vacío → tormenta de polvo → la nave completa en piezas
  flotando → se arma → nave terminada. Corre solo al aparecer.
- Antes del video se dibuja 0.6 s el trazo de la planta sobre el terreno (`fx/replanteo.js`); el polvo del video
  pasa por encima gracias a un recorte precalculado (`media/polvo-mate.webp`).
- La etapa se escribe en el cielo con letras enormes detrás de la sierra (TERRENO, TERRACERÍAS, ESTRUCTURA,
  PIEZAS, MONTAJE, ENTREGA) y las piezas la cruzan por delante (`fx/cielo.js`, `media/cielo-mascara.png`,
  `media/cielo-mate.webp`).
- Tarjeta blanca abajo a la izquierda que cambia con cada etapa (textos `data-sc-cue`) y riel de etapas abajo a la
  derecha (solo computadora). Etiquetas de piezas (solo el nombre, sin cifras).
- Si se cambia el video hay que rehacer los dos recortes y la máscara (ver `docs/VIDEO.md`).

### (Ficha técnica — ELIMINADA)
- Max la quitó el 2026-10-06: «son cuestiones muy técnicas… va a variar cada bodega». No volver a ponerla.

### 4. Parque industrial — `#parque` (`.tour`)
- **Video 4K de dron** (`media/parque*.mp4`, 5 s): entra por la caseta y avanza por la vialidad central entre
  naves, a la hora dorada. Corre solo una vez al aparecer. Título «Así se arma un parque industrial» encima.
- Debajo, **5 tarjetas** (Acceso controlado, Vialidad interna, Patios de maniobras y andenes, Naves, Oficinas)
  que suben escalonadas; realce amarillo al pasar el cursor.

### 5. Proceso — `#proceso` (`.build`, tema oscuro) — opción **C** elegida
- Video 4K de obra de noche (`media/obra*.mp4`, 5 s): terreno con charcos → estructura de acero → nave
  iluminada. Encima, título «De un terreno vacío a una nave operando» + «Cinco pasos, una sola empresa
  responsable de todos.»
- Al terminar el video se abre el comparador **«Tres tiempos, un mismo predio»** (`fx/tiempos.js`): dos cortes
  verticales que se pueden arrastrar entre terreno / estructura / nave, y botones Terreno · Estructura · Nave ·
  Los tres. Imágenes alineadas con el último cuadro: `img/tiempo-terreno.webp`, `img/tiempo-estructura.webp`, `img/nave.webp`.
- Debajo, **5 tarjetas oscuras**: Terreno y factibilidad, Proyecto e ingeniería, Permisos, Obra, Entrega.

### 6. Contacto — `#contacto` (`.contact`) — **siguiente sección por revisar con Max**
- **Preguntas frecuentes** (opción **B** elegida): 8 preguntas en tarjetas, 2 columnas (1 en celular), que caen al
  aparecer; al tocar se abre la respuesta (marco amarillo cuando está abierta).
- **Banda amarilla** con texto que corre (Renta · Venta · Construcción a la medida · Parques industriales).
- Intro + figura «a escala» (`fx/escala.js`): al escribir superficie y andenes en el formulario dibuja la nave a
  escala junto a un tráiler. Datos de contacto (se ocultan mientras `CONFIG` esté vacío).
- **Formulario** (nombre, empresa, teléfono, interés, superficie, zona, energía…): al enviar arma un mensaje y
  abre **WhatsApp**. Hoy **no envía** porque falta `CONFIG.whatsapp` en `script.js`.

### Pie
- Logo blanco, frase, enlaces. Escena final (`fx/salida.js`): al llegar, la cámara sale sola de la M (1.6 s) y
  queda la palabra IMAX con la nave dentro; luego se dibuja una línea de naves y pasa un camión.

## 3. Videos e imágenes (inventario)

| Archivo | Qué es | Origen |
|---|---|---|
| `media/hero-loop{,-4k,-m}.mp4` | Nave de noche en bucle (portada y pie) | Kling 3.0 4K, 2026-10-06 |
| `media/despiece{,-4k,-m}.mp4` | De polvo a nave, 5.4 s | Kling 3.0 4K (2 tomas unidas) |
| `media/obra{,-4k,-m}.mp4` | Obra de noche, 5 s | Kling 3.0 4K (2 tomas unidas) |
| `media/parque{,-4k,-m}.mp4` | Dron sobre el parque, 5 s | Kling 3.0 4K, 2026-10-07 |
| `media/polvo-mate.webp`, `cielo-mate.webp`, `cielo-mascara.png` | Recortes para efectos de «De polvo a nave» | Calculados del video |
| `img/*-poster.webp`, `img/nave.webp` | Imagen que se ve mientras carga cada video | Primer/último cuadro |
| `img/andenes, oficinas, obra, interior .webp` | Fotos de las tarjetas de servicios | Generadas (IA) |
| `img/tiempo-terreno/estructura.webp` | Comparador del proceso | Generadas (IA) |
| `img/etapas/1-6.webp` | Cuadros de etapas (para opciones) | Del video |
| `img/logo*.webp`, `logo-icono.png`, favicons, `og.jpg` | Logo de i-MAX y derivados | De `docs/fuentes/logo-original.png` |

Tres tamaños de cada video: `-4k` (3840 px) solo si la ventana tiene ≥2600 px reales (`innerWidth × devicePixelRatio`,
p. ej. laptop retina a pantalla completa), normal (2560 px) en computadora y `-m` (~1280 px) en celular
(≤860 px). Lo decide `FX.videoSrc()` en `fx/core.js`; el atributo `data-src-4k` se lee con `getAttribute`.

Todo lo visual actual es **generado por IA** y va rotulado «Imagen ilustrativa». Los originales en alta (PNG
2752 px, videos maestros 4K) están en la Mac de Max en `scrollcraft/builds/imax/out/` y `out/4k/` (no en GitHub,
~530 MB).

## 4. Cómo se hacen las opciones (flujo con Max)

1. Max dice qué sección quiere cambiar.
2. Se crea `opciones/secciones/<seccion>/index.html` copiando `opciones/secciones/polvo/index.html`: muestra la
   misma sección 2–3 veces, cada una en un recuadro (`<iframe>`) con `?v=<clave>-<letra>&solo=<id-de-seccion>`,
   título A/B/C, una frase de qué hace y botón Repetir. `?solo=` oculta todo lo demás del sitio (script en el `<head>` de `index.html`).
3. Las variantes viven en `fx/variantes.js` + `fx/variantes.css`, activadas por `<html data-v-<clave>="b">`
   (el `?v=` se convierte en ese atributo en el `<head>`). Sin `?v=` el sitio no cambia.
4. Se prueba en 1440×900 y 390×844 (`tools/solo.mjs` cambiando la URL), se publica y se le manda el enlace con
   una línea por opción.
5. Cuando elige, se pasa la opción al HTML/CSS/`fx/auto.js` definitivos, se borra su código de `variantes.*`
   y su página de opciones, se prueba y se publica.

Páginas de opciones que siguen en línea: `/opciones/` (las 3 direcciones de diseño iniciales: Concreto, Plano, Hora
dorada), `/opciones/servicios/` (entradas A/B/C), `/opciones/servicios/hover/` y `/resalte/` (efectos de cursor),
`/opciones/secciones/polvo/` (De polvo a nave A/B/C; se eligió A). `/vista/` redirige al sitio.

## 5. Herramientas en la Mac de Max

- `ffmpeg`/`ffprobe` en `/Users/max/.local/bin/` (no hay ImageMagick ni PIL; Python 3 sí).
- Google Chrome en `/Applications/Google Chrome.app` (lo usan los scripts de `tools/`).
- Simuladores de iPhone (Xcode): para probar Safari real `xcrun simctl boot <udid>` y `xcrun simctl openurl <udid> <url>`.
- **Higgsfield** (generación de video/imagen): Max tiene plan Ultra con créditos en la cuenta con la que entra en
  **su Chrome** (no en las conexiones MCP del agente, que apuntan a otra cuenta sin créditos). Se generó usando la
  extensión «Claude in Chrome» en `higgsfield.ai/es/ai/video?model=kling3_0`. Max autoriza cada gasto.
- GoDaddy (DNS) bloquea navegadores automatizados; los cambios de DNS los tiene que hacer Max o con su Chrome.

## 6. Archivos que ya no existen (para no buscarlos)

`fx/relevo.*`, `fx/pasos.*`, `fx/riel.*` (efectos de scroll), `fx/lamina.*` (ficha técnica),
`fx/anochece.*` (parque que anochecía), `vista/auto.js` (se movió a `fx/auto.js`).
