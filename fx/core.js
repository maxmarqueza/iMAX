// Utilidades compartidas por los efectos de fx/. Se carga antes que cualquier otro archivo de esta carpeta.
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp01 = (n) => Math.min(1, Math.max(0, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (n) => { n = clamp01(n); return n * n * (3 - 2 * n); };

  // Avance de un acto fijo (0 a 1), con la misma fórmula que usa el motor para --sc-p
  const actP = (el) => {
    const r = el.getBoundingClientRect();
    return clamp01(-r.top / Math.max(r.height - innerHeight, 1));
  };

  // Avisa cuando el elemento entra o sale de pantalla. Devuelve una función para dejar de observar.
  function watch(el, enter, leave, margin) {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) enter && enter();
      else leave && leave();
    }, { rootMargin: margin || "0px" });
    io.observe(el);
    return () => io.disconnect();
  }

  // Corre fn(tiempo, delta) en cada cuadro, solo mientras el elemento está en pantalla y la pestaña visible.
  function loop(el, fn, margin) {
    let raf = 0, last = 0, inView = false, alive = true;
    const frame = (t) => {
      raf = 0;
      if (!alive || !inView || document.hidden) return;
      const dt = last ? Math.min(t - last, 64) : 16;
      last = t;
      fn(t, dt);
      raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (alive && inView && !document.hidden && !raf) { last = 0; raf = requestAnimationFrame(frame); } };
    const unwatch = watch(el, () => { inView = true; kick(); }, () => { inView = false; }, margin);
    document.addEventListener("visibilitychange", kick);
    return { stop() { alive = false; unwatch(); document.removeEventListener("visibilitychange", kick); if (raf) cancelAnimationFrame(raf); } };
  }

  // Ajusta el tamaño interno de un canvas al de su caja, con la densidad de pantalla acotada.
  function fit(canvas, maxDpr) {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, maxDpr || 2);
    const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    return { w: r.width, h: r.height, dpr };
  }

  // Placa con la palabra IMAX recortada: la comparten la portada y el pie.
  const WORD = "IMAX";
  const plate = {
    word: WORD,
    font: (px) => "900 " + px + "px Archivo, system-ui, sans-serif",
    setFont(ctx, px) {
      ctx.font = plate.font(px);
      if ("fontStretch" in ctx) ctx.fontStretch = "expanded";
    },
    // Medidas de la palabra a 100 px: ancho, alto de mayúscula y dónde empieza cada letra (5 valores, el último es el final)
    measure(ctx) {
      plate.setFont(ctx, 100);
      const m = ctx.measureText(WORD);
      const stops = [0];
      for (let i = 1; i <= WORD.length; i++) stops.push(ctx.measureText(WORD.slice(0, i)).width);
      return { width: m.width, cap: m.actualBoundingBoxAscent || 70, stops };
    },
    // Pinta la placa. g: { w, h, dpr, color, size, left, baseline, ox, oy, scale, open }
    //   size      tamaño de fuente en px; left y baseline, dónde va la palabra
    //   ox, oy    punto desde el que crece la palabra; scale, cuánto (1 = tamaño normal)
    //   open      opcional: cuatro valores de 0 a 1, cuánto está abierta cada letra de abajo hacia arriba (cortina)
    draw(ctx, g) {
      const scale = g.scale || 1;
      ctx.setTransform(g.dpr, 0, 0, g.dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, g.w, g.h);
      ctx.fillStyle = g.color;
      ctx.fillRect(0, 0, g.w, g.h);
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.translate(g.ox, g.oy);
      ctx.scale(scale, scale);
      ctx.translate(-g.ox, -g.oy);
      plate.setFont(ctx, g.size);
      if (g.open) {
        const k = g.size / 100, m = g.metrics || plate.measure(ctx);
        plate.setFont(ctx, g.size);
        const cap = m.cap * k, pad = g.size * 0.06;
        ctx.beginPath();
        for (let i = 0; i < WORD.length; i++) {
          const o = clamp01(g.open[i] == null ? 1 : g.open[i]);
          if (o <= 0) continue;
          const x0 = g.left + m.stops[i] * k, x1 = g.left + m.stops[i + 1] * k;
          const hgt = (cap + pad * 2) * o;
          ctx.rect(x0 - 1, g.baseline + pad - hgt, x1 - x0 + 2, hgt);
        }
        ctx.clip();
      }
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#000";
      ctx.fillText(WORD, g.left, g.baseline);
      ctx.restore();
    },
  };

  window.FX = { reduce, fine, clamp01, lerp, smooth, actP, watch, loop, fit, plate, narrow: () => innerWidth <= 860 };
})();
