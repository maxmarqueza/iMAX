# AGENTS.md — Sitio web de IMAX (grupoimax.mx)

Instrucciones para cualquier agente de código (Codex, Claude, etc.) que continúe este proyecto.
Léelo completo antes de tocar nada. El detalle está en `docs/PROYECTO.md` (estado y estructura),
`docs/BITACORA.md` (qué se decidió y por qué, en orden), `docs/PENDIENTES.md` (lo que falta)
y `docs/VIDEO.md` (cómo se hicieron y se rehacen los videos).

## Quién es el cliente y cómo trabajar con él

- El cliente es **Max** (correo ventas@gruporebimo.com, GitHub `maxmarqueza`). Habla español de México. **No es técnico.**
- **Respuestas siempre breves y concisas** (regla firme, la pidió dos veces): 2 a 5 líneas. Qué cambió en una frase,
  una pregunta si hace falta, y el siguiente paso. Sin tablas, sin términos técnicos (códecs, fps, archivos, commits)
  salvo que los pida. No recapitular lo ya hecho.
- **Hacer, no instruir.** Max quiere que el agente haga el trabajo (editar, publicar, verificar), no que le dé pasos.
  Solo pedirle algo cuando sea imposible para el agente (escribir sus contraseñas, CAPTCHA, iniciar sesión, pagar).
- **Siempre cerrar con el siguiente paso.**
- **Trabajar sección por sección.** Cuando Max pide cambiar una sección, se le prepara una página de vista previa
  *solo con esa sección* y 2–3 opciones (A/B/C) una debajo de otra; él elige una letra y se aplica al sitio.
  Ver «Cómo se hacen las opciones» en `docs/PROYECTO.md`.
- Ir anotando en `docs/` cada decisión nueva (bitácora y pendientes) sin que lo pida.
- **Créditos:** nunca generar video (ni gastos grandes en Higgsfield) sin que Max lo autorice explícitamente;
  decirle antes el costo en créditos. Un «listo» al mandar material no es autorización.

## Reglas de diseño que Max ya fijó (no proponer lo contrario)

1. **Nada ligado al scroll.** Nada de efectos que avancen al hacer scroll (scrollytelling, pin, scrub, parallax de
   scroll, snap). Cada sección se anima **sola, rápido (1–2 s), al aparecer en pantalla**, y luego la página se
   recorre normal. Esto aplica en computadora y celular.
2. **Video real, fotorrealista, fluido.** Donde haya imagen protagonista, Max prefiere **video** de pocos segundos que
   corre solo (no fotos con movimiento de cámara simulado, no 3D, no ilustración). Los videos deben verse continuos,
   sin trabarse (ver `docs/VIDEO.md`: se publican ya acelerados a 30 fps y se reproducen a 1×).
3. **Todo a la vista.** Nada de carruseles que se deslizan de lado: las tarjetas van en cuadrícula
   (4 o 5 columnas en computadora, 2 en celular).
4. **Entrada de tarjetas:** «caen» desde arriba una tras otra, un poco giradas, y rebotan al asentarse.
5. **Al pasar el cursor:** solo un realce sencillo — la tarjeta **sube un poco con sombra y aparece un marco
   amarillo**. Max rechazó efectos más complejos (inclinación 3D, cortina, cursor personalizado, etc.).
6. **Sin cifras técnicas fijas.** Max quitó la ficha técnica y todas las cifras (altura libre, claros, piso, andenes
   por m², plazos, etc.): «cada bodega es diferente». No volver a poner datos técnicos como si fueran de IMAX.
7. **No inventar datos de IMAX:** ni cifras propias, ni certificaciones, ni clase A, ni plazos, ni clientes, ni
   ubicaciones, ni inventario. Todas las imágenes/videos actuales son generados por IA y llevan la etiqueta
   «Imagen ilustrativa» / «Imágenes ilustrativas». Cuando lleguen fotos reales de IMAX (carpeta `material-real/`),
   esas sí van sin etiqueta. Excepción: Max pidió quitar la etiqueta de la portada (2026-10-18); ahí no va.
8. **Tema claro «Concreto»**: fondo concreto `#e9ebe8`, papel `#f7f8f6`, tinta `#111416`, acento amarillo de
   seguridad `#ffc20e`, tipografía Archivo (Google Fonts, ancho variable). La sección Proceso es la única oscura
   (`#0b1218`). Max no quiere el sitio todo oscuro.
9. Portada: la palabra **IMAX** grande como protagonista, con **su propio parque terminado al atardecer** dentro de las
   letras (imagen fija, desde 2026-10-18); poco texto al inicio. Debajo de IMAX dice «Inmobiliaria, desarrolladora y
   constructora de naves y parques industriales.» Al final, nada de texto encima de las bodegas: en computadora el
   título va **centrado en el cielo**; en celular va la imagen vertical de Max (la hilera en
   perspectiva) y el título arriba a la derecha; antes, al pasar la M, la obra se construye en video (4 s, `fx/obra.js`). Sin botones ni etiqueta en la portada. Imágenes de portada en 4K completo.
10. **Las naves deben parecer las de IMAX** (lámina blanca, techos de dientes de sierra, ladrillo rosa, columnas
   blancas, cortinas, escala mexicana), no centros de distribución de EE. UU. Al recrear con IA, **no modificar las
   bodegas reales**: usar sus tomas como referencia y cambiar solo cámara, luz o cielo.

## Cómo publicar (GitHub Pages)

- Repo: `git@github.com:maxmarqueza/iMAX.git` (en la Mac de Max el push funciona **solo por SSH**).
- El sitio se sirve desde la rama **`gh-pages`**. Para publicar:
  ```bash
  git push origin main && git push origin main:gh-pages
  ```
  Tarda ~1 minuto. Verificar con `curl -s https://grupoimax.mx/?nc=$RANDOM | grep -c "<algo nuevo>"`.
- El archivo `CNAME` (contenido `grupoimax.mx`) controla el dominio. No borrarlo.
- Terminar los mensajes de commit con una línea de coautoría si tu entorno la usa. Commits en español, describiendo
  el cambio para Max.
- `scrollcraft/` y `material-real/` están en `.gitignore` (archivos pesados/locales). No están en GitHub.

## Cómo probar antes de publicar

- Servidor local: `node tools/serve.mjs --root . --port 4173` (sin caché) y abrir `http://localhost:4173/`.
  No uses `python3 -m http.server`: atiende una petición a la vez y corta conexiones de video.
- Capturas automáticas con Chrome sin ventana (requiere `cd tools && npm install`, Google Chrome instalado):
  - `node tools/vista-shots.mjs <carpeta> 1440 900` y `... 390 844` → recorre todo el sitio y arma hojas de capturas.
  - `node tools/fluidez.mjs` → mide si el video de «De polvo a nave» corre a 30 fps sin cuadros perdidos.
  - `node tools/src4k.mjs` → confirma qué archivo de video carga cada pantalla (4K / 1440p / celular).
  - `?solo=<id>` en la URL muestra **solo esa sección** (ej. `/?solo=parque`); `?v=<seccion>-<letra>` activa una
    variante de vista previa (ver `fx/variantes.js`).
- Revisar siempre en computadora (1440×900) **y** celular (390×844) antes de publicar.

## Mapa rápido del código

- `index.html` — todo el contenido (secciones: `#inicio`, `#servicios`, `#anatomia`, `#parque`, `#proceso`, `#contacto` + pie).
- `styles.css` — estilos base y de cada sección (tokens en `:root`).
- `scrollcraft.js` / `scrollcraft.css` — motor heredado (ya no se usa para scroll; aún monta los textos `data-sc-cue`
  y los videos `data-sc-scrub`). **No editar**; los efectos propios van en `fx/`.
- `fx/core.js` — utilidades compartidas (`window.FX`), placa de letras IMAX, elección de video 4K/1440p/celular.
- `fx/auto.js` — **corazón del sitio actual**: reproduce cada sección sola al aparecer (portada, videos, tarjetas que caen, pie).
- `fx/portada.js`, `fx/replanteo.js`, `fx/cielo.js`, `fx/tiempos.js`, `fx/escala.js`, `fx/kinetic.js`, `fx/salida.js` — efectos por sección.
- `fx/sin-scroll.css` — deja cada escena de una pantalla y quita lo ligado al scroll.
- `fx/variantes.js/.css` — solo para las páginas de opciones (vista previa); sin `?v=` no cambian nada.
- `script.js` — `CONFIG` de contacto (vacío), menú, formulario → WhatsApp.
- `media/` videos (3 tamaños cada uno), `img/` imágenes y logos, `opciones/` páginas de vista previa para Max.
