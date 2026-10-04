// Salida: la página termina como empezó, pero al revés. Al llegar al pie la cámara está dentro de
// la M, viendo la nave; al bajar retrocede, las letras se encogen y queda la palabra IMAX con la nave adentro.
(function salida() {
  const scene = document.querySelector(".foot__scene");
  if (!scene) return;
  const stage = scene.querySelector(".foot__stage");
  const canvas = scene.querySelector(".foot__plate");
  const video = scene.querySelector(".foot__video");
  const ctx = canvas.getContext("2d");
  const COLOR = "#111416";
  let w = 0, h = 0, dpr = 1, size = 0, left = 0, baseline = 0, ox = 0, oy = 0, dive = 1, cover = 1, metrics = null, lastKey = "";

  function layout() {
    const r = stage.getBoundingClientRect();
    w = r.width; h = r.height;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    metrics = FX.plate.measure(ctx);
    const narrow = w < 700;
    const target = Math.min(w * (narrow ? 0.9 : 0.84), 1500, ((h * 0.5) * metrics.width) / metrics.cap);
    size = (100 * target) / metrics.width;
    const cap = (metrics.cap / 100) * size;
    // En el teléfono la palabra baja al centro: arriba ya no queda un hueco negro
    const cy = h * (narrow ? 0.47 : 0.42);
    baseline = cy + cap / 2;
    left = (w - target) / 2;
    // Asta derecha de la M: por ahí sale la cámara, igual que entra en la portada
    ox = left + (metrics.stops[2] / 100) * size - 0.17 * size;
    oy = cy;
    // Igual que en la portada: en vertical hace falta acercar más para que el asta cubra la escena
    cover = (2 * Math.max(cy, h - cy)) / cap;
    dive = Math.max(1, Math.log(cover) / Math.log(4.6));
    lastKey = "";
    draw();
  }

  function draw() {
    if (!w) return;
    const r = scene.getBoundingClientRect();
    // scene.__auto: avance por tiempo en la vista previa sin scroll (vista/auto.js)
    const t = FX.reduce ? 1 : scene.__auto != null ? scene.__auto : FX.clamp01(-r.top / Math.max(r.height - innerHeight, 1));
    const k = FX.smooth(t / 0.72);
    // En vertical la cámara se aleja a ritmo parejo desde justo donde el asta cubre la pantalla; con la curva
    // de la computadora se quedaba casi todo el tramo dentro de la M y la palabra aparecía de golpe
    const scale = dive > 1 ? Math.exp(Math.log(cover * 1.1) * (1 - k)) : 1 + Math.pow(1 - k, 2.6) * 26;
    const fd = FX.reduce ? 1 : FX.smooth((t - 0.74) / 0.22);
    stage.style.setProperty("--fd", fd.toFixed(3));
    stage.classList.toggle("is-done", fd > 0.98);
    const key = scale.toFixed(3);
    if (key === lastKey) return;
    lastKey = key;
    FX.plate.draw(ctx, { w, h, dpr, color: COLOR, size, left, baseline, ox, oy, scale, metrics });
  }

  if (!FX.reduce && video) {
    FX.watch(stage, () => {
      if (!video.src) video.src = FX.narrow() ? video.dataset.srcMobile : video.dataset.src;
      video.play().catch(() => {});
    }, () => video.pause(), "200px 0px");
  }
  addEventListener("scroll", draw, { passive: true });
  addEventListener("resize", layout);
  layout();
  if (document.fonts) {
    document.fonts.load(FX.plate.font(100), "IMAX").then(layout).catch(() => {});
    document.fonts.ready.then(layout);
  }
})();
