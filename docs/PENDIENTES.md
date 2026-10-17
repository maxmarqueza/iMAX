# Pendientes — IMAX (al 2026-10-11)

## Propuestas para usar el material real tal cual (2026-10-16, noche)
Max descartó el «antes y después» (ni aéreo ni a nivel de piso): **usar las tomas reales tal cual**.
Lámina `docs/propuestas-material.jpg`:
1. Portada: su nave blanca (ya en vista previa B).
2. Servicios: cada tarjeta con una toma real que corre sola (renta → interior vacío `0124` 15 s; venta → foto de
   fachada; construcción → estructura de acero `BODEGAS` 27 s; parques → calle interna `BODEGAS` 4/69 s).
3. Parque: su parque desde el dron (`real-parque`, ya en vista previa) o la calle interna.
4. Proceso: los 5 pasos con sus obras (terreno `BODEGAS` 85, terracerías 62, estructura 27, colado 47,
   naves en obra `0124` 49).
5. Sección nueva «Nuestras obras»: video corto con cortes rápidos (bomba de concreto, drenaje, escalera
   Nextipac, naves en obra, fachada).
Higgsfield se usaría solo para **mejorar la nitidez** (escalar a 4K) sin cambiar lo que se ve.

## Video «de obra a terminada» con Higgsfield (2026-10-16, noche) — descartado
- Max **no quiere tomas desde arriba** (rechazó obra→terminada aérea) ni finales inventados por IA: quiere un video
  que vaya de una **foto real en obra** a una **foto real terminada**, a nivel de piso o de frente.
- Parejas propuestas (lámina `docs/propuestas-obra-terminada.jpg`, cuadros ya sin letreros):
  A. Estructura de acero a cielo abierto (`BODEGAS-MAX` 27.5 s) → nave terminada por dentro (`0124` 15.5 s).
  B. Obra de frente con revolvedora (`0124` 49.5 s) → fachada terminada de ladrillo (`BODEGAS-MAX` 22.2 s).
  C. Colado con el equipo frente a la estructura (`BODEGAS-MAX` 47.5 s) → foto de la bodega terminada (`PHOTO…663`).
- Ya generados y en `media/` (vista previa, sin aprobar): `obra-real-fin` (aérea, rechazada), `interior-real-fin`,
  `parque-real-fin`; `nave-noche` se quedó sin preparar. Las opciones `?v=proc-c`, `tour-c`, `cont-d`, `hero-c`
  están en `fx/variantes.js` pero **no publicadas**. Kling 3.0 4K, 8 s = 48 créditos.

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
