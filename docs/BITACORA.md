# Bitácora de decisiones — IMAX

Qué pidió Max, qué se hizo y qué rechazó, en orden. Sirve para no repetir propuestas ya descartadas.
Las citas entre comillas son palabras de Max.

## 2026-10-03 — Arranque
- Landing inicial publicada en `grupoimax.mx` (GitHub Pages + dominio de GoDaddy, redirección a HTTPS).
- Rechazó un rediseño con fotos pero sin movimiento: «no hay animaciones, ni videos, ni nada de motion». Su
  referencia de calidad es **motionsites.ai** (es miembro de pago): video de fondo, tipografía grande, movimiento.
- Pidió la nave «desconstruida que se construye». Rechazó una nave 3D (Three.js): «lo buscaba con imagen real».
  Rechazó un video donde solo flotaba el techo: «me refiero absolutamente a toda la bodega. Que se vea de cero, de polvo».
  → Video fotorrealista: terreno vacío → polvo → nave entera en piezas → nave armada.
- Pidió: «no quiero que me estés dando instrucciones, necesito que tú estés haciendo las tareas».
- Pidió respuestas breves, decir el siguiente paso y «todo velo apuntando en md».

## 2026-10-04 — Dirección visual y portada
- Versión oscura (azul marino/ámbar): «No me gusta todo oscuro… Dame opciones». Se hicieron 3 direcciones claras
  (`/opciones/`: A Concreto, B Plano, C Hora dorada). Primero eligió C, luego **«opción A mejor»** → **Concreto**.
- Portada: no quiere mucho texto al inicio; quiere **IMAX grande con la nave dentro de las letras** y luego la nave
  completa con la frase. Altura de portada: eligió la corta («abarca demasiado» la larga; el tamaño de letra estaba bien).
- Bajo IMAX: «Inmobiliaria, desarrolladora y constructora de naves y parques industriales.»
- Quitar el indicador «Desliza».
- Logo i-MAX aplicado a barra, pie (blanco), favicon, imagen para compartir y datos estructurados.
- Celular: «se ve rara la transición» → se adaptó; luego «se va muy rápido… se traba» → varios intentos (pasos con
  snap, retrasos) que **rechazó**; pidió que fuera «como el sitio web».
- **Cambio de rumbo clave**: «Prefiero que ya no tenga el efecto de scroll… que tenga un efecto en automático al
  aparecer, de muy poco tiempo». Vista previa en `/vista/`, la aprobó («pásala al sitio») → **sitio sin scroll**.
- «haz las animaciones más rápidas» → todo se acortó (portada ~2.5 s, tarjetas ~0.4 s).
- Servicios: ya no carrusel; las 4 tarjetas a la vista. De 3 entradas eligió **A (caen y rebotan)**. De 6 efectos
  de cursor no le gustó ninguno («solo algo que la destaque»); de 6 sobrios eligió **«la 2 con la 1»** = se eleva +
  marco amarillo.
- Pidió revisar **sección por sección, no todas de golpe**, y ver **solo la sección** que va a elegir → páginas de
  opciones de una sola sección (`?solo=`).

## 2026-10-05 / 06 — Videos 4K
- «se ve con bastante mala calidad» → regenerar en 4K con Higgsfield. Comparados: Kling 3.0 4K (60 créditos/10 s),
  Seedance 2.0 4K (220), Seedance 2.5 (solo 1080p). Se eligió **Kling 3.0 en modo 4K**.
- Los créditos de Max estaban en la cuenta de su Chrome (no en la conectada al agente). Max: «hazlo tú adelante»
  → 5 tomas generadas desde su Chrome (204 créditos), publicadas en 3 tamaños.
- «se ve como cortado en cámara lenta… se traba»: se reproducía al 2.6×. Solución: archivos ya acelerados a 30 fps
  reproducidos a 1×. Max: «mucho mejor».
- De polvo a nave: se queda la **opción A** (el video como está).

## 2026-10-06 / 07 — Contenido técnico fuera
- Ficha técnica: **quitada** («son cuestiones muy técnicas… va a variar cada bodega y cada parque»).
- Después: «sí, quita esa sección porque cada bodega es diferente» → fuera también la franja de cifras, las medidas
  sobre la nave, las especificaciones de las etiquetas y las cifras de parque y preguntas.
- Volvió a pedir: «Quiero que sea siempre breve y conciso, apúntalo».

## 2026-10-07 — Parque y proceso
- Parque: «tiene que ser video, no con efecto de scroll down, un par de segundos» → video 4K de dron (30 créditos)
  que corre solo + 5 tarjetas.
- Proceso: «dale opciones al proceso, con video» → eligió **C** (video con título y 5 tarjetas debajo; se conserva
  el comparador de tres tiempos al terminar el video).

## 2026-10-10 / 11 — Preguntas y material real
- Preguntas frecuentes: eligió **B** (tarjetas que caen, 2 columnas).
- Va a pasar **fotos y videos reales** de naves y parques de IMAX → carpeta `material-real/`.
- Pidió dejar todo documentado para continuar en **Codex** → `AGENTS.md` + `docs/`.

## Rechazado (no volver a proponer)
- Efectos ligados al scroll de cualquier tipo (pin, scrub, parallax, snap por pasos).
- Sitio todo oscuro.
- Modelos 3D o ilustración en lugar de imagen/video fotorrealista.
- Carruseles que se deslizan de lado.
- Efectos de cursor complejos (inclinación 3D, cortina con panel, cursor personalizado, plano técnico, foco que apaga a las demás, expansión).
- Ficha técnica y cualquier cifra técnica fija.
- Respuestas largas, tablas, listas de lo ya hecho.

## 2026-10-16 — Revisión del material real
- Se revisó la carpeta `IMAX/`: videos promocionales con letreros encima; pocos tramos limpios. Se le pidió a Max
  los originales sin letreros y confirmar el WhatsApp de la lona (33 1467 1188). Detalle en `PENDIENTES.md`.
- Max confirmó el WhatsApp 33 1467 1188 → puesto en el sitio. Se armó la vista previa con las dos tomas reales
  limpias (portada: nave blanca desde dron; proceso: obra con revolvedora).
- Contacto: se prepararon 3 opciones (A como está, B directo con WhatsApp y tarjetas de interés, C igual con el
  video real de la nave). Esperando su elección.
- Max avisó que el material real está en la carpeta `Material/` (es la misma que `IMAX/`, renombrada). Revisión
  segundo a segundo: se encontró un minuto limpio de dron sobre su parque en `MAX.mp4` → opción Parque B en la
  vista previa de tomas reales. Detalle de todas las tomas útiles en `PENDIENTES.md`.
- Higgsfield con material real: se hizo «tu obra se termina» con final generado por IA desde el dron → **no le
  gustó** («la tomas desde arriba»). Pidió analizar todo el material y usar una foto real en obra y otra real
  terminada. Se le propusieron 3 parejas a nivel de piso (A estructura→interior, B obra de frente→fachada,
  C colado→foto de su bodega).
- Tampoco le encantaron las parejas a nivel de piso: «olvidemos el antes y después y usemos el material».
  Se le propusieron 5 usos directos de sus tomas reales (portada, servicios, parque, proceso y una sección nueva
  «Nuestras obras»).
- Después: «olvídalo, mejor solo usaremos nuestro material real para una sola sección en la que aparecerán
  nuestros trabajos». Se armó «Nuestros trabajos» con 3 opciones (A video a lo ancho, B muro de videos,
  C pantalla y tarjetas). Se borraron los videos de antes/después generados con IA.
- «Olvida mejor ahorita nuestro material, vamos repasando el sitio sección por sección». Material real en pausa
  (la vista previa de Nuestros trabajos sigue en línea). Se empezó por la portada.
- Portada: «así no son las naves industriales reales». Nueva regla: las imágenes generadas deben parecerse a sus
  naves reales (lámina blanca, techo de dientes de sierra, fachada de block o ladrillo, cortinas blancas, escala
  mexicana), no a centros de distribución de EE. UU. Se le mandaron 3 imágenes para elegir antes de animar.
- Preguntó con qué se hacían las propuestas (Higgsfield, GPT Image 2.5) y pidió mejor **naves y parques reales**.
  Se le mostraron 6 videos reales de naves en México de Pexels (uso libre) para la portada.
- «Olvídalo mejor, la recreamos en Higgsfield». Se recreó la portada con Kling 3.0 4K en 3 versiones con naves como
  las de México (bodega de block, hilera de naves, nave blanca con andenes) y se le mandó un video con las 4.
- «Dame opciones de naves industriales» → 6 tipos de nave de México para la portada (imágenes, antes de animar).
- Max: «¿no es mejor, con esas referencias, recrear una mejor imagen frontal de todas las bodegas?». Se recreó su
  hilera de bodegas terminada, de frente, con sus tomas reales como referencia (día, atardecer y noche).
- «Podemos utilizar Higgsfield para esta recreación, no Seedance. Queremos imágenes» → se compararon 4 modelos de
  imagen de Higgsfield con la hilera de su parque de noche (Nano Banana Pro, Nano Banana 2.1, Soul Cinema, FLUX 3).
- Regla nueva: **no modificar las bodegas terminadas** al recrear; usar las tomas desde arriba como referencia y
  cambiar solo la cámara (media altura, panorama con todas las bodegas, sin perder su altura ni estructura).
- Portada: eligió **su parque recreado de frente a media altura** (imagen fija, sin video). Se amplió a los lados y
  arriba/abajo para que en computadora se vea la hilera completa. En vista previa como opción B.
- Portada definida: **su parque recreado de frente, más bajo, con atardecer encendido y luces** (Nano Banana Pro en
  Higgsfield, ampliado a los lados). «Sobre esa imagen trabajaremos la portada.»
- «Así está bien, pásala al sitio» → portada y pie con su parque al atardecer, publicados. Siguiente en el repaso:
  Servicios.
- Título de la portada: «Una sola empresa responde por el terreno, el proyecto, la obra y el inmueble.» → **«Naves
  industriales para rentar, comprar o construir.»** (eligió la 2 de 6 propuestas). Quiere títulos breves y concisos.
- Menú de arriba ilegible sobre el cielo de la portada → ahora va en blanco (con logo blanco y sombra suave) mientras
  se ve la foto; al bajar vuelve a la barra clara.
- Portada final: comparó Nano Banana Pro contra **GPT Image 2.5 Sunburst en calidad máxima** y se quedó con la de GPT,
  cielo encendido con luces, a media altura y sin cambiar la estructura de las bodegas. Publicada.
- «La toma a más baja altura, sin modificar bodegas y cielo» → GPT Image 2.5 Sunburst max a ~4 m (la 2 de 3). Publicada
  en portada y pie; en computadora se amplió solo hacia arriba y abajo (mismo cielo, más calle) para que se vea la
  hilera completa. Se descartó un outpaint que cambiaba el color del cielo.
- Max pidió la imagen de referencia y el prompt completo de la toma baja para generarla él → `Material/prompt-portada-baja/`.
- Max generó él mismo la toma baja con ese prompt y dijo «listo, usa esta». Se amplió a 4K sin cambiarla, en
  computadora se le agregó cielo y calle para que quepa la hilera completa, y en el pie se acercó para que las letras
  muestren las naves. Publicada en portada y pie.
- Pidió el texto de la portada en el cielo para que no tape las bodegas → 3 opciones (izquierda, centrado, título arriba y botones abajo).
- Texto de la portada: eligió la **B, centrado en el cielo** (título y botones). Las bodegas quedan libres. Publicada.
- Pidió opciones de la portada solo para celular → A como está, B toda la hilera (imagen vertical), C botones abajo al alcance del pulgar.
- Celular: eligió la B (imagen vertical con toda la hilera) y pidió el texto abajo, sobre la calle → 3 opciones (centrado, a la izquierda con botones 2×2, título bajo las naves).
- Celular: Max dijo «continuar» → se aplicó la C (imagen vertical con toda la hilera, título justo bajo las naves y botones al pie sobre la calle). Publicada.
- Max mandó su imagen vertical para celular (hilera en perspectiva) y pidió opciones con vista previa → ampliada a 4K sin cambiarla; A todo abajo, B título arriba y botones abajo, C título a la derecha y botones abajo.
- Celular: eligió la C con su imagen (título arriba a la derecha, botones abajo). Pidió máxima calidad: portada en 4K completo en celular y computadora. Publicada.
- Portada: Max pidió quitar los cuatro botones y la etiqueta «Imagen ilustrativa». Queda solo el título. Publicado.
- Pidió un efecto de entrada del cielo, las naves y el texto → 3 opciones con vista previa (dentro de IMAX; las naves se levantan; todo cae), con la foto separada en capas.

- Max quiere que las naves se vean construirse desde cero con Seedance 2.5 → prompts para ChatGPT de 4 etapas (terreno, cimientos, acero, muros) en `docs/prompts-construccion.md`.

- Max hizo con ChatGPT las 4 etapas de obra en vertical (terreno, cimientos, acero, muros; `Material/obra-celular/`). Subidas a Higgsfield (`7a0c586b…`, `f40168c5…`, `dcf280c4…`, `19f99fdf…`) y time-lapse Seedance 2.5 omni 8 s 1080p 9:16 sin audio hacia la portada de celular (`a0f915a5…`): job `ce2f95cf…` (128 créditos).
