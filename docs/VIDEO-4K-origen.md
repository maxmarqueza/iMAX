# Tomas 4K para IMAX (Higgsfield · Kling 3.0)

Preparado el 2026-10-05. Imágenes ya subidas a la cuenta de Higgsfield de Max (workspace privado).
Ajustes de todas: modelo `kling3_0`, `mode: 4k`, `sound: off`, `aspect_ratio: 16:9`.
Costo total calculado: 204 créditos (sin repeticiones).

| # | Toma | Inicio → final (media_id) | Duración | Créditos |
|---|---|---|---|---|
| 1 | Portada (bucle, también va en el pie) | `d5fd6a57-063f-4e4f-87d0-9a35f495aa6e` → el mismo | 8 s | 48 |
| 2 | De polvo a nave 1: polvo y piezas | `fcf8fea2-7982-44c7-ab6f-ab12a438447d` → `74b062f2-df53-4f30-9b3b-8f998d4caf7d` | 7 s | 42 |
| 3 | De polvo a nave 2: se arma la nave | `74b062f2-df53-4f30-9b3b-8f998d4caf7d` → `f0c0fecb-4b23-439f-9ee8-75f078b97ff8` | 7 s | 42 |
| 4 | Proceso 1: terreno → estructura (noche) | `f0ab0b5c-304f-4752-b54b-beebef1253df` → `c083f051-5038-4af6-bc3b-76c999c38a17` | 6 s | 36 |
| 5 | Proceso 2: estructura → nave iluminada | `c083f051-5038-4af6-bc3b-76c999c38a17` → `d5fd6a57-063f-4e4f-87d0-9a35f495aa6e` | 6 s | 36 |

Archivos locales de origen (`out/`): 1 `hero.png` · 2 `polvo-a.png` → `total-a.png` · 3 `total-a.png` → `dp-fl.png` · 4 `terreno.png` → `estructura.png` · 5 `estructura.png` → `hero.png`.
Las tomas 2+3 y 4+5 se encadenan porque comparten el cuadro de unión.

## Prompts

1. Locked-off aerial drone shot at blue hour, very slow dolly forward. A modern industrial warehouse with all loading dock lights glowing warm amber, reflections shimmering on the wet concrete yard, faint clouds drifting over the mountains, subtle realistic light flicker. Photorealistic, 4K, sharp detail, no people, no text. Seamless loop: last frame matches first frame.
2. Static aerial camera, golden hour desert. Wind lifts a dense dust storm across the empty graded concrete pad. Inside the dust, every part of an industrial warehouse materializes and hovers in place: steel columns, roof trusses, purlins, roof sheets floating above, precast wall panels standing on all four sides, glass office entrance and loading docks. Physically plausible motion, photorealistic, 4K, crisp detail, no people, no text.
3. Static aerial camera, golden hour desert. The floating pieces assemble into one finished industrial warehouse: trusses and purlins lower onto the columns, roof sheets slide down and seal the roof, wall panels close the four facades, the dust settles and clears, revealing a clean finished building with loading docks and a concrete truck yard. Smooth precise mechanical motion, photorealistic, 4K, crisp detail, no people, no text.
4. Locked-off camera at blue hour over a wet empty construction site with puddles. Timelapse: the steel frame of an industrial warehouse rises from the ground, columns, beams and roof trusses go up, a crawler crane works on the right, work lights switch on. Photorealistic construction timelapse, 4K, crisp detail, no text.
5. Locked-off camera at blue hour. Timelapse: the steel structure is enclosed, wall panels and the roof close in, the crane leaves, the yard is paved, and all loading dock lights turn on warm amber, reflecting on the wet concrete. Finished modern industrial warehouse. Photorealistic construction timelapse, 4K, crisp detail, no text. (Higgsfield sugiere el preset «IN THE DARK»; generar literal con `declined_preset_id: 24bae836-2c4a-48e0-89b6-49fcc0b21612`.)

## Después de generar
- Revisar cada toma cuadro por cuadro; repetir solo la que falle.
- Unir 2+3 → `media/despiece.mp4` y 4+5 → `media/obra.mp4`; regenerar los mates (`media/polvo-mate.webp`, `media/cielo-mate.webp`, `media/cielo-mascara.png`) porque cambian con el video.
- Codificar tres tamaños: 4K para pantallas grandes, 1080p y la versión ligera del celular.
