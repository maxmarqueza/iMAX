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
  let w = 0, h = 0, dpr = 1, size = 0, left = 0, baseline = 0, ox = 0, oy = 0, dive = 1, cover = 1, metrics = null, lastKey = "";
  let open = FX.reduce ? null : [0, 0, 0, 0];
  // Con el dedo, la entrada por la M no va pegada al scroll: lo sigue con un resorte (~1 s), así un
  // deslizón rápido igual se ve como una toma completa. La escena, la frase y las rutas leen --hp.
  const SPRING = FX.coarse && !FX.reduce;
  let hp = FX.actP(act), hv = 0, springRaf = 0, lastT = 0;
  const progress = () => (SPRING ? hp : FX.actP(act));

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
    const target = Math.min(w * (narrow ? 0.9 : 0.84), 1440, h * (narrow ? 1.2 : 1.9));
    size = (100 * target) / metrics.width;
    const cap = (metrics.cap / 100) * size;
    const cy = h * 0.42;
    baseline = cy + cap / 2;
    left = (w - target) / 2;
    // Asta derecha de la M: por ahí entra la cámara
    ox = left + (metrics.stops[2] / 100) * size - 0.17 * size;
    oy = cy;
    // Cuánto hay que acercar para que el asta cubra la escena de arriba abajo. En pantalla horizontal
    // basta con ~4.4; en el celular, vertical, la palabra es chica frente al alto y hacen falta ~15.
    // Si no se compensa, la placa se desvanece con franjas de concreto arriba y abajo de la letra.
    // Con la curva elevada a «dive», la cámara entra a la M en el mismo momento que en escritorio.
    cover = (2 * Math.max(cy, h - cy)) / cap;
    dive = Math.max(1, Math.log(cover) / Math.log(4.6));
    stage.style.setProperty("--wm-bottom", Math.round(baseline + size * 0.14) + "px");
    lastKey = "";
    draw();
  }

  function draw() {
    if (!w) return;
    const p = progress();
    const t = FX.clamp01((p - 0.03) / 0.5);
    const scale = Math.pow(1 + Math.pow(t, 2.6) * 26, dive);
    // Pasado ~40x el asta ya tapa toda la escena en cualquier pantalla: no hay placa que pintar
    const alpha = scale > 40 ? 0 : 1 - FX.smooth((t - 0.5) / 0.42);
    // Ya dentro de la M, la orilla de abajo es la nave: Safari toma ese color para la franja bajo su barra
    stage.classList.toggle("is-dentro", scale >= cover);
    const key = scale.toFixed(3) + "|" + alpha.toFixed(3) + "|" + (open ? open.map((o) => o.toFixed(3)).join(",") : "");
    if (key === lastKey) return;
    lastKey = key;
    canvas.style.opacity = alpha.toFixed(3);
    if (alpha <= 0) return;
    FX.plate.draw(ctx, { w, h, dpr, color: PLATE, size, left, baseline, ox, oy, scale, open, metrics });
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
    const k = size / 100, cap = metrics.cap * k, pad = size * 0.06;
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

  function spring(t) {
    springRaf = 0;
    const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 1 / 60;
    lastT = t;
    const goal = FX.actP(act), k = 4.5;
    hv += (k * k * (goal - hp) - 2 * k * hv) * dt;
    hp = FX.clamp01(hp + hv * dt);
    if (Math.abs(goal - hp) < 0.0006 && Math.abs(hv) < 0.002) { hp = goal; hv = 0; }
    stage.style.setProperty("--hp", hp.toFixed(4));
    act.__p = hp;
    draw();
    if (hp !== goal) springRaf = requestAnimationFrame(spring);
    else lastT = 0;
  }
  if (SPRING) {
    stage.classList.add("con-resorte");
    stage.style.setProperty("--hp", hp.toFixed(4));
    act.__p = hp;
    addEventListener("scroll", () => { if (!springRaf) springRaf = requestAnimationFrame(spring); }, { passive: true });
  } else addEventListener("scroll", draw, { passive: true });
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
