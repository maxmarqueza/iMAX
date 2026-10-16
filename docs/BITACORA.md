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
