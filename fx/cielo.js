// De polvo a nave, dos capas más sobre el video:
// 1. La etapa se escribe en el cielo con letras enormes, detrás de la sierra. Cada palabra sale por
//    detrás de las montañas y se hunde al terminar su etapa; las piezas que flotan la cruzan por delante
//    gracias a un mate de todo el video (media/cielo-mate.webp) y a la máscara del cielo.
// 2. Con la nave terminada, tres cotas se trazan solas sobre ella y sus cifras suben hasta el valor.
(function cielo() {
  const act = document.getElementById("anatomia");
  if (!act || FX.reduce) return;
  const sky = act.querySelector(".anat__cielo");
  const words = [...sky.querySelectorAll("span")].map((el) => ({ el, a: +el.dataset.a, b: +el.dataset.b, dim: el.hasAttribute("data-dim"), w: 0 }));
  const video = act.querySelector("video[data-sc-scrub]");
  const world = act.querySelector(".anat__world");

  // Tamaño: cada palabra ocupa el ancho visible sin pasar del 21 % del alto de la escena
  const meter = document.createElement("canvas").getContext("2d");
  function fit() {
    const wr = world.getBoundingClientRect();
    const visible = Math.min(innerWidth, wr.width) * 0.9;
    meter.font = "900 100px Archivo, sans-serif";
    if ("fontStretch" in meter) meter.fontStretch = "expanded";
    words.forEach((w) => {
      const m = meter.measureText(w.el.textContent.toUpperCase()).width * 0.965;
      const size = Math.min((visible / m) * 100, wr.height * 0.27);
      w.el.style.fontSize = size.toFixed(1) + "px";
    });
  }

  let raf = 0, last = -1;
  function frame() {
    raf = 0;
    const p = FX.actP(act);
    const r = act.getBoundingClientRect();
    const entering = r.top > 0;
    for (const w of words) {
      // Sale de detrás de la sierra al entrar a su etapa y se hunde al salir
      const inK = w.a < 0 ? 1 : FX.smooth((p - w.a) / 0.035);
      const outK = FX.smooth((p - (w.b - 0.035)) / 0.035);
      const k = entering && w.a < 0 ? 1 : Math.min(inK, 1 - outK);
      const y = (1 - k) * 70;
      w.el.style.opacity = k <= 0.001 ? "0" : String((w.dim ? 0.5 : 1) * Math.min(1, k * 1.6));
      w.el.style.transform = `translate3d(0, ${y.toFixed(2)}%, 0)`;
    }
    // Cuadro del video para el mate (85 cuadros, uno de cada cuatro)
    if (video && video.duration) {
      const idx = Math.max(0, Math.min(84, Math.round(((video.currentTime / video.duration) * 336) / 4)));
      if (idx !== last) {
        last = idx;
        sky.style.setProperty("--cx", ((idx % 10) / 9 * 100).toFixed(3) + "%");
        sky.style.setProperty("--cy", (Math.floor(idx / 10) / 8 * 100).toFixed(3) + "%");
      }
    }
    // Medidas sobre la nave terminada
    const on = p > 0.93;
    if (on !== act.classList.contains("is-medida")) {
      act.classList.toggle("is-medida", on);
      if (on) count();
    }
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", () => { fit(); kick(); });
  if (video && "requestVideoFrameCallback" in video) {
    const onFrame = () => { kick(); video.requestVideoFrameCallback(onFrame); };
    video.requestVideoFrameCallback(onFrame);
  } else FX.loop(act, kick);
  fit(); kick();
  if (document.fonts) document.fonts.ready.then(() => { fit(); kick(); });

  // ------------------------------------------------------------ Cotas de la nave terminada
  const svg = act.querySelector(".anat__cotas");
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); (parent || svg).appendChild(n); return n; };
  // Medidas sobre el último cuadro del video (1942 x 1080)
  const FL = [598, 788], FR = [1518, 613], D = [0.886, 0.464];
  const off = (p, k) => [p[0] + D[0] * k, p[1] + D[1] * k];
  const labels = [];
  function cota(cls, d, x, y, name, value) {
    el("path", { class: "c " + cls, d, pathLength: 1 });
    // El grupo exterior coloca la etiqueta; el interior es el que se anima con CSS
    const g = el("g", { class: "lbl " + cls }, el("g", { transform: `translate(${x} ${y})` }));
    const box = el("rect", { x: 0, y: 0, width: 320, height: 82, rx: 12 }, g);
    el("text", { x: 18, y: 32 }, g).textContent = name;
    const v = el("text", { class: "v", x: 18, y: 68 }, g);
    v.textContent = value;
    labels.push({ v, value, box });
  }
  // Altura libre en la esquina derecha
  cota("d1", "M1600 613 V520 M1584 613 H1616 M1584 520 H1616", 1420, 400, "Altura libre", "9.75 a 11 m");
  // Fachada de andenes, paralela al frente
  const a = off(FL, 46), b = off(FR, 46);
  cota("d2", `M${a[0]} ${a[1]} L${b[0]} ${b[1]} M${a[0] - 8} ${a[1] - 16} L${a[0] + 8} ${a[1] + 16} M${b[0] - 8} ${b[1] - 16} L${b[0] + 8} ${b[1] + 16}`, 830, 836, "Puertas de andén", "2.74 × 3.05 m");
  // Fondo del patio de maniobras
  const m = [(FL[0] + FR[0]) / 2 + 120, (FL[1] + FR[1]) / 2 - 22], e = off(m, 250);
  cota("d3", `M${m[0]} ${m[1]} L${e[0]} ${e[1]} M${e[0] - 14} ${e[1] + 10} L${e[0] + 14} ${e[1] - 10}`, e[0] + 26, e[1] - 30, "Patio de maniobras", "33 a 40 m");
  requestAnimationFrame(() => labels.forEach((l) => l.box.setAttribute("width", Math.ceil(Math.max(l.v.getComputedTextLength(), l.v.previousSibling.getComputedTextLength()) + 36))));

  function count() {
    labels.forEach((l, i) => {
      const parts = l.value.split(/(\d+(?:\.\d+)?)/);
      const t0 = performance.now() + 600 + i * 250;
      const tick = (t) => {
        const k = FX.clamp01((t - t0) / 900), ez = 1 - Math.pow(1 - k, 3);
        l.v.textContent = parts.map((s, j) => (j % 2 ? (parseFloat(s) * ez).toFixed((s.split(".")[1] || "").length) : s)).join("");
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
})();
