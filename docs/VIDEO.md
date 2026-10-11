# Videos — cómo se hicieron y cómo rehacerlos

## Reglas
- Video real/fotorrealista, **~5 s**, sin audio, que corre **solo al aparecer** (o en bucle en la portada/pie).
- Publicar **tres tamaños** por video: `nombre-4k.mp4` (3840 px), `nombre.mp4` (2560 px) y `nombre-m.mp4` (~1280 px).
  El HTML los declara con `data-src` / `data-src-mobile` / `data-src-4k` (o `data-sc-src*` en las escenas del motor).
- **Codificar ya a la velocidad final, a 30 fps, y reproducir a 1×.** Reproducir un archivo acelerado con
  `playbackRate` (2.6×) hacía que se viera cortado y en cámara lenta (el navegador no decodifica 60 cuadros/s en 1440p/4K).
- Imagen de espera (poster) = primer cuadro a 2560 px en WebP.

## Generación (Higgsfield · Kling 3.0 · modo 4K)
- Salida: 3852×2152, 24 fps. Costo: 6 créditos por segundo (5 s = 30, 7 s = 42, 8 s = 48).
- Interfaz: `higgsfield.ai/es/ai/video?model=kling3_0` en el Chrome de Max. Subir «Fotograma inicial» y, si aplica,
  «Fotograma final»; pegar la indicación; **Mejora desactivada** y **sonido desactivado**; duración; 4K; Generar.
  Para quitar cuadros de una toma anterior: pasar el cursor por la miniatura y su botón X.
- Las imágenes de inicio/fin (PNG 2752×1536) están en la Mac: `scrollcraft/builds/imax/out/`.
- Indicaciones exactas de las tomas actuales: ver `docs/VIDEO-4K-origen.md`. Toma del parque (2026-10-07), inicio
  `out/parque-clean.png`, 5 s:
  > Cinematic aerial drone shot at golden hour, smooth slow descent and glide forward along the central boulevard of a
  > modern industrial park: entrance gatehouse, landscaped median with lamp posts, white industrial warehouses on both
  > sides with loading docks and parked trailers, a semi truck slowly driving in, mountains in the background. Steady
  > stabilized gimbal motion, photorealistic, 4K, crisp detail, no text.

## Recetas ffmpeg (ffmpeg en `/Users/max/.local/bin/ffmpeg`)

Unir dos tomas que comparten el cuadro de unión (quitar el último cuadro de la primera):
```bash
ffmpeg -i toma1.mp4 -i toma2.mp4 -filter_complex "[0]trim=end_frame=168,setpts=PTS-STARTPTS[a];[1]setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0[v]" -map "[v]" -c:v libx264 -crf 10 -preset slow -pix_fmt yuv420p maestro.mp4
```

Codificar un tamaño (acelerando ×F; F=1 si no se acelera):
```bash
ffmpeg -i maestro.mp4 -vf "setpts=PTS/F,fps=30,scale=2560:-2:flags=lanczos" -c:v libx264 -preset slow -crf 21 -g 30 -pix_fmt yuv420p -movflags +faststart -an media/nombre.mp4
# 4K: scale=3840:-2, crf 22–24 · celular: scale=1280:-2 (o 1294), crf 23–24
```
Valores usados: despiece (14 s → ×2.6 = 5.4 s), obra (12 s → ×2.4 = 5 s), parque (5 s, ×1), portada (8 s bucle, 24 fps, ×1).

Poster:
```bash
ffmpeg -i maestro.mp4 -frames:v 1 -vf "scale=2560:-2:flags=lanczos" -c:v libwebp -quality 80 img/nombre-poster.webp
```

## Si se cambia el video de «De polvo a nave» hay que rehacer 3 archivos
Se calculan sobre el **maestro sin acelerar** (337 cuadros); `fx/replanteo.js` y `fx/cielo.js` los ubican por
proporción (`currentTime / duration × 336`).

1. `media/polvo-mate.webp` (9×9 celdas, cuadros 0–160 de 2 en 2, 96×54 c/u): diferencia contra el cuadro 0.
```bash
ffmpeg -i M -vf "select=eq(n\,0),scale=96:54" -frames:v 1 ref.png
ffmpeg -i M -vf "select='lte(n\,160)*not(mod(n\,2))',scale=96:54" -vsync 0 fr%03d.png
for f in fr*.png; do ffmpeg -y -i $f -i ref.png -filter_complex "[0]format=gray[a];[1]format=gray[b];[a][b]blend=all_mode=difference,curves=all='0/1 0.035/1 0.11/0 1/0',gblur=sigma=1.4,format=gray[m];color=white:s=96x54,format=rgba[w];[w][m]alphamerge" -frames:v 1 m_$f; done
ffmpeg -framerate 1 -i m_fr%03d.png -vf "tile=9x9:padding=0:margin=0" -frames:v 1 sprite.png
ffmpeg -i sprite.png -c:v libwebp -quality 70 -alpha_quality 70 media/polvo-mate.webp
```
2. `media/cielo-mate.webp` (10×9 celdas, todos los cuadros de 4 en 4): igual que arriba con
   `select='not(mod(n\,4))'`, curva `'0/1 0.09/1 0.17/0 1/0'`, `gblur=sigma=1` y `tile=10x9:...:color=white@1`.
3. `media/cielo-mascara.png` (486×270): perfil de la sierra en el cuadro 0 — para cada columna, primer píxel entre
   el 18 % y el 45 % del alto donde la luminancia baja del 80 % del cielo; mediana de 5 columnas; blanco opaco
   arriba de la sierra, transparente abajo, borde de 2 px. (Script Python en el historial; ~25 líneas.)

## Verificar fluidez
`node tools/fluidez.mjs` (servidor local encendido): debe dar ~30 fps, 0 cuadros perdidos y 0 pausas en
computadora, 4K y celular. `node tools/src4k.mjs` confirma qué tamaño carga cada pantalla.
