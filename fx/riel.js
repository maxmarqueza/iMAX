// Servicios: el riel lateral se mueve con el scroll (motor) y además se puede tomar con el ratón
// o con el dedo. Al soltar sigue por inercia. Cada tarjeta gira hacia el centro y una luz la barre.
(function riel() {
  const act = document.getElementById("servicios");
  if (!act || FX.reduce) return;
  const stage = act.querySelector(".svc__stage");
  const rail = act.querySelector("[data-sc-pan]");
  const items = [...act.querySelectorAll(".svc__item")];
  const extra = parseFloat(rail.getAttribute("data-sc-pan")) || 0;

  // Cuánto scroll vertical equivale a un píxel de riel, con la misma fórmula del motor
  const factor = () => {
    const over = rail.scrollWidth - innerWidth;
    return over > 0 ? (act.offsetHeight - innerHeight) / (over * (1 + extra)) : 0;
  };
  const range = () => { const top = act.getBoundingClientRect().top + scrollY; return [top, top + act.offsetHeight - innerHeight]; };
  const go = (y) => { const [a, b] = range(); scrollTo({ top: Math.max(a, Math.min(b, y)), behavior: "instant" }); };

  // Giro, luz y retraso de la foto según la posición de cada tarjeta
  let lastX = null, lag = 0, raf = 0;
  function frame() {
    raf = 0;
    const r = rail.getBoundingClientRect();
    const v = lastX == null ? 0 : r.left - lastX;
    lastX = r.left;
    lag = FX.lerp(lag, Math.max(-28, Math.min(28, v * 0.9)), 0.25);
    const half = innerWidth / 2;
    for (const it of items) {
      const b = it.getBoundingClientRect();
      if (b.right < -200 || b.left > innerWidth + 200) continue;
      const d = Math.max(-1.4, Math.min(1.4, (b.left + b.width / 2 - half) / half));
      it.style.setProperty("--d", d.toFixed(3));
      it.style.setProperty("--ad", Math.min(1, Math.abs(d)).toFixed(3));
      it.style.setProperty("--lag", lag.toFixed(1));
    }
    if (Math.abs(lag) > 0.3) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", kick);
  kick();

  // Arrastre con inercia
  let drag = null, vel = 0, glide = 0, moved = false;
  stage.addEventListener("pointerdown", (e) => {
    // Con el dedo el riel ya avanza con el scroll vertical; arrastrarlo aparte peleaba con el scroll nativo
    if (e.button !== 0 || e.pointerType === "touch") return;
    cancelAnimationFrame(glide);
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, sy: scrollY, lx: e.clientX, lt: performance.now(), on: false, type: e.pointerType };
    vel = 0; moved = false;
  });
  stage.addEventListener("pointermove", (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.on) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) {
        if (Math.abs(dy) > 10) drag = null; // gesto vertical: es scroll del navegador
        return;
      }
      drag.on = true; moved = true;
      stage.setPointerCapture(e.pointerId);
      stage.classList.add("is-drag");
    }
    const now = performance.now();
    vel = FX.lerp(vel, (e.clientX - drag.lx) / Math.max(now - drag.lt, 1), 0.4);
    drag.lx = e.clientX; drag.lt = now;
    go(drag.sy - dx * factor());
  });
  const end = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const was = drag.on;
    drag = null;
    stage.classList.remove("is-drag");
    if (!was) return;
    // Inercia: sigue con la velocidad del gesto y se frena
    let v = vel * 16, last = performance.now();
    const step = (t) => {
      const dt = Math.min(48, t - last); last = t;
      v *= Math.pow(0.92, dt / 16);
      go(scrollY - v * factor() * (dt / 16));
      if (Math.abs(v) > 0.4) glide = requestAnimationFrame(step);
    };
    glide = requestAnimationFrame(step);
  };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);
  addEventListener("wheel", () => cancelAnimationFrame(glide), { passive: true });
  // Un arrastre no abre la tarjeta
  stage.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
})();
