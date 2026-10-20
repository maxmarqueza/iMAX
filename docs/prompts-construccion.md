# Prompts para las imágenes de referencia del time-lapse (ChatGPT)

Para el video de la portada en el que las naves se construyen desde cero (Seedance 2.5, de la primera a la última imagen).
En cada prompt se adjunta la portada final: `Material/fotos-elegidas/portada-max-alta-4k.png` para computadora (3:2) o
`Material/fotos-elegidas/portada-celular-max-4k.png` para celular (vertical). Generar en orden y, desde la etapa 2, adjuntar
también la imagen de la etapa anterior para que no cambien la cámara ni el lugar.

Regla común (va al final de cada prompt): misma cámara, mismo encuadre, misma calle, mismo cielo de atardecer y la misma
posición y tamaño de la hilera de naves que en la foto adjunta. Foto real, sin personas cerca de la cámara, sin texto.

## 1. Terreno vacío
Use the attached photo as the exact reference for camera position, lens, framing, street and sunset sky. Show the same
place BEFORE construction: where the row of industrial buildings stands there is only a flat, leveled dirt lot of
compacted earth with a few survey stakes and string lines marking the outline of the future buildings. Keep the street,
its wet reflections, the curb and the fiery sunset sky exactly the same. Same aspect ratio. Real photograph, no
buildings, no people, no text.

## 2. Cimientos y piso
Same camera, framing, street and sunset sky as the attached photos. The lot now shows the concrete foundation slab and
footings of the future row of industrial units, exactly where and as wide as the buildings in the final photo, with
rebar sticking up at the column positions, a concrete pump truck parked on the side and orange work lights. No walls yet.
Real photograph, no text.

## 3. Estructura de acero
Same camera, framing, street and sunset sky as the attached photos. On the same slab, the white steel frame of the row
of units is standing: columns and the zigzag sawtooth roof trusses, exactly matching the shape, height and position of
the buildings in the final photo, with no walls or roof sheets yet, so the sky shows through. A crane and a scissor lift
on the side, work lights on. Real photograph, no text.

## 4. Muros y lámina
Same camera, framing, street and sunset sky as the attached photos. The row of units is almost finished: salmon-pink
brick facades with the same windows, white columns and the white metal sawtooth roof sheets, exactly like the final
photo, but the roll-up doors are not installed yet (dark openings), there is scaffolding on two units, construction
debris and no parked cars. Real photograph, no text.

## 5. Terminada
La portada final tal cual (la imagen adjunta). No se genera.

## Prompt reforzado para Seedance 2.5 (time-lapse sin saltos)
Modo omni_reference, 9:16, 1080p, sin audio; inicio = 1-terreno, final = portada de celular, referencias = 2-cimientos,
3-acero, 4-muros. Duración sugerida 12 s (más tiempo entre etapas = cambios más pequeños) y luego acelerar a ~4–5 s.

Continuous real construction time-lapse filmed from ONE fixed tripod camera that never moves, never zooms and never
cuts: every frame keeps exactly the same framing, horizon, street, arrow and crosswalk. Show the actual building
process growing gradually and physically, piece by piece, with no jumps, no dissolves and no morphing between the
reference images: survey lines on the empty lot, excavators leveling the ground, formwork and rebar placed, concrete
poured section by section from left to right until the slab matches the second reference; then white steel columns
lifted one by one by a crane, beams and zigzag sawtooth roof trusses bolted on, bay after bay, until the frame matches
the third reference; then brick walls rising course by course, windows set, white roof sheets installed panel by panel
and scaffolding moving along the units until it matches the fourth reference; finally scaffolding removed, roll-up
doors installed, lights switched on, pallets and parked cars arriving, ending exactly on the final image. Each stage
flows into the next as a believable continuation; workers and machines appear only as fast motion blur. The fiery
sunset sky, light and wet street reflections stay constant. Photorealistic construction footage, no text, no logos.
