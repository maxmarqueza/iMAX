// Proceso: tres tiempos de una nave. El video de obra termina en el 80 % del acto; después,
// dos cortes que entran solos al terminar el video (fx/auto.js) dejan ver terreno, estructura y nave. El visitante puede tomarlos.
(function tiempos() {
  const act = document.getElementById("proceso");
  const stage = act && act.querySelector(".build__stage");
  if (!stage) return;
  const grips = [...stage.querySelectorAll(".tt__grip")];
  const modes = [...act.querySelectorAll(".tt__modes button")];
  const START = 0.8, SETTLE = 0.92; // entra entre estos dos avances
  const PRESET = { terreno: [100, 100], estructura: [0, 100], nave: [0, 0], tres: [33.3, 66.7] };
  const GAP = 6;
  let c = [0, 0], v = [0, 0], manual = false, on = false, raf = 0, drag = null, tween = null;

  const write = () => {
    stage.style.setProperty("--c1", c[0].toFixed(2));
    stage.style.setProperty("--c2", c[1].toFixed(2));
    grips.forEach((g, i) => {
      g.setAttribute("aria-valuenow", String(Math.round(c[i])));
      g.setAttribute("aria-valuetext", Math.round(c[i]) + " % del ancho");
    });
  };
  const clampCuts = (which) => {
    c[0] = Math.max(0, Math.min(100, c[0]));
    c[1] = Math.max(0, Math.min(100, c[1]));
    if (c[1] - c[0] < GAP && !(c[0] === c[1] && (c[0] === 0 || c[0] === 100))) {
      if (which === 0) c[0] = Math.max(0, c[1] - GAP); else c[1] = Math.min(100, c[0] + GAP);
    }
  };
  const setMode = (key) => modes.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tt === key)));

  // Entrada guiada por el avance: con la nave terminada en pantalla, los cortes entran desde la
  // izquierda y el tiempo retrocede; primero aparece la estructura y detrás de ella el terreno
  function fromScroll(p) {
    const t = FX.reduce ? 1 : FX.smooth((p - START) / (SETTLE - START));
    const t1 = FX.reduce ? 1 : FX.smooth((p - START - 0.035) / (SETTLE - START));
    c = [FX.lerp(0, 33.3, t1), FX.lerp(0, 66.7, t)];
  }

  function onScroll() {
    const p = FX.actP(act);
    const now = FX.reduce ? p > 0.7 : p > START - 0.005;
    if (now !== on) {
      on = now;
      stage.classList.toggle("is-tt", on);
      if (!on) { manual = false; stage.classList.remove("is-touched"); setMode("tres"); }
    }
    if (on && !manual && !drag && !tween) { fromScroll(p); write(); }
  }

  // Inercia y animaciones de los botones, solo mientras algo se mueve
  function frame(t) {
    raf = 0;
    let moving = false;
    if (tween) {
      const k = FX.reduce ? 1 : Math.min(1, (t - tween.t0) / 650);
      const e = 1 - Math.pow(1 - k, 3);
      c = [FX.lerp(tween.from[0], tween.to[0], e), FX.lerp(tween.from[1], tween.to[1], e)];
      if (k < 1) moving = true; else tween = null;
    } else if (!drag) {
      for (let i = 0; i < 2; i++) {
        if (Math.abs(v[i]) > 0.01) {
          c[i] += v[i];
          v[i] *= 0.9;
          moving = true;
        } else v[i] = 0;
      }
      clampCuts(-1);
    }
    stage.style.setProperty("--scan", (3 + Math.min(6, Math.abs(v[0]) + Math.abs(v[1])) * 1.4).toFixed(2));
    write();
    if (moving) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  function takeOver() {
    manual = true;
    stage.classList.add("is-touched");
    tween = null;
  }

  grips.forEach((g, i) => {
    g.addEventListener("pointerdown", (e) => {
      takeOver();
      setMode("");
      const r = stage.getBoundingClientRect();
      drag = { i, id: e.pointerId, r, last: e.clientX, lt: performance.now(), vel: 0 };
      g.setPointerCapture(e.pointerId);
      g.classList.add("is-drag");
      v = [0, 0];
    });
    g.addEventListener("pointermove", (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const now = performance.now();
      const dx = ((e.clientX - drag.last) / drag.r.width) * 100;
      drag.vel = FX.lerp(drag.vel, dx / Math.max(now - drag.lt, 1) * 16, 0.5);
      drag.last = e.clientX; drag.lt = now;
      c[i] = ((e.clientX - drag.r.left) / drag.r.width) * 100;
      clampCuts(i);
      stage.style.setProperty("--scan", (3 + Math.min(8, Math.abs(drag.vel)) * 1.2).toFixed(2));
      write();
    });
    const end = (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      if (!FX.reduce) v[i] = drag.vel;
      drag = null;
      g.classList.remove("is-drag");
      kick();
    };
    g.addEventListener("pointerup", end);
    g.addEventListener("pointercancel", end);
    g.addEventListener("keydown", (e) => {
      const step = { ArrowRight: 2, ArrowUp: 2, ArrowLeft: -2, ArrowDown: -2, PageUp: 10, PageDown: -10 }[e.key];
      if (step == null && e.key !== "Home" && e.key !== "End") return;
      e.preventDefault();
      takeOver();
      setMode("");
      if (e.key === "Home") c[i] = 0; else if (e.key === "End") c[i] = 100; else c[i] += step;
      clampCuts(i);
      write();
    });
  });

  modes.forEach((b) => b.addEventListener("click", () => {
    takeOver();
    setMode(b.dataset.tt);
    tween = { from: c.slice(), to: PRESET[b.dataset.tt].slice(), t0: performance.now() };
    v = [0, 0];
    kick();
  }));

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  write();
  onScroll();
})();
