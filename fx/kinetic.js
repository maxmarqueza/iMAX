// Tipografía en movimiento.
// 1. Títulos de sección: las palabras suben desde su máscara y se ensanchan hasta su ancho final.
// 2. La frase de la portada se enciende palabra por palabra con el scroll.
// 3. La franja de cifras corre más rápido, cambia de sentido y se inclina con la velocidad del scroll.
// 4. La banda de servicios del contacto se desliza con el scroll.
(function kinetic() {
  const R = FX.reduce;
  const splitWords = (el, cls) => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(/\s+/).map((w, i) => (cls ? `<span class="${cls}" aria-hidden="true" style="--i:${i}"><span>${w}</span></span>` : `<span class="w" aria-hidden="true">${w}</span>`)).join(" ");
  };

  // 1. Títulos
  const heads = [...document.querySelectorAll(".svc__lead h2, .spec__head h2, .faq__head h2, .contact__intro h2, .tour__panel h2, .build__steps li:first-child h2")];
  heads.forEach((h) => { h.classList.add("kt"); splitWords(h, "kw"); });
  if (R) heads.forEach((h) => h.classList.add("is-in"));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -18% 0px" });
    heads.forEach((h) => io.observe(h));
  }

  // 2. Frase de la portada
  const hero = document.getElementById("inicio");
  const say = hero && hero.querySelector(".hero__say p");
  let words = [];
  if (say) { splitWords(say); words = [...say.querySelectorAll(".w")]; }

  // 3 y 4. Velocidad del scroll
  const ticker = document.querySelector(".ticker");
  const row = ticker && ticker.querySelector(".ticker__row");
  const spans = row ? [...row.children] : [];
  const band = document.querySelector(".contact__band");
  const track = document.querySelector(".contact__track");
  if (ticker && !R) ticker.classList.add("is-js");

  // <html data-sin-scroll>: nada sigue la velocidad del scroll
  const sinScroll = document.documentElement.hasAttribute("data-sin-scroll");
  let bandX = 0;
  let lastY = scrollY, vel = 0, x = 0, dir = -1, lastT = performance.now(), lastN = -1, hoverPause = false;
  if (ticker) { ticker.addEventListener("pointerenter", () => (hoverPause = true)); ticker.addEventListener("pointerleave", () => (hoverPause = false)); }
  function frame(t) {
    const dt = Math.min(64, t - lastT); lastT = t;
    const dy = scrollY - lastY; lastY = scrollY;
    vel = sinScroll ? 0 : FX.lerp(vel, dy, 0.18);
    if (Math.abs(vel) > 0.5) dir = vel > 0 ? -1 : 1;

    if (say && words.length) {
      const p = FX.actP(hero);
      const n = R ? words.length : Math.round(FX.clamp01((p - 0.58) / 0.16) * words.length);
      if (n !== lastN) { words.forEach((w, i) => w.classList.toggle("on", i < n)); lastN = n; }
    }
    if (row && !R) {
      const r = ticker.getBoundingClientRect();
      if (r.bottom > -50 && r.top < innerHeight + 50) {
        const speed = hoverPause ? 0 : 0.05 + Math.min(2.4, Math.abs(vel) * 0.06);
        x += dir * speed * dt;
        const half = row.scrollWidth / 2;
        if (x <= -half) x += half; else if (x > 0) x -= half;
        row.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
        const skew = Math.max(-12, Math.min(12, vel * -0.35));
        spans.forEach((s) => (s.style.transform = `skewX(${skew.toFixed(2)}deg)`));
      }
    }
    if (band && track && !R) {
      const r = band.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        if (sinScroll) {
          bandX = (bandX + dt * 0.04) % (track.scrollWidth * 0.45);
          track.style.transform = `translate3d(${(-bandX).toFixed(1)}px,0,0)`;
        } else {
          const k = (innerHeight - r.top) / (innerHeight + r.height);
          track.style.transform = `translate3d(${(-k * track.scrollWidth * 0.45).toFixed(1)}px,0,0) skewX(${Math.max(-8, Math.min(8, vel * -0.25)).toFixed(2)}deg)`;
        }
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
