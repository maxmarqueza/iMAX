// Efectos propios de la versión Hora dorada: manifiesto que se enciende, fotos que se desplazan
// con el scroll, la ficha que se traza y se mide al llegar, y el cursor que mueve la portada.
(function dorada() {
  const R = FX.reduce;

  // Manifiesto: cada palabra se enciende con el avance de su sección
  const words = [...document.querySelectorAll("[data-words]")].map((el) => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(/\s+/).map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(" ");
    return { el, act: el.closest("[data-sc-act]"), ws: [...el.querySelectorAll(".w")], a: +(el.dataset.from || 0), b: +(el.dataset.to || 1), n: -1 };
  });

  // Fotos que se desplazan dentro de su marco
  const drift = [...document.querySelectorAll(".svc__fig img, .contact__media img")].map((img) => ({ img, box: img.parentElement, k: img.closest(".contact__media") ? 0.18 : 0.12 }));
  const foot = document.querySelector(".foot__word");

  let raf = 0;
  function frame() {
    raf = 0;
    const vh = innerHeight;
    for (const w of words) {
      const p = FX.actP(w.act);
      const n = R ? w.ws.length : Math.round(FX.clamp01((p - w.a) / (w.b - w.a)) * w.ws.length);
      if (n !== w.n) { w.ws.forEach((s, i) => s.classList.toggle("on", i < n)); w.n = n; }
    }
    if (!R) {
      for (const d of drift) {
        const r = d.box.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        const off = (r.top + r.height / 2 - vh / 2) * -d.k;
        d.img.style.setProperty("--py", off.toFixed(1) + "px");
      }
      if (foot) {
        const r = foot.getBoundingClientRect();
        foot.style.setProperty("--fw", FX.clamp01((vh - r.top) / (r.height + vh * 0.5)).toFixed(3));
      }
    }
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", kick);
  kick();

  // Portada: la foto se mueve un poco con el cursor, como si la cámara flotara sobre el parque
  const heroMedia = document.querySelector(".hero__media");
  if (heroMedia && FX.fine && !R) {
    let tx = 0, ty = 0, cx = 0, cy = 0, run = 0;
    const step = () => {
      cx = FX.lerp(cx, tx, 0.07); cy = FX.lerp(cy, ty, 0.07);
      heroMedia.style.transform = `translate3d(${(cx * -22).toFixed(2)}px, ${(cy * -14).toFixed(2)}px, 0) scale(1.03)`;
      run = Math.abs(cx - tx) + Math.abs(cy - ty) > 0.001 ? requestAnimationFrame(step) : 0;
    };
    heroMedia.closest(".hero__stage").addEventListener("pointermove", (e) => {
      tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5;
      if (!run) run = requestAnimationFrame(step);
    });
  }

  // Ficha técnica: el plano se traza cuando la sección llega a pantalla, y las cifras se calibran
  const spec = document.querySelector(".spec");
  if (!spec) return;
  const fmt = (v, dec, comma) => {
    const s = v.toFixed(dec);
    if (!comma) return s;
    const [i, d] = s.split(".");
    return i.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (d ? "." + d : "");
  };
  function calibrate(panel) {
    if (R) return;
    panel.querySelectorAll(".spec__rows dd b").forEach((b) => {
      const node = [...b.childNodes].find((n) => n.nodeType === 3 && /\d/.test(n.textContent));
      if (!node) return;
      const original = node.__orig || (node.__orig = node.textContent);
      // Solo cifras de medida: no se cuentan nombres de normas ni de láminas (NFPA 13, KR-18)
      if (/[A-Za-z]{2,}[ -]?\d/.test(original) && !/^\s*(Desde|Cerca|Calibre|Retorno|Desplante|\d)/.test(original)) return;
      const parts = original.split(/(\d[\d,]*(?:\.\d+)?)/);
      const nums = parts.map((t, i) => (i % 2 ? { v: parseFloat(t.replace(/,/g, "")), dec: (t.split(".")[1] || "").length, comma: t.includes(",") } : null));
      const t0 = performance.now(), dur = 900;
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        node.textContent = parts.map((p, i) => (nums[i] ? fmt(nums[i].v * e, nums[i].dec, nums[i].comma) : p)).join("");
        if (k < 1) requestAnimationFrame(tick); else node.textContent = original;
      };
      requestAnimationFrame(tick);
    });
  }
  FX.watch(spec, () => {
    if (spec.classList.contains("is-live")) return;
    spec.classList.add("is-live");
    const on = spec.querySelector(".spec__panel.is-on");
    if (on) setTimeout(() => calibrate(on), 300);
  }, null, "0px 0px -20% 0px");
  new MutationObserver((list) => {
    for (const m of list) {
      const el = m.target;
      if (el.classList.contains("is-on") && !(m.oldValue || "").includes("is-on") && spec.classList.contains("is-live")) setTimeout(() => calibrate(el), 250);
    }
  }).observe(spec, { subtree: true, attributes: true, attributeFilter: ["class"], attributeOldValue: true });
})();
