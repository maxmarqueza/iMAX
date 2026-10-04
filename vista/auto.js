// Vista previa sin scroll: ninguna escena va amarrada al scroll. Cada una se reproduce sola, en poco
// tiempo, cuando aparece en pantalla; después la página se recorre como una página normal.
// Reutiliza los mismos efectos de fx/: aquí solo se cambia de dónde sale el avance (tiempo en vez de scroll).
(function auto() {
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const clamp01 = FX.clamp01;
  const smooth = FX.smooth;
  const mobile = FX.narrow();
  // Las escenas usan los estilos del motor para su video y su cartel (.sc-stage), aunque ya no se fijen
  document.querySelectorAll("main [data-sc-stage]").forEach((st) => st.classList.add("sc-stage"));

  // Los efectos leen FX.actP(el); una escena automática publica su avance en el.__auto
  const scrollP = FX.actP;
  FX.actP = (el) => (el.__auto != null ? el.__auto : scrollP(el));

  // Los efectos se redibujan con el evento scroll: mientras una escena corre, se les avisa en cada cuadro
  let pulsing = 0, raf = 0;
  const pulse = () => {
    raf = 0;
    dispatchEvent(new Event("scroll"));
    if (pulsing > 0) raf = requestAnimationFrame(pulse);
  };
  const startPulse = () => { pulsing++; if (!raf) raf = requestAnimationFrame(pulse); };
  const stopPulse = () => { pulsing = Math.max(0, pulsing - 1); dispatchEvent(new Event("scroll")); };

  // Apariciones de texto (data-sc-cue) con la misma fórmula del motor
  function cues(act) {
    return [...act.querySelectorAll("[data-sc-cue]")].map((el) => {
      const n = el.getAttribute("data-sc-cue").trim().split(/\s+/).map(parseFloat);
      return { el, from: n[0] || 0, to: n.length > 1 ? n[1] : null, rIn: n.length > 2 ? clamp01(n[2]) : 0.3, rOut: n.length > 3 ? clamp01(n[3]) : 0.3 };
    });
  }
  function paintCues(list, p) {
    for (const q of list) {
      let vis;
      if (q.to === null) vis = smooth((p - q.from) / 0.18);
      else {
        const win = Math.max(q.to - q.from, 0.001), inEnd = q.from + win * q.rIn, outStart = q.to - win * q.rOut;
        if (p < inEnd) vis = smooth((p - q.from) / Math.max(inEnd - q.from, 0.001));
        else if (p <= outStart) vis = 1;
        else vis = smooth(1 - (p - outStart) / Math.max(q.to - outStart, 0.001));
      }
      vis = clamp01(vis);
      q.el.style.opacity = vis.toFixed(3);
      q.el.style.transform = `translate3d(0, ${((1 - vis) * 2.4).toFixed(2)}vh, 0)`;
      q.el.style.pointerEvents = vis > 0.5 ? "auto" : "none";
    }
  }

  // Una escena: guarda su avance y lo pinta
  function scene(act) {
    const list = cues(act);
    const s = {
      act, p: 0,
      set(p) {
        s.p = clamp01(p);
        act.__auto = s.p;
        act.style.setProperty("--sc-p", s.p.toFixed(4));
        paintCues(list, s.p);
      },
      // Lleva el avance de donde esté a «to» en «ms» milisegundos
      tween(to, ms, done) {
        cancelAnimationFrame(s.raf);
        const from = s.p, t0 = performance.now();
        startPulse();
        const step = (t) => {
          const k = clamp01((t - t0) / ms);
          s.set(from + (to - from) * ease(k));
          if (k < 1) s.raf = requestAnimationFrame(step);
          else { stopPulse(); done && done(); }
        };
        s.raf = requestAnimationFrame(step);
      },
    };
    s.set(0);
    return s;
  }

  // Corre una vez cuando la escena se ve casi completa
  function onShow(el, fn, ratio) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.disconnect(); fn(); } }), { threshold: ratio || 0.6 });
    io.observe(el);
  }

  // Botón para repetir la escena
  function replay(act, fn) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "repetir";
    b.textContent = "Repetir";
    b.addEventListener("click", fn);
    (act.querySelector("[data-sc-stage]") || act).appendChild(b);
    return b;
  }

  // 1. Portada: se abren las letras al cargar y, enseguida, la cámara entra sola por la M
  const hero = document.getElementById("inicio");
  if (hero) {
    const s = scene(hero);
    const go = () => s.tween(0.9, 1900);
    setTimeout(go, FX.reduce ? 0 : 2300);
  }

  // 2 y 5. Escenas con video: el video corre solo y el avance sale de su tiempo
  function videoScene(id, { rate, end, tail }) {
    const act = document.getElementById(id);
    if (!act) return;
    const v = act.querySelector("video[data-sc-scrub]");
    const s = scene(act);
    v.muted = true; v.playsInline = true; v.preload = "auto";
    v.src = mobile ? v.dataset.scSrcMobile || v.dataset.scSrc : v.dataset.scSrc;
    let rafV = 0;
    const follow = () => {
      if (v.duration) s.set((v.currentTime / v.duration) * end);
      rafV = v.paused || v.ended ? 0 : requestAnimationFrame(follow);
    };
    v.addEventListener("playing", () => { act.classList.add("sc-has-clip"); startPulse(); if (!rafV) rafV = requestAnimationFrame(follow); });
    v.addEventListener("ended", () => {
      stopPulse();
      s.set(end);
      if (end < 1) s.tween(1, tail || 900);
    });
    const play = () => {
      s.set(0);
      v.currentTime = 0;
      v.playbackRate = rate;
      v.play().catch(() => s.tween(1, 2500));
    };
    onShow(act, play, 0.55);
    replay(act, play);
  }
  videoScene("anatomia", { rate: 1.75, end: 1 });
  videoScene("proceso", { rate: 1.6, end: 0.8, tail: 900 });

  // 4. Parque: la cámara recorre sola las cinco paradas; los botones llevan a cada una
  const tour = document.getElementById("parque");
  if (tour) {
    const s = scene(tour);
    const STOPS = [0.2, 0.365, 0.525, 0.685, 0.86];
    let timer = 0, i = -1;
    const next = () => {
      i++;
      if (i >= STOPS.length) return;
      s.tween(STOPS[i], i === 0 ? 1100 : 900, () => { timer = setTimeout(next, 1700); });
    };
    const play = () => { clearTimeout(timer); i = -1; s.set(0); timer = setTimeout(next, 500); };
    onShow(tour, play, 0.55);
    replay(tour, play);
    // Tocar una parada lleva la cámara ahí (sin mover la página)
    tour.addEventListener("click", (e) => {
      const b = e.target.closest("[data-stop]");
      if (!b) return;
      e.preventDefault(); e.stopPropagation();
      clearTimeout(timer);
      i = STOPS.length;
      s.tween(STOPS[+b.dataset.stop], 900);
    }, true);
  }

  // 7. Pie: al aparecer, la cámara sale sola por la M hasta IMAX
  const foot = document.querySelector(".foot__scene");
  if (foot) {
    let t0 = 0;
    foot.__auto = 0;
    const play = () => {
      t0 = performance.now();
      startPulse();
      const step = (t) => {
        const k = clamp01((t - t0) / 2600);
        foot.__auto = ease(k);
        if (k < 1) requestAnimationFrame(step); else stopPulse();
      };
      requestAnimationFrame(step);
    };
    onShow(foot, play, 0.6);
  }

  // Bloques de texto y tarjetas: aparecen una vez, rápido, al entrar
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
  document.querySelectorAll(".aparece").forEach((el) => io.observe(el));
})();
