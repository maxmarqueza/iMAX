# Pendientes — IMAX (al 2026-10-11)

## Repaso sección por sección (desde 2026-10-16, noche) — EN CURSO
Max: «olvida ahorita nuestro material, vamos repasando el sitio sección por sección». Orden: 1 Portada (lista), **2 Servicios (en revisión: video `docs/repaso/2-servicios.mp4` enviado; propuesto:
fotos como sus naves, imagen de parque en «Parques», título breve y textos más cortos)**, 3 De polvo a nave, 4 Parque, 5 Proceso, 6 Preguntas, 7 Contacto, 8 Pie. Por cada una se le manda un
video corto de cómo está hoy (`docs/repaso/N-seccion.mp4`, grabado con el script de capturas por CDP) y él dice
si se queda o pide opciones.
- 1 Portada: **LISTA (publicada 2026-10-18)**. Historia: Max: «así no son las naves industriales reales» (la nave de la portada parece un centro de distribución
  gringo). Se generaron 3 imágenes con naves como las suyas usando sus fotos de referencia (Higgsfield, GPT Image 2.5):
  A bodega de block tipo su foto al atardecer; B hilera de naves de su parque (dientes de sierra, ladrillo) de noche;
  C nave blanca de lámina con andenes de noche. Lámina `docs/repaso/1-portada-opciones.jpg`. Falta que elija una
  para animarla (Kling 3.0 4K, 8 s, 48 créditos) y ponerla dentro de las letras IMAX (y en el pie).
  Max: «es mejor que busques naves industriales y parques industriales reales». Se buscaron videos **reales** de
  uso libre (licencia Pexels, permite uso comercial sin atribución) de naves en México: lámina
  `docs/repaso/1-portada-reales.jpg` — Pexels 30347751 (atardecer con cerros, Tultepec), 30224729 (naves blancas,
  cielo azul), 31363040 (andenes y trailers), 31363044 (nave, patio y calle), 30616899 (naves junto a la ciudad),
  30347753 (nave grande al atardecer). Descarga: `https://www.pexels.com/download/video/<id>/`. No son de IMAX →
  llevan «Imagen ilustrativa».
  Luego Max: «olvídalo, mejor la recreamos en Higgsfield» (la original fue Kling 3.0 4K, 8 s, bucle con el mismo
  cuadro de inicio y fin; ver `docs/VIDEO-4K-origen.md`). Se recrearon 3 portadas igual (Kling 3.0 4K, 8 s, bucle,
  48 créditos c/u) a partir de las imágenes A/B/C: `media/portada-n1|n2|n3*` (24 fps). Vista previa
  `/opciones/secciones/portada/` (A como está, B bodega de block `?v=hero-n1`, C hilera de naves `hero-n2`,
  D nave blanca con andenes `hero-n3`); la variante cambia también el video del pie. Video comparativo
  `docs/repaso/1-portada-4opciones.mp4`.
  Preguntó si Seedance 2.5 haría naves más reales: el realismo lo da la imagen de inicio; Seedance 2.5 llega solo a
  1080p (Kling 3.0 a 4K) y cuesta 128 créditos por 8 s (Kling 4K 48), pero acepta varias fotos de referencia.
  Pidió «opciones de naves industriales» → 6 tipos (GPT Image 2.5 con sus fotos de referencia), lámina
  `docs/repaso/1-portada-6naves.jpg`: 1 precolado con andenes (Bajío), 2 lámina blanca con oficinas de block,
  3 bodega mediana de block y lámina, 4 hilera de ladrillo con dientes de sierra, 5 panel gris oscuro, 6 nave blanca
  grande de noche. Job ids Higgsfield: c8d6c13c…, a322c7fc…, 60bb6fa9…, 43c0e238…, ccdaa4bf…, 87374419…
  Esperando que elija una para animar (Kling 3.0 4K, bucle de 8 s, igual que la portada original).
  Después Max propuso recrear de frente **la hilera de bodegas de su propio parque** (el de la toma «naves en obra»,
  que confirmó es el mismo que el terminado). Referencias subidas a Higgsfield: obra de frente `73d7668e…`, calle
  terminada `46685b87…`, hilera desde el dron `fdd66ff9…`. Resultado (GPT Image 2.5), lámina
  `docs/repaso/1-portada-tu-parque.jpg`: A de día `0c4c4b01…`, B atardecer `2617c302…`, C noche `10e8df26…`.
  Muy fieles al parque real. Falta que elija luz para animarla (Kling 3.0 4K, bucle 8 s, 48 créditos).
  Max preguntó por Seedance 2.5 (sí acepta inicio/fin + referencias; 1080p; 128 créditos/8 s) y luego dijo: «usa
  Higgsfield, no Seedance; queremos **imágenes**». Comparación de modelos de imagen en Higgsfield (noche, mismas
  referencias), lámina `docs/repaso/1-portada-modelos.jpg`: 1 Nano Banana Pro 4K `a2c9ac08…` (bien), 2 Nano Banana 2.1
  4K thinking high `db8918e5…` (la más parecida al parque real), 3 Soul Cinema `a58463e5…` (no sirve: dejó la obra),
  4 FLUX 3 4K `4b653cb6…` (bien). Salen a 5504×3072.
  Max: «es importante que no modifique las bodegas ya finalizadas; usa la toma de referencia desde arriba y regénerala
  a media altura con mayor panorama, sin perder altura de las bodegas ni su estructura». Referencias desde arriba
  (MAX 12/26/30/41 s): `c0ee9f40…`, `5d080df0…`, `fae9b557…`, `d92087de…` + `fdd66ff9…` y calle `46685b87…`. De día como
  las tomas. Lámina `docs/repaso/1-portada-media-altura.jpg`: 1 de frente toda la hilera (Nano Banana Pro 4K
  `a07b68bb…`, la mejor), 2 por la calle central (Nano Banana Pro `a6b0fb86…`), 3 y 4 (Nano Banana 2.1) quedaron muy
  altas. **Max eligió la 1** (de frente, toda la hilera). Para que en computadora quepa la hilera completa se amplió
  con outpaint de Higgsfield (21:9 `252d0089…` y luego 16:9 `9d9a2bc7…`, 2752×1536): `img/portada-parque.webp`
  (computadora) e `img/portada-parque-m.webp` (celular, la original más cerrada). Originales en
  `Material/fotos-elegidas/portada-parque-*.png`. Vista previa `?v=hero-p` en `/opciones/secciones/portada/`
  (A como está, B tu parque, imagen fija sin video; también cambia el pie). Video `docs/repaso/1-portada-tu-parque.mp4`.
  Grabadora de secciones: `tools/grabar.mjs`.
  Max: «antes rehacer la imagen a media altura y con un cielo de atardecer más llamativo» (y preguntó qué modelos:
  Nano Banana Pro y Nano Banana 2.1 de Google dentro de Higgsfield; outpaint de Higgsfield para ampliar). Edición de
  `a07b68bb…` sin tocar las bodegas, cámara ~12 m: lámina `docs/repaso/1-portada-atardecer.jpg` — 1 atardecer naranja
  y rosa (NB Pro `7bd6d3c4…`), 2 atardecer (NB 2.1 `07aae556…`), 3 justo después del atardecer con luces (NB Pro
  `2259fdef…`). 5504×3072, ya caben completas sin outpaint. **Eligió la 3** (Nano Banana Pro; Higgsfield la registra
  con el nombre interno «nano_banana_2»). Pidió la toma **más baja**: al editar, los modelos casi no mueven la cámara
  (`42bf7160…`, `bcc031d0…`, `94986e6f…`, `324312cf…` salieron iguales). La que sí bajó: NB Pro «3 m» `416bb466…`.
  Comparación `docs/repaso/1-portada-mas-baja.jpg`. **Max: «me gusta el ahora… sobre esa imagen trabajaremos la
  portada».** Se amplió solo a los lados (outpaint 21:9 `3cb75842…`, 3168×1344) — la versión 16:9 `1fb2a4c4…` agregaba
  mucho estacionamiento y se veía alta, se descartó. Computadora: `img/portada-parque.webp` (21:9); celular:
  `img/portada-parque-m.webp` (la original 4K reducida). Originales en `Material/fotos-elegidas/portada-atardecer-*`.
  Sombra del texto más ligera para que se vean las luces. **Publicada en el sitio el 2026-10-18** (portada y pie);
  se borraron la página de opciones de portada y los videos `portada-n*`.
  Max: «no me gusta el texto de introducción» («Una sola empresa responde por el terreno, el proyecto, la obra y el
  inmueble.»). Se le propusieron 6 títulos breves según los giros; **eligió «Naves industriales para rentar, comprar o
  construir.»** (publicado 2026-10-18). Menú sobre el cielo: resuelto (2026-10-18), menú y logo en blanco mientras se ve la foto
  (`.top.sobre-foto`, lo pone `fx/portada.js`).
  Max pidió rehacer con **Nano Banana Pro** la versión 2 (la de NB 2.1, a media altura) sin cambiar la estructura:
  A mismo atardecer `8c8ea37c…`, B cielo encendido con luces `6442af00…` (lámina `docs/repaso/1-portada-nbpro.jpg`).
  En el sitio sigue la «3 m» (`416bb466…`).
  Luego pidió compararla con **GPT Image 2.5 variante Sunburst, calidad máxima, 4K** (15 créditos c/u; ojo: antes se
  usaba con los valores por defecto flare/low/1k): atardecer `280b3dea…`, cielo encendido con luces `a5e658bd…`
  (3840×2160). Lámina `docs/repaso/1-portada-nbpro-vs-gpt.jpg`. **Eligió GPT Image 2.5 Sunburst max, cielo encendido con
  luces (`a5e658bd…`)** — publicada 2026-10-18: computadora `img/portada-parque.webp` (outpaint 21:9 `2f43f023…`,
  3168×1344, `object-position: 57% 60%`), celular `img/portada-parque-m.webp` (la original 16:9). Originales en
  `Material/fotos-elegidas/portada-gpt-*.png`.
  Después: «la toma a más baja altura, sin modificar bodegas y cielo». GPT Image 2.5 Sunburst max sí baja la cámara si
  se describe cómo se ve desde abajo: 1 «8 m» `3342b74c…`, 2 «4 m» `46df8593…` (ambas con techos ocultos y cielo grande);
  NB Pro «4 m» `db00119a…` casi no bajó. Lámina `docs/repaso/1-portada-mas-baja-2.jpg`. **Eligió la 2 («4 m»,
  `46df8593…`)** — publicada 2026-10-18. Para que en computadora quepa la hilera completa se amplió hacia arriba (más del
  mismo cielo) y abajo (más calle) a 3:2 con GPT Sunburst max `1068da52…` (3504×2336; bodegas idénticas, sin acercar):
  `img/portada-parque.webp` (3200 de ancho, `object-position: 50% 60%`). Celular: la 16:9 original
  (`img/portada-parque-m.webp`, 1600). Descartadas: outpaint 21:9 `bb3607a7…` (cambió el cielo a naranja) y GPT 21:9
  `3a381e02…` (acercó la toma). Originales en `Material/fotos-elegidas/portada-baja-*.png`.
  Max pidió la referencia y el prompt para hacerla él: carpeta local `Material/prompt-portada-baja/` (las 2
  referencias en orden, `prompt.txt` con modelo, ajustes y prompt exacto, y el resultado esperado).
  **Max la generó él y dijo «listo, usa esta»** (hilera de 8 naves con las 2 bajas a la izquierda y la caseta; llegó a
  1672×941). Publicada 2026-10-18: se subió a Higgsfield (`5c5b8c97…`), se amplió a 4K sin cambiarla (upscale
  `88e4ed8b…`, 4096×2313) → celular `img/portada-parque-m.webp` (2400). Computadora: ampliada arriba/abajo a 3:2 con GPT
  Sunburst max `bc5153f5…` (3504×2336, bodegas idénticas) → `img/portada-parque.webp` (3200). En el pie las naves quedaban
  bajo las letras: `.foot__poster` con `object-position: 50% 100%` y `scale(1.25)` desde abajo (`fx/salida.css`).
  Originales en `Material/fotos-elegidas/portada-max-*.png`.
  Después: «dame opciones con el texto en el cielo para que no tape las bodegas». Vista previa
  `/opciones/secciones/portada/` (`?v=cielo-a|b|c&solo=inicio`, solo CSS en `fx/variantes.css` con `[data-v-cielo]`):
  A arriba a la izquierda (título y botones juntos), B centrado, C título arriba y botones abajo sobre la calle.
  Lámina `docs/repaso/1-portada-texto-cielo.jpg`. **Eligió la B (centrado)** — publicada 2026-10-18 en `styles.css`
  (sombra desde arriba, `.hero__say` arriba y centrado; en teléfonos bajos más compacto; sin animación la frase de
  presentación va abajo). Se borraron la página de opciones y su CSS.
  Después: «opciones con vista previa para la versión celular de esta misma sección». Vista previa
  `/opciones/secciones/portada-celular/` (tres teléfonos de 390×844, `?v=movil-a|b|c&solo=inicio`; en computadora no
  cambia): A como está; B imagen vertical con toda la hilera (GPT Sunburst max 9:16 desde `bc5153f5…` →
  `f590744b…`, 2160×3840, naves idénticas → `img/portada-parque-m-hilera.webp`; `--hero-shift: -14svh` para que la
  franja quede dentro de IMAX); C título más grande arriba y los 4 botones en 2×2 abajo sobre la calle. Código en
  `fx/variantes.css` (`[data-v-movil]`) y `fx/variantes.js` (cambia la imagen en B). Lámina
  `docs/repaso/1-portada-celular-opciones.jpg`. **Esperando que elija.**

## Fotos usables del material real (2026-10-17)
Max: «dame fotos de mi material real que podrías usar». 14 cuadros (el más nítido de cada toma, medido con
`blurdetect`; sin letreros) en `Material/fotos-elegidas/` (local, ignorado por git) y lámina `docs/fotos-material-real.jpg`
con dónde iría cada una. Ojo: en `BODEGAS-MAX.mp4` y `NEXTIPAC.mov` el `-ss` antes de `-i` cae en cuadros
equivocados; usar búsqueda exacta (`-ss` antes y después de `-i`). Los interiores de Nextipac tienen letreros
(superficie, oficinas): no sirven. Los cuadros de video se ven bien en tarjetas, no a pantalla completa.

## Parque terminado (2026-10-18)
Max preguntó si hay tomas del parque de la toma «naves en obra de frente» ya terminado. Sí: mismo tipo de naves
(dientes de sierra, fachada rosa de ladrillo, columnas blancas) en `BODEGAS-MAX.mp4` 3–6 s y 69–70 s (calle interna,
dron bajo), 50–51 s (glorieta), 22 s (fachada), 19–20 s (techos) y en `MAX.mp4` 6–60 s (dron alto; 30, 36 y 41 s
muestran la fachada). Lámina `docs/parque-terminado.jpg`. No hay toma del mismo ángulo frontal que la obra; lo más
parecido es la calle interna. **Max confirmó que es el mismo parque** (2026-10-18).

## Sección nueva «Nuestros trabajos» (2026-10-16, noche) — EN PAUSA (Max la dejó para después)
Max decidió: el material real **solo** va en una sección nueva con sus trabajos (nada de antes/después, ni en
portada/parque/proceso). Vista previa `/opciones/secciones/trabajos/` (`?v=trab-a|b|c&solo=trabajos`,
código en `fx/variantes.*`; la sección se inserta antes de Contacto):
- A: video de 14 s con cortes rápidos (`media/trabajos/reel*`) a todo lo ancho, título encima.
- B: muro de 8 tarjetas que caen, cada una un video real en bucle (`media/trabajos/<toma>-m.mp4`).
- C: pantalla grande que pasa las tomas una por una + 8 tarjetas para elegir (la activa con marco amarillo).
Tomas (11, sin letreros, cámara lenta 2/3 a 30 fps, en `media/trabajos/` e `img/trabajos/`): terreno,
estructura, colado, bomba, colado-interior, obra-dron, obra-frente, nave, calle, parque, escalera. Recortes:
`0124` 2976×1674+420+0, `BODEGAS` 2610×1468+603+0, `MAX` 3288×1850+264+0, `NEXTIPAC` 2160×1215+0+1150.
Cuando elija: pasar la sección a `index.html`/`styles.css`/`fx/auto.js`, borrar `trab` de `variantes.*` y
retirar las opciones con material real de la vista previa de portada/parque/proceso (B) y de Contacto (C).
Los videos de antes/después hechos con IA se descartaron y se borraron.

## Material real: revisión segundo a segundo (2026-10-16, tarde)
La carpeta `IMAX/` ahora se llama **`Material/`** (mismo contenido, ignorada por git). Se revisó cuadro por cuadro:
- `0124 (1).mp4` = `VIDEOS/iMAX.mov` (mismo video). `Parques.mp4` = `BODEGAS-MAX.mp4` (mismo video).
- **`MAX.mp4` 5–62 s**: casi un minuto de dron sobre un parque de naves blancas; el letrero va abajo y se recorta
  (`crop=3288:1850:264:0`). Ya se preparó `media/real-parque*` (24–29 s) y la opción Parque B en
  `/opciones/secciones/real/` (`?v=tour-b`). La fuente se ve algo suave (es video reescalado), pero aguanta.
- `0124` 14–17 s: **interior de nave vacía** (letrero en la esquina inferior izquierda → recortar abajo ~20 %);
  10–13 s naves en obra desde dron; 23–25 bomba de concreto; 31–35 colado interior. Útiles para servicios/proceso.
- `BODEGAS-MAX` (subtítulos chicos al centro abajo): calle interna del parque 3–6 s, techos 19–20, estructura de
  acero 26–27, terreno urbanizado 35–37, terracerías con retro 62–66. Mezcla tomas de banco (gente con casco,
  apretones de mano, planos): **no usar esas**.
- `NEXTIPAC.mov` (vertical): interiores limpios 33–41 s (escalera, oficinas, baño); vista aérea limpia 1:09.
  Tiene cifras de esa bodega (2,561 m², 12 m de altura…): no ponerlas como dato general de IMAX.
- Fotos: 2 fachadas de una nave (960×1280) y el logo.

## Material real revisado (2026-10-16)
Max dejó la carpeta `IMAX/` (y `IMAX-tomas-4K/`, que son las imágenes de inicio/fin de las tomas de IA).
- Casi todos los videos reales son **promocionales ya editados con letreros o subtítulos encima** y mezclan
  tomas de banco (gente con casco, planos, apretones de mano) que **no son de IMAX** → no usar esas.
- Tramos limpios en 4K: `0124 (1).mp4` 2–6 s (nave blanca desde dron) y 51–55 s (nave en obra con revolvedora);
  `VIDEOS/NEXTIPAC.mov` 33–41 s (interiores, vertical). El video de dron del parque sin letreros
  (`VIDEOS/VIDEO-2025-11-12-16-17-25.mp4`) solo está en baja calidad (848×480).
- Fotos: 2 fachadas de una nave (960×1280, celular). Logo i-MAX.
- WhatsApp **33 1467 1188** (de la lona): Max confirmó; ya está en `CONFIG` y visible en Contacto.
- Vista previa `/opciones/secciones/real/`: portada y proceso, A = como está, B = toma real
  (`media/real-nave*`, `media/real-obra*`, en cámara lenta ½ porque la fuente es de 60 cuadros; la portada en bucle
  ida y vuelta). Variantes `?v=hero-b` y `?v=proc-b` en `fx/variantes.*`. **Esperando que Max elija A o B en cada una.**
- Datos reales que aparecen en sus videos: «operaciones desde 2010», bodega en **Nextipac** (venta o renta).
  Confirmar con Max antes de ponerlos.
- **Pedir a Max los videos originales de dron sin letreros** (los que usó su editor).

## Siguiente paso inmediato
1. **Material real de IMAX.** Max está pasando fotos y videos reales de naves y parques que hizo IMAX a la carpeta
   `material-real/` (en la Mac, ignorada por git). Revisarlos y proponer dónde va cada uno (portada, servicios,
   parque, proceso). El material real **sustituye** al generado por IA y no lleva la etiqueta «Imagen ilustrativa».
   Videos: prepararlos como los actuales (ver `docs/VIDEO.md`: 3 tamaños, 30 fps, ~5 s, sin audio).
2. **Sección Contacto**: vista previa publicada en `/opciones/secciones/contacto/` (`?v=cont-a|b|c` en
   `fx/variantes.*`). A = como está; B = botón grande de WhatsApp + formulario corto con 4 tarjetas de interés que
   caen (sin dibujo a escala ni campos técnicos); C = B con la toma real de la nave en video en lugar del dibujo.
   **Esperando que Max elija A, B o C.**
3. Después: repasar el **pie** si Max lo pide.

## Lo que falta que Max dé o decida
- **Datos de contacto**: WhatsApp (con lada 52…), teléfono, correo y dirección → `CONFIG` al inicio de `script.js`.
  Sin el WhatsApp **el formulario no envía**.
- ¿El sitio dice «IMAX» o «i-MAX»? (en textos y en la palabra grande de la portada). Hoy dice «IMAX»; el logo dice «i-MAX».
- ¿El acento amarillo `#ffc20e` se cambia al naranja del logo?
- En qué ciudades / zonas opera IMAX; si hay naves disponibles (inventario real).
- Revisar los textos de servicios, parque, proceso y preguntas.

## Técnico
- **www.grupoimax.mx falla el certificado**: en GoDaddy, el CNAME `www` debe apuntar a `maxmarqueza.github.io`, y
  faltan 3 registros A de GitHub Pages (185.199.109.153, 185.199.110.153, 185.199.111.153; ya existe .108.153).
  Hoy (verificado con dig): `grupoimax.mx` → 185.199.108.153 y `www` → CNAME a `grupoimax.mx`. Lo tiene que
  cambiar Max (GoDaddy bloquea automatización) o desde su Chrome con la extensión.
- Probar en un **iPhone real** (solo se probó en simulador).
- `fx/variantes.*` todavía tiene las opciones B/C de «De polvo a nave»; se pueden borrar si Max no las quiere ver más.
- `scrollcraft.js` (motor heredado) sigue cargado para textos `data-sc-cue` y videos; podría retirarse con cuidado
  si se migra todo a `fx/auto.js`, pero no es urgente.

## Otros proyectos mencionados (no iniciados)
- Max preguntó cómo crear imágenes de un doctor (cliente suyo) con su identidad en escenas de oftalmología.
  Recomendación dada: **Nano Banana Pro (4K)** en Higgsfield con su foto como referencia, o **Higgsfield Soul 2.0
  con Soul ID** si se harán muchas (entrenar con 10–20 fotos). Requiere consentimiento del doctor y que las escenas
  correspondan a lo que realmente hace. No se ha hecho nada todavía.
