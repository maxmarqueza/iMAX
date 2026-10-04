// Relevos entre actos: publica en cada acto fijo cuánto ha salido (--ex) y cuánto le falta por entrar (--en).
(function relevo() {
  if (FX.reduce) return;
  const acts = [...document.querySelectorAll("main > [data-acto], main > .hero")];
  const last = new Map();
  let raf = 0;
  function frame() {
    raf = 0;
    const vh = innerHeight;
    for (const a of acts) {
      const r = a.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      const ex = r.bottom < vh ? FX.clamp01(1 - r.bottom / vh) : 0;
      const en = a.classList.contains("hero") ? 0 : (r.top > 0 && r.top < vh ? r.top / vh : 0);
      const key = ex.toFixed(3) + "|" + en.toFixed(3);
      if (last.get(a) === key) continue;
      last.set(a, key);
      a.style.setProperty("--ex", ex.toFixed(4));
      a.style.setProperty("--en", en.toFixed(4));
    }
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", kick);
  kick();
})();
