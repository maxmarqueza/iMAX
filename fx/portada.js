// Portada: al cargar, cada letra de IMAX se abre de abajo hacia arriba como una cortina de andén,
// con un filo ámbar que sube.
(function portada() {
  const H = FX.hero;
  if (!H || FX.reduce) return;
  const act = H.act, stage = H.stage;
  act.classList.add("has-curtain");
  const AMBER = "246,185,59";

  // ------------------------------------------------------------ Cortinas
  const edge = document.createElement("canvas");
  edge.className = "hero__edge";
  edge.setAttribute("aria-hidden", "true");
  H.canvas.after(edge);
  const ectx = edge.getContext("2d");
  H.open = [0, 0, 0, 0];
  H.redraw();

  const DELAY = 140, STAGGER = 120, DUR = 760;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function drawEdges(open) {
    const g = H.geom();
    const f = FX.fit(edge);
    ectx.setTransform(f.dpr, 0, 0, f.dpr, 0, 0);
    ectx.clearRect(0, 0, f.w, f.h);
    if (!g.metrics) return;
    const k = g.size / 100, cap = g.metrics.cap * k, pad = g.size * 0.06;
    ectx.globalCompositeOperation = "source-over";
    for (let i = 0; i < 4; i++) {
      const o = open[i];
      if (o <= 0 || o >= 1) continue;
      const x0 = g.left + g.metrics.stops[i] * k, x1 = g.left + g.metrics.stops[i + 1] * k;
      const y = g.baseline + pad - (cap + pad * 2) * o;
      const glow = ectx.createLinearGradient(0, y - 4, 0, y + cap * 0.22);
      glow.addColorStop(0, `rgba(${AMBER},.95)`);
      glow.addColorStop(0.08, `rgba(${AMBER},.55)`);
      glow.addColorStop(1, `rgba(${AMBER},0)`);
      ectx.fillStyle = glow;
      ectx.fillRect(x0, y - 2, x1 - x0, cap * 0.22 + 2);
      ectx.fillStyle = "rgba(255,236,190,1)";
      ectx.fillRect(x0, y - 2, x1 - x0, 3);
    }
    // Solo dentro de la forma de las letras
    ectx.globalCompositeOperation = "destination-in";
    FX.plate.setFont(ectx, g.size);
    ectx.textAlign = "left";
    ectx.textBaseline = "alphabetic";
    ectx.fillStyle = "#000";
    ectx.fillText(FX.plate.word, g.left, g.baseline);
  }
  function curtain() {
    const t0 = performance.now() + DELAY;
    const step = (t) => {
      const open = [0, 1, 2, 3].map((i) => ease(FX.clamp01((t - t0 - i * STAGGER) / DUR)));
      H.open = open;
      H.redraw();
      drawEdges(open);
      if (open[3] < 1) requestAnimationFrame(step);
      else { H.open = null; H.redraw(); edge.remove(); }
    };
    requestAnimationFrame(step);
  }
  const fontReady = document.fonts ? Promise.race([document.fonts.load(FX.plate.font(100), "IMAX"), new Promise((r) => setTimeout(r, 1200))]) : Promise.resolve();
  fontReady.then(() => requestAnimationFrame(curtain));

})();
