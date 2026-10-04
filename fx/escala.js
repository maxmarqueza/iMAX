// Contacto: el formulario dibuja la nave que pides. Con la superficie, la huella crece a escala
// junto a una caja de 53 pies; con los andenes se abren las puertas; con la altura se acota el corte.
(function escala() {
  const fig = document.querySelector(".escala");
  const form = document.getElementById("form-contacto");
  if (!fig || !form) return;
  const svg = fig.querySelector("svg");
  const status = fig.querySelector(".escala__status");
  const NS = "http://www.w3.org/2000/svg";
  const W = 520, H = 300, PAD = 18;
  const TRAILER = 16.15, PATIO = 36, DOOR = 2.74, BAY = 3.66;

  // Lectura tolerante: "5,000", "5000 m2", "5 000" valen lo mismo
  const num = (v) => { const n = parseFloat(String(v).replace(/[^\d.,]/g, "").replace(/,(?=\d{3}(\D|$))/g, "").replace(",", ".")); return isFinite(n) ? n : NaN; };
  const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); (parent || svg).appendChild(n); return n; };
  const fmt = (n) => Math.round(n).toLocaleString("es-MX");

  // Retícula de fondo, fija
  const grid = el("g", { class: "g" });
  for (let x = 0; x <= W; x += 20) el("line", { x1: x, y1: 0, x2: x, y2: H }, grid);
  for (let y = 0; y <= H; y += 20) el("line", { x1: 0, y1: y, x2: W, y2: y }, grid);
  const layer = el("g", {});

  let cur = { area: 5000, docks: 6, h: 0 }, from = cur, to = cur, t0 = 0, raf = 0, timer = 0;

  function read() {
    const area = num(form.superficie.value), docks = num(form.andenes.value), h = num(form.altura.value);
    const ghost = !(area >= 200 && area <= 300000);
    fig.classList.toggle("is-ghost", ghost);
    const mode = form.interes.value;
    fig.classList.toggle("is-proyecto", /Construir/.test(mode));
    return { area: ghost ? 5000 : area, docks: isFinite(docks) ? Math.max(0, Math.min(60, Math.round(docks))) : (ghost ? 6 : 0), h: isFinite(h) && h > 3 && h < 40 ? h : 0, ghost, parque: /parque/.test(mode) };
  }

  function draw(s, info) {
    layer.textContent = "";
    const wide = Math.sqrt(s.area / 2), long = wide * 2; // proporción 1:2 ilustrativa
    const n = info.parque ? 3 : 1;
    const spanX = n === 1 ? long : long * 1.6;
    const scale = Math.min((W - PAD * 2 - 70) / spanX, (H - PAD * 2 - 60) / (wide + PATIO));
    const ox = PAD + 6, oy = PAD + 36;
    const naves = n === 1 ? [[0, 0, 1]] : [[0, 0, 0.55], [0, 0.6, 0.55], [0.6, 0.6, 0.55]]; // en L: la esquina de arriba a la derecha queda para los datos
    naves.forEach(([fx, fy, k], i) => {
      const L = long * k * (n === 1 ? 1 : 0.95), Wd = wide * k;
      const x = ox + fx * spanX * scale, y = oy + fy * (wide + PATIO) * scale;
      el("rect", { class: "patio", x, y: y + Wd * scale, width: L * scale, height: Math.min(PATIO, PATIO * k + 6) * scale }, layer);
      el("rect", { class: "nave", x, y, width: L * scale, height: Wd * scale }, layer);
      // Ejes de columnas cada ~15 m
      const bays = Math.max(1, Math.round(L / 15));
      for (let b = 1; b < bays; b++) el("line", { class: "eje", x1: x + (L * scale * b) / bays, y1: y, x2: x + (L * scale * b) / bays, y2: y + Wd * scale }, layer);
      // Puertas de andén en el lado largo, hacia el patio
      if (i === 0) {
        const fit = Math.floor(L / BAY);
        const d = Math.min(Math.round(s.docks), fit);
        const startX = x + (L * scale - d * BAY * scale) / 2;
        for (let j = 0; j < d; j++) el("rect", { class: "door", x: startX + (j * BAY + (BAY - DOOR) / 2) * scale, y: y + Wd * scale - 2, width: Math.max(1.2, DOOR * scale), height: 4 }, layer);
        if (s.docks > fit + 0.5) el("text", { x: x + L * scale + 6, y: y + Wd * scale + 4, class: "gold" }, layer).textContent = "+" + Math.round(s.docks - fit);
        // Caja de 53 pies estacionada en el patio, a la misma escala
        const tx = d ? startX + ((BAY - 2.6) / 2) * scale : x + 6, ty = y + Wd * scale + 4;
        el("rect", { class: "caja", x: tx, y: ty, width: Math.max(1.5, 2.6 * scale), height: TRAILER * scale, rx: 1 }, layer);
      }
    });
    // Cotas
    const L1 = (n === 1 ? long : long * 0.55 * 0.95) * scale, W1 = (n === 1 ? wide : wide * 0.55) * scale;
    el("path", { class: "cota", d: `M${ox} ${oy - 12}H${ox + L1}M${ox} ${oy - 17}V${oy - 7}M${ox + L1} ${oy - 17}V${oy - 7}` }, layer);
    el("text", { x: ox + L1 / 2, y: oy - 18, "text-anchor": "middle", class: "soft" }, layer).textContent = (n === 1 ? "≈ " + Math.round(long) : "≈ " + Math.round(long * 0.52)) + " m";
    // Superficie y datos
    el("text", { x: W - PAD, y: PAD + 26, "text-anchor": "end", class: "big" }, layer).textContent = info.ghost ? "— m²" : fmt(s.area) + " m²";
    el("text", { x: W - PAD, y: PAD + 46, "text-anchor": "end", class: "soft" }, layer).textContent = (info.ghost ? "Ejemplo de 5,000 m² con 6 andenes" : s.docks >= 0.5 ? Math.round(s.docks) + (Math.round(s.docks) === 1 ? " andén" : " andenes") : "Sin andenes") + (s.h ? " · " + s.h.toFixed(s.h % 1 ? 1 : 0) + " m de altura libre" : "");
    // Escala gráfica
    const steps = [5, 10, 20, 25, 50, 100, 200, 250, 500];
    const step = steps.find((v) => v * scale >= 40) || 500;
    const by = H - 14, bx = W - PAD - step * 2 * scale;
    el("path", { class: "cota", d: `M${bx} ${by}H${bx + step * 2 * scale}M${bx} ${by - 4}V${by + 4}M${bx + step * scale} ${by - 4}V${by + 4}M${bx + step * 2 * scale} ${by - 4}V${by + 4}` }, layer);
    el("text", { x: bx, y: by - 8, "text-anchor": "middle", class: "soft" }, layer).textContent = "0";
    el("text", { x: bx + step * 2 * scale, y: by - 8, "text-anchor": "middle", class: "soft" }, layer).textContent = step * 2 + " m";
    el("text", { x: PAD, y: H - 10, class: "soft" }, layer).textContent = "Caja de 53 pies (16 m)";
  }

  function update() {
    const info = read();
    from = { ...cur }; to = { area: info.area, docks: info.docks, h: info.h }; t0 = performance.now();
    const step = (t) => {
      const k = FX.reduce ? 1 : Math.min(1, (t - t0) / 450), e = 1 - Math.pow(1 - k, 3);
      cur = { area: FX.lerp(from.area, to.area, e), docks: FX.lerp(from.docks, to.docks, e), h: to.h };
      draw(cur, info);
      raf = k < 1 ? requestAnimationFrame(step) : 0;
    };
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(step);
    clearTimeout(timer);
    timer = setTimeout(() => {
      status.textContent = info.ghost ? "" : `Dibujo actualizado: nave de ${fmt(info.area)} metros cuadrados, ${info.docks} andenes${info.h ? ", " + info.h + " metros de altura libre" : ""}.`;
    }, 700);
  }

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  document.querySelectorAll("[data-interes]").forEach((a) => a.addEventListener("click", () => setTimeout(update, 0)));
  update();
})();
