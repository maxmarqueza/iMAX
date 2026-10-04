// Portada: la palabra IMAX es una placa de concreto con las letras recortadas; adentro se ve la nave
// en video. Al cargar, cada letra se abre de abajo hacia arriba como una cortina de andén, con un filo
// amarillo. Al bajar, la cámara atraviesa el asta de la M y la placa se disuelve sobre la nave.
(function portada() {
  const act = document.getElementById("inicio");
  if (!act) return;
  const stage = act.querySelector(".hero__stage");
  const video = act.querySelector(".hero__video");
  const canvas = act.querySelector(".hero__plate");
  const ctx = canvas.getContext("2d");
  const PLATE = "#e9ebe8", EDGE = "255,194,14";
  let w = 0, h = 0, dpr = 1, size = 0, left = 0, baseline = 0, ox = 0, oy = 0, metrics = null, lastKey = "";
  let open = FX.reduce ? null : [0, 0, 0, 0];

  // Proporción de la palabra en pantallas anchas. ?portada=media|compacta|horizontal|panoramica permite comparar
  //   w: ancho de la palabra respecto a la pantalla; cy: altura del centro; sy: escala vertical; side: frase a un lado
  const VARIANTS = {
    actual: { w: 0.84, cy: 0.42 },
    media: { w: 0.64, cy: 0.42 },
    compacta: { w: 0.46, cy: 0.44 },
    horizontal: { w: 0.5, cy: 0.5, side: true },
    panoramica: { w: 0.88, cy: 0.42, sy: 0.58 },
  };
  const pick = (new URLSearchParams(location.search).get("portada") || "").toLowerCase();
  const V = VARIANTS[pick] || VARIANTS.actual;
  let sy = 1;

  // Video: archivo según el ancho; solo corre con la portada en pantalla
  if (!FX.reduce && video) {
    video.src = FX.narrow() ? video.dataset.srcMobile : video.dataset.src;
    video.addEventListener("playing", () => video.classList.add("is-on"), { once: true });
    FX.watch(stage, () => video.play().catch(() => {}), () => video.pause());
  }
  if (FX.reduce) return;

  function layout() {
    const r = stage.getBoundingClientRect();
    w = r.width; h = r.height;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    metrics = FX.plate.measure(ctx);
    const narrow = w < 700;
    const v = narrow ? { w: 0.9, cy: 0.36 } : V;
    sy = v.sy || 1;
    const target = Math.min(w * v.w, 1440, (h * (narrow ? 1.2 : 1.9)) / sy);
    size = (100 * target) / metrics.width;
    const cap = (metrics.cap / 100) * size * sy;
    const cy = h * v.cy;
    baseline = cy + cap / 2;
    left = v.side ? Math.max(48, w * 0.06) : (w - target) / 2;
    stage.classList.toggle("is-side", !!v.side);
    if (v.side) {
      stage.style.setProperty("--wm-right", Math.round(left + target + w * 0.04) + "px");
      stage.style.setProperty("--wm-mid", Math.round(cy) + "px");
    }
    // Asta derecha de la M: por ahí entra la cámara
    ox = left + (metrics.stops[2] / 100) * size - 0.17 * size;
    oy = cy;
    stage.style.setProperty("--wm-bottom", Math.round(baseline + size * 0.14) + "px");
    lastKey = "";
    draw();
  }

  function draw() {
    if (!w) return;
    const p = FX.actP(act);
    const t = FX.clamp01((p - 0.03) / 0.5);
    const scale = 1 + Math.pow(t, 2.6) * 26;
    const alpha = 1 - FX.smooth((t - 0.5) / 0.42);
    const key = scale.toFixed(3) + "|" + alpha.toFixed(3) + "|" + (open ? open.map((o) => o.toFixed(3)).join(",") : "");
    if (key === lastKey) return;
    lastKey = key;
    canvas.style.opacity = alpha.toFixed(3);
    if (alpha <= 0) return;
    FX.plate.draw(ctx, { w, h, dpr, color: PLATE, size, left, baseline, ox, oy, scale, open, metrics, sy });
  }

  // Cortinas de andén al cargar
  const edge = document.createElement("canvas");
  edge.className = "hero__edge";
  edge.setAttribute("aria-hidden", "true");
  canvas.after(edge);
  const ectx = edge.getContext("2d");
  function drawEdges() {
    const f = FX.fit(edge);
    ectx.setTransform(f.dpr, 0, 0, f.dpr, 0, 0);
    ectx.clearRect(0, 0, f.w, f.h);
    if (!open || !metrics) return;
    const k = size / 100, cap = metrics.cap * k * sy, pad = size * 0.06 * sy;
    for (let i = 0; i < 4; i++) {
      const o = open[i];
      if (o <= 0 || o >= 1) continue;
      const x0 = left + metrics.stops[i] * k, x1 = left + metrics.stops[i + 1] * k;
      const y = baseline + pad - (cap + pad * 2) * o;
      const g = ectx.createLinearGradient(0, y - 4, 0, y + cap * 0.2);
      g.addColorStop(0, `rgba(${EDGE},1)`);
      g.addColorStop(0.1, `rgba(${EDGE},.55)`);
      g.addColorStop(1, `rgba(${EDGE},0)`);
      ectx.fillStyle = g;
      ectx.fillRect(x0, y - 2, x1 - x0, cap * 0.2 + 2);
      ectx.fillStyle = "#111416";
      ectx.fillRect(x0, y - 3, x1 - x0, 3);
    }
    ectx.globalCompositeOperation = "destination-in";
    ectx.save();
    if (sy !== 1) { ectx.translate(0, baseline); ectx.scale(1, sy); ectx.translate(0, -baseline); }
    FX.plate.setFont(ectx, size);
    ectx.textBaseline = "alphabetic";
    ectx.fillStyle = "#000";
    ectx.fillText(FX.plate.word, left, baseline);
    ectx.restore();
    ectx.globalCompositeOperation = "source-over";
  }
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function curtain() {
    const t0 = performance.now() + 120;
    const step = (t) => {
      open = [0, 1, 2, 3].map((i) => ease(FX.clamp01((t - t0 - i * 120) / 760)));
      draw(); drawEdges();
      if (open[3] < 1) requestAnimationFrame(step);
      else { open = null; lastKey = ""; draw(); edge.remove(); }
    };
    requestAnimationFrame(step);
  }

  addEventListener("scroll", draw, { passive: true });
  addEventListener("resize", layout);
  layout();
  const fontReady = document.fonts ? Promise.race([document.fonts.load(FX.plate.font(100), "IMAX"), new Promise((r) => setTimeout(r, 1200))]) : Promise.resolve();
  fontReady.then(() => { layout(); curtain(); });
  if (document.fonts) document.fonts.ready.then(layout);

  // La escena flota un poco con el cursor, detrás de la placa
  if (FX.fine) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const step = () => {
      cx = FX.lerp(cx, tx, 0.08); cy = FX.lerp(cy, ty, 0.08);
      stage.style.setProperty("--px", cx.toFixed(4));
      stage.style.setProperty("--py", cy.toFixed(4));
      raf = Math.abs(cx - tx) + Math.abs(cy - ty) > 0.002 ? requestAnimationFrame(step) : 0;
    };
    stage.addEventListener("pointermove", (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; if (!raf) raf = requestAnimationFrame(step); });
  }
})();
