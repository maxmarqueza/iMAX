// Movimiento compartido por las tres propuestas de diseño.
//  [data-pin]      sección alta con un .stage fijo: publica --p (0 a 1) mientras se recorre
//  [data-scrub]    video dentro de un [data-pin]: el scroll mueve el cabezal
//  [data-in]       aparece una vez al entrar en pantalla (clase .is-in)
//  [data-words]    párrafo que se enciende palabra por palabra con el --p de su sección
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrow = () => innerWidth <= 820;
  const clamp = (n) => Math.min(1, Math.max(0, n));
  const pins = [...document.querySelectorAll("[data-pin]")].map((el) => {
    const v = el.querySelector("video[data-scrub]");
    if (v) {
      // Se descarga completo como blob: así se puede mover el cabezal aunque el servidor no acepte rangos
      v.muted = true; v.playsInline = true; v.preload = "auto";
      const url = narrow() && v.dataset.srcMobile ? v.dataset.srcMobile : v.dataset.src;
      fetch(url).then((r) => r.blob()).then((b) => { v.src = URL.createObjectURL(b); }).catch(() => { v.src = url; });
    }
    return { el, v, p: -1, cur: 0 };
  });
  document.querySelectorAll("[data-words]").forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
  });
  function frame() {
    for (const s of pins) {
      const r = s.el.getBoundingClientRect();
      if (r.bottom < -innerHeight || r.top > innerHeight * 2) continue;
      const p = clamp(-r.top / Math.max(r.height - innerHeight, 1));
      if (Math.abs(p - s.p) > 0.0005) { s.p = p; s.el.style.setProperty("--p", p.toFixed(4)); }
      if (s.v && s.v.duration) {
        const target = p * (s.v.duration - 0.05);
        s.cur += (target - s.cur) * (reduce ? 1 : 0.2);
        if (Math.abs(s.v.currentTime - s.cur) > 0.02) s.v.currentTime = s.cur;
      }
      s.el.querySelectorAll("[data-words]").forEach((t) => {
        const a = +(t.dataset.from || 0), b = +(t.dataset.to || 1);
        const ws = t.querySelectorAll(".w"), k = clamp((p - a) / (b - a)) * ws.length;
        ws.forEach((w, i) => w.classList.toggle("on", i < k));
      });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
  document.querySelectorAll("[data-in]").forEach((el) => io.observe(el));
  document.querySelectorAll("video[autoplay]").forEach((v) => { v.muted = true; v.play().catch(() => {}); });
  const bar = document.querySelector("[data-bar]");
  if (bar) addEventListener("scroll", () => bar.classList.toggle("is-solid", scrollY > 30), { passive: true });
})();
