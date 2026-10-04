// De polvo a nave: antes de que se levante el polvo, sobre el terreno vacío se traza la poligonal
// entre estacas y la planta de la nave (huella, ejes y zapatas), con la perspectiva de la toma.
// El polvo del propio video pasa por encima gracias a un mate precalculado (media/polvo-mate.webp).
(function replanteo() {
  const act = document.getElementById("anatomia");
  const svg = act && act.querySelector(".anat__trazo");
  if (!svg || FX.reduce) return;
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); (parent || svg).appendChild(n); return n; };
  const L = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const pts = (arr) => arr.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L");

  // Coordenadas en píxeles del cuadro del video (1942 x 1080), medidas sobre el primer y el último cuadro
  const ESTACAS = [[188, 662], [419, 785], [923, 1044], [1584, 742], [1870, 603], [1240, 520]];
  const POLI = [[188, 662], [923, 1044], [1870, 603], [1240, 520]];
  const BL = [365, 668], BR = [1565, 593], FR = [1518, 613], FL = [598, 788];
  const narrow = FX.narrow();

  // Poligonal del predio
  el("path", { class: "t poli", d: "M" + pts(POLI) + " Z", pathLength: 1 });
  ESTACAS.forEach((p, i) => el("circle", { class: "estaca", cx: p[0], cy: p[1], r: 7, style: `--a:${(0.15 + i * 0.09).toFixed(2)}` }));

  // Huella de la nave
  el("path", { class: "t huella", d: "M" + pts([BL, FL, FR, BR]) + " Z", pathLength: 1 });

  // Ejes transversales (letras) y longitudinales (números)
  const N = narrow ? 6 : 8, LETRAS = "ABCDEFGHIJ";
  for (let i = 0; i <= N; i++) {
    const t = i / N, b = L(BL, BR, t), f = L(FL, FR, t);
    const a = (0.004 + i * 0.0035).toFixed(4);
    const out = [f[0] + (f[0] - b[0]) * 0.32, f[1] + (f[1] - b[1]) * 0.32];
    el("path", { class: "t eje", d: `M${b[0]} ${b[1]} L${out[0]} ${out[1]}`, pathLength: 1, style: `--a:${a}` });
    const g = el("g", { class: "bur", style: `--a:${(+a + 0.012).toFixed(4)}` });
    const c = [out[0] + (f[0] - b[0]) * 0.12, out[1] + (f[1] - b[1]) * 0.12];
    el("circle", { cx: c[0], cy: c[1], r: 17 }, g);
    el("text", { x: c[0], y: c[1] + 1 }, g).textContent = LETRAS[i];
  }
  const M = 3;
  for (let j = 0; j < M; j++) {
    const s = j / (M - 1), a0 = L(BL, FL, s), a1 = L(BR, FR, s);
    const a = (0.012 + j * 0.006).toFixed(4);
    const start = [a0[0] - (a1[0] - a0[0]) * 0.06, a0[1] - (a1[1] - a0[1]) * 0.06];
    el("path", { class: "t eje", d: `M${start[0]} ${start[1]} L${a1[0]} ${a1[1]}`, pathLength: 1, style: `--a:${a}` });
    const g = el("g", { class: "bur", style: `--a:${(+a + 0.012).toFixed(4)}` });
    const c = [start[0] - (a1[0] - a0[0]) * 0.025, start[1] - (a1[1] - a0[1]) * 0.025];
    el("circle", { cx: c[0], cy: c[1], r: 17 }, g);
    el("text", { x: c[0], y: c[1] + 1 }, g).textContent = String(j + 1);
  }

  // Zapatas en los cruces de ejes: se encienden una por una mientras corre la cimentación
  let k = 0;
  for (let j = 0; j < M; j++) for (let i = 0; i <= N; i++) {
    const t = i / N, s = j / (M - 1);
    const p = L(L(BL, BR, t), L(FL, FR, t), s);
    const z = 9 + s * 4;
    el("rect", { class: "zap", x: p[0] - z, y: p[1] - z * 0.6, width: z * 2, height: z * 1.2, style: `--a:${(0.045 + k * 0.004).toFixed(4)}` });
    k++;
  }

  // Rótulo
  const rot = el("g", { class: "rot" });
  el("rect", { x: 300, y: 820, width: 300, height: 44, rx: 22 }, rot);
  el("text", { x: 324, y: 850 }, rot).textContent = "Trazo y nivelación";

  // Avance de entrada (antes de que el acto se fije) y cuadro del video para el mate del polvo
  const video = act.querySelector("video[data-sc-scrub]");
  let raf = 0, lastIdx = -1;
  function frame() {
    raf = 0;
    const r = act.getBoundingClientRect();
    // act.__e: entrada por tiempo en la vista previa sin scroll (vista/auto.js)
    const e = act.__e != null ? act.__e : FX.clamp01(1 - r.top / innerHeight);
    svg.style.setProperty("--e", e.toFixed(3));
    if (video && video.duration) {
      const idx = Math.max(0, Math.min(80, Math.round((video.currentTime * 24) / 2)));
      if (idx !== lastIdx) {
        lastIdx = idx;
        svg.style.setProperty("--mx", ((idx % 9) / 8 * 100).toFixed(3) + "%");
        svg.style.setProperty("--my", (Math.floor(idx / 9) / 8 * 100).toFixed(3) + "%");
      }
    }
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  addEventListener("scroll", kick, { passive: true });
  // El cabezal del video sigue suavizado al scroll: se lee también mientras se mueve
  if (video && "requestVideoFrameCallback" in video) {
    const onFrame = () => { kick(); video.requestVideoFrameCallback(onFrame); };
    video.requestVideoFrameCallback(onFrame);
  } else FX.loop(act, kick);
  if (video) video.addEventListener("seeked", kick);
  kick();
})();
