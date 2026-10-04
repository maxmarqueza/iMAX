// Ficha técnica: los siete dibujos se reúnen en una sola lámina con cartela. Al cambiar de pestaña
// la cámara se aleja, cruza la lámina y entra al detalle, que se vuelve a entintar. Con el cursor
// aparece una retícula que se engancha a las cotas. Las cifras de la tabla se calibran al llegar.
(function lamina() {
  const spec = document.querySelector(".spec");
  if (!spec) return;
  const panels = [...spec.querySelectorAll(".spec__panel")];
  const tabs = [...spec.querySelectorAll(".spec__tabs [role='tab']")];
  const host = spec.querySelector(".spec__panels");
  if (!panels.length || !host) return;
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent.appendChild(n); return n; };

  const CW = 480, CH = 240, G = 48, COLS = 3;
  const W = G * (COLS + 1) + CW * COLS, H = G * 4 + CH * 3;
  const wrap = document.createElement("div");
  wrap.className = "spec__sheet";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "spec__draw");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  wrap.appendChild(svg);
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "spec__all"; btn.textContent = "Ver lámina completa";
  wrap.appendChild(btn);
  host.prepend(wrap);

  // Cada dibujo se mueve a su celda de la lámina
  const cells = panels.map((panel, i) => {
    const src = panel.querySelector("svg.spec__draw");
    const x = G + (i % COLS) * (CW + G), y = G + Math.floor(i / COLS) * (CH + G);
    const g = el("g", { class: "det", transform: `translate(${x} ${y})`, "data-i": i }, svg);
    el("rect", { class: "cell", x: 0, y: 0, width: CW, height: CH, rx: 10 }, g);
    const tit = el("text", { class: "tit", x: 14, y: -12 }, g);
    const t1 = document.createElementNS(NS, "tspan"); t1.textContent = String(i + 1).padStart(2, "0") + "  ";
    tit.appendChild(t1); tit.appendChild(document.createTextNode((tabs[i] && tabs[i].textContent.trim()) || ""));
    if (src) {
      [...src.childNodes].forEach((n) => { if (n.nodeType === 1 && n.tagName !== "text") n.classList.add("ink"); g.appendChild(n); });
      src.remove();
    }
    return { g, x, y };
  });
  // Cartela en las dos celdas libres
  const cx = G + 1 * (CW + G), cy = G + 2 * (CH + G), cw = CW * 2 + G;
  const cart = el("g", { class: "cart", transform: `translate(${cx} ${cy})` }, svg);
  el("rect", { x: 0, y: 0, width: cw, height: CH, rx: 10 }, cart);
  el("text", { class: "big", x: 28, y: 76 }, cart).textContent = "IMAX";
  el("text", { x: 28, y: 110 }, cart).textContent = "Ficha técnica de una nave y un parque industrial";
  [["Proyecto", "Nave industrial tipo"], ["Lámina", "01 de 01"], ["Escala", "Ilustrativa"], ["Valores", "Referencias de mercado"]].forEach(([k, v], i) => {
    const x = 28 + (i % 2) * (cw / 2), y = 150 + Math.floor(i / 2) * 44;
    el("line", { x1: x - 10, y1: y - 22, x2: x + cw / 2 - 40, y2: y - 22 }, cart);
    el("text", { class: "k", x, y: y - 6 }, cart).textContent = k;
    el("text", { x, y: y + 12 }, cart).textContent = v;
  });

  // Retícula
  const ret = el("g", { class: "ret" }, svg);
  const rx = el("line", { x1: 0, y1: 0, x2: 0, y2: H }, ret), ry = el("line", { x1: 0, y1: 0, x2: W, y2: 0 }, ret);
  const snap = el("rect", { width: 12, height: 12, x: -20, y: -20 }, ret);

  // Cámara: el viewBox vuela entre el detalle actual y el siguiente
  let vb = [0, 0, W, H], cur = 0, all = false, raf = 0;
  const target = (i) => { const c = cells[i]; return [c.x - 26, c.y - 34, CW + 52, CH + 60]; };
  const setVB = (v) => { vb = v; svg.setAttribute("viewBox", v.map((n) => n.toFixed(2)).join(" ")); };
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function fly(to, done) {
    cancelAnimationFrame(raf);
    if (FX.reduce) { setVB(to); done && done(); return; }
    const from = vb.slice(), t0 = performance.now(), dur = 950;
    const d = Math.hypot(to[0] - from[0], to[1] - from[1]) / W;
    const pull = Math.min(1.1, 0.2 + d * 1.6);
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = ease(k), z = 1 + pull * Math.sin(Math.PI * k);
      const w = FX.lerp(from[2], to[2], e) * z, h = FX.lerp(from[3], to[3], e) * z;
      const mx = FX.lerp(from[0] + from[2] / 2, to[0] + to[2] / 2, e), my = FX.lerp(from[1] + from[3] / 2, to[1] + to[3] / 2, e);
      setVB([mx - w / 2, my - h / 2, w, h]);
      if (k < 1) raf = requestAnimationFrame(step); else done && done();
    };
    raf = requestAnimationFrame(step);
  }
  function retrace(i) {
    const g = cells[i].g;
    g.classList.remove("draw");
    void g.getBBox();
    g.classList.add("draw");
  }
  function show(i, instant) {
    cur = i; all = false;
    wrap.classList.remove("is-all");
    btn.textContent = "Ver lámina completa";
    cells.forEach((c, j) => c.g.classList.toggle("is-on", j === i));
    if (instant) { setVB(target(i)); return; }
    fly(target(i), () => { if (spec.classList.contains("is-live")) retrace(i); });
  }
  btn.addEventListener("click", () => {
    if (all) { show(cur); return; }
    all = true;
    wrap.classList.add("is-all");
    btn.textContent = "Volver al detalle";
    fly([0, 0, W, H]);
  });
  svg.addEventListener("click", (e) => {
    if (!all) return;
    const g = e.target.closest(".det");
    if (g && tabs[+g.dataset.i]) tabs[+g.dataset.i].click();
  });

  // Seguir las pestañas: select() de script.js activa el panel; aquí se mueve la cámara
  new MutationObserver((list) => {
    for (const m of list) {
      const p = m.target;
      if (p.classList.contains("is-on") && !(m.oldValue || "").includes("is-on")) {
        const i = panels.indexOf(p);
        if (i >= 0 && (i !== cur || all)) show(i);
        if (spec.classList.contains("is-live")) setTimeout(() => calibrate(p), 200);
      }
    }
  }).observe(host, { subtree: true, attributes: true, attributeFilter: ["class"], attributeOldValue: true });
  const first = Math.max(0, panels.findIndex((p) => p.classList.contains("is-on")));
  show(first, true);

  // Retícula de dibujante que se engancha a los extremos de las cotas
  if (FX.fine && !FX.reduce) {
    const toSVG = (e) => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
    let ends = [];
    const collect = () => {
      ends = [];
      const c = cells[cur];
      c.g.querySelectorAll(".dim").forEach((d) => {
        if (!d.getTotalLength) return;
        const len = d.getTotalLength();
        [0, len].forEach((s) => { const p = d.getPointAtLength(s); ends.push({ x: p.x + c.x, y: p.y + c.y, d }); });
      });
    };
    let hot = null;
    svg.addEventListener("pointerenter", () => { collect(); wrap.classList.add("is-ret"); });
    svg.addEventListener("pointerleave", () => { wrap.classList.remove("is-ret"); if (hot) hot.classList.remove("hot"); hot = null; });
    svg.addEventListener("pointermove", (e) => {
      if (all) return;
      const p = toSVG(e);
      let best = null, bd = 16;
      for (const q of ends) { const dd = Math.hypot(q.x - p.x, q.y - p.y); if (dd < bd) { bd = dd; best = q; } }
      const x = best ? best.x : p.x, y = best ? best.y : p.y;
      rx.setAttribute("x1", x); rx.setAttribute("x2", x); rx.setAttribute("y1", vb[1]); rx.setAttribute("y2", vb[1] + vb[3]);
      ry.setAttribute("y1", y); ry.setAttribute("y2", y); ry.setAttribute("x1", vb[0]); ry.setAttribute("x2", vb[0] + vb[2]);
      snap.setAttribute("x", best ? x - 6 : -50); snap.setAttribute("y", best ? y - 6 : -50);
      if (hot && (!best || hot !== best.d)) hot.classList.remove("hot");
      hot = best ? best.d : null;
      if (hot) hot.classList.add("hot");
    });
  }

  // Cifras: suben hasta su valor una vez, al activarse cada panel
  const fmt = (v, dec, comma) => {
    const s = v.toFixed(dec);
    if (!comma) return s;
    const [i, d] = s.split(".");
    return i.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (d ? "." + d : "");
  };
  function calibrate(panel) {
    if (FX.reduce) return;
    panel.querySelectorAll(".spec__rows dd b").forEach((b) => {
      const node = [...b.childNodes].find((n) => n.nodeType === 3 && /\d/.test(n.textContent));
      if (!node) return;
      const original = node.__orig || (node.__orig = node.textContent);
      // No se cuentan nombres de normas ni de láminas (NFPA 13, KR-18, NOM-025)
      if (/[A-Z]{2,}[ -]?\d/.test(original)) return;
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

  // Al llegar la sección: se entinta el primer detalle y se calibran sus cifras
  FX.watch(spec.querySelector(".spec__body"), () => {
    if (spec.classList.contains("is-live")) return;
    spec.classList.add("is-live");
    retrace(cur);
    calibrate(panels[cur]);
  }, null, "0px 0px -25% 0px");
})();
