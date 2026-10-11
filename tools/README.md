# Herramientas de verificación

Requiere Node 20+ y Google Chrome en `/Applications/Google Chrome.app`. Una vez: `cd tools && npm install`.

1. Servidor local sin caché (desde la raíz del repo): `node tools/serve.mjs --root . --port 4173`
2. Scripts (correr dentro de `tools/`; guardan capturas en `tools/lab/`, ignorada por git):
   - `node vista-shots.mjs lab/web 1440 900` · `node vista-shots.mjs lab/cel 390 844` — recorre el sitio sección por
     sección y arma hojas `hoja-N.jpg`. `SITE=https://grupoimax.mx/` para probar el sitio en línea.
   - `node solo.mjs` — captura una página de opciones (cambiar la URL dentro del archivo a la página nueva).
   - `node fluidez.mjs` — mide la reproducción del video de «De polvo a nave» (fps, cuadros perdidos, pausas).
   - `node src4k.mjs` — qué archivo de video carga cada pantalla.
   - `node movil-tira.mjs <carpeta> <desde> <hasta> <paso>` — tira de cuadros en tamaño celular (pantallas de scroll).
   - `node secciones.mjs 390 844` — posición y alto de cada sección.
   - `node jank.mjs` — busca tirones de página/video con Chrome visible.
