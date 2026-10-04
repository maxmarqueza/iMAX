// Parque: el recorrido empieza a la hora dorada y termina a la hora azul. Se encienden la caseta,
// las luminarias del camellón hacia el fondo, los andenes y las oficinas; por la vialidad pasan vehículos.
(function anochece() {
  const act = document.getElementById("parque");
  if (!act || FX.reduce) return;
  const dusk = act.querySelector(".tour__dusk");
  const canvas = act.querySelector(".tour__lights");
  if (!dusk || !canvas) return;
  if (FX.narrow() && dusk.dataset.srcMobile) dusk.src = dusk.dataset.srcMobile;
  const ctx = canvas.getContext("2d");
  const cache = document.createElement("canvas");
  const cctx = cache.getContext("2d");

  // Coordenadas en píxeles de la foto original (2752 x 1536). Cada luz va sobre algo que existe en la imagen.
  const W = 2752, H = 1536;
  const L = [];
  const add = (kind, x, y, at, extra) => L.push(Object.assign({ kind, x: x / W, y: y / H, at, k: 0, warm: 0 }, extra));
  // Caseta de acceso
  add("canopy", 1390, 1200, 0.3);
  add("window", 1368, 1228, 0.3, { w: 26, h: 12 });
  add("window", 1412, 1228, 0.3, { w: 26, h: 12 });
  // Luminarias del camellón, de la entrada hacia el fondo (dos brazos cada una)
  [967, 812, 738, 655, 605, 490].forEach((y, i) => {
    const x = { 967: 1390, 812: 1395, 738: 1397, 655: 1395, 605: 1400, 490: 1400 }[y];
    add("lamp", x - 15, y, 0.34 + i * 0.022);
    add("lamp", x + 15, y, 0.34 + i * 0.022);
  });
  // Postes de banqueta y estacionamientos
  [[1115, 1015, 0.36], [1680, 1013, 0.37], [950, 1185, 0.38], [2272, 1200, 0.39], [410, 1200, 0.4]].forEach(([x, y, at]) => add("lamp", x, y, at));
  // Andenes: luz sobre cada puerta y su charco hacia el patio (dir: lado del patio)
  [[975, 745], [915, 820], [862, 888], [828, 925], [796, 962]].forEach(([x, y], i) => add("dock", x, y, 0.47 + i * 0.012, { dir: 1 }));
  [[1170, 545], [1120, 600], [1065, 665]].forEach(([x, y], i) => add("dock", x, y, 0.5 + i * 0.012, { dir: 1 }));
  [[1900, 780], [1958, 838], [2035, 918], [2087, 985]].forEach(([x, y], i) => add("dock", x, y, 0.53 + i * 0.012, { dir: -1 }));
  [[1712, 600], [1728, 632], [1745, 665]].forEach(([x, y], i) => add("dock", x, y, 0.56 + i * 0.012, { dir: -1 }));
  // Oficinas con luz interior
  add("office", 670, 1095, 0.66, { w: 64, h: 52 });
  add("office", 1022, 695, 0.68, { w: 34, h: 30 });
  add("office", 1820, 680, 0.7, { w: 34, h: 30 });
  add("office", 2220, 1095, 0.72, { w: 64, h: 52 });

  // Tamaño aparente según la distancia: lo de atrás (arriba en la foto) se ve más chico
  const depth = (y) => 0.38 + 0.62 * FX.clamp01((y - 0.3) / 0.65);
  let cw = 0, ch = 0, scale = 1;

  function layout() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const max = FX.narrow() ? 1100 : 1700;
    cw = Math.round(Math.min(max, W * 0.62));
    ch = Math.round(cw * H / W);
    canvas.width = cache.width = cw;
    canvas.height = cache.height = ch;
    scale = cw / W;
    dirty = true;
  }

  function glow(c, x, y, r, rgb, a) {
    if (a <= 0.002 || r <= 0) return;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(0.35, `rgba(${rgb},${a * 0.38})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function pool(c, x, y, rx, ry, rgb, a) {
    if (a <= 0.002) return;
    c.save();
    c.translate(x, y);
    c.scale(1, ry / rx);
    glow(c, 0, 0, rx, rgb, a);
    c.restore();
  }
  // Vapor de sodio: arranca tenue y rosado y se asienta en ámbar
  const sodium = (w) => {
    const r = 255, g = Math.round(FX.lerp(110, 176, w)), b = Math.round(FX.lerp(150, 86, w));
    return `${r},${g},${b}`;
  };

  function paintStatic() {
    cctx.setTransform(1, 0, 0, 1, 0, 0);
    cctx.clearRect(0, 0, cw, ch);
    cctx.globalCompositeOperation = "lighter";
    const u = scale * W / 1000; // unidad: una milésima del ancho de la foto
    for (const l of L) {
      if (l.k <= 0.002) continue;
      const x = l.x * cw, y = l.y * ch, d = depth(l.y), k = l.k;
      if (l.kind === "lamp") {
        const rgb = sodium(l.warm);
        pool(cctx, x, y + 9 * u * d, 34 * u * d, 15 * u * d, rgb, 0.32 * k);
        glow(cctx, x, y, 15 * u * d, rgb, 0.75 * k);
        glow(cctx, x, y, 3.2 * u * d, "255,236,200", 1 * k);
      } else if (l.kind === "dock") {
        const rgb = "255,196,120";
        pool(cctx, x + l.dir * 22 * u * d, y + 8 * u * d, 30 * u * d, 13 * u * d, rgb, 0.4 * k);
        glow(cctx, x, y, 11 * u * d, rgb, 0.8 * k);
        glow(cctx, x, y, 2.6 * u * d, "255,240,214", 1 * k);
      } else if (l.kind === "office" || l.kind === "window") {
        const w = l.w * scale, h = l.h * scale;
        cctx.fillStyle = `rgba(255,214,150,${0.5 * k})`;
        cctx.fillRect(x - w / 2, y - h / 2, w, h);
        glow(cctx, x, y, Math.max(w, h) * 1.4, "255,200,130", 0.45 * k);
        pool(cctx, x, y + h * 0.9, w * 1.2, h * 0.5, "255,196,120", 0.3 * k);
      } else if (l.kind === "canopy") {
        pool(cctx, x, y + 14 * u, 46 * u, 22 * u, "255,238,210", 0.42 * k);
        glow(cctx, x, y, 12 * u, "255,240,220", 0.9 * k);
      }
    }
  }

  // Vehículos: siguen las vialidades de la foto (fracciones), con faros y calaveras
  const LANES = [
    { pts: [[0.536, 0.995], [0.538, 0.86], [0.535, 0.7], [0.531, 0.5], [0.528, 0.33]], dur: 15000, off: 0, away: true, truck: true },
    { pts: [[0.494, 0.33], [0.49, 0.5], [0.484, 0.7], [0.48, 0.86], [0.478, 0.995]], dur: 13000, off: 6200, away: false },
    { pts: [[-0.05, 0.952], [1.05, 0.948]], dur: 9000, off: 1500, away: false, side: 1 },
    { pts: [[1.05, 0.935], [-0.05, 0.94]], dur: 11000, off: 4000, away: true, side: -1 },
  ];
  const along = (pts, t) => {
    const seg = pts.length - 1, f = t * seg, i = Math.min(seg - 1, Math.floor(f)), k = f - i;
    const a = pts[i], b = pts[i + 1];
    return { x: FX.lerp(a[0], b[0], k), y: FX.lerp(a[1], b[1], k), dx: b[0] - a[0], dy: b[1] - a[1] };
  };
  function paintTraffic(t, amount) {
    if (amount <= 0.01) return;
    ctx.globalCompositeOperation = "lighter";
    const u = scale * W / 1000;
    for (const lane of LANES) {
      const ph = ((t + lane.off) % lane.dur) / lane.dur;
      const q = along(lane.pts, ph);
      const d = depth(q.y);
      const x = q.x * cw, y = q.y * ch;
      const len = Math.hypot(q.dx * cw, q.dy * ch) || 1;
      const ux = (q.dx * cw) / len, uy = (q.dy * ch) / len; // hacia dónde avanza
      const px = -uy, py = ux;
      const sep = (lane.truck ? 4.2 : 3.4) * u * d;
      const fade = amount * FX.smooth(Math.min(ph, 1 - ph) / 0.06);
      // Faros: luz al frente; calaveras: rojo atrás
      const fx = x + ux * 5 * u * d, fy = y + uy * 5 * u * d;
      const bx = x - ux * (lane.truck ? 14 : 6) * u * d, by = y - uy * (lane.truck ? 14 : 6) * u * d;
      pool(ctx, fx + ux * 18 * u * d, fy + uy * 18 * u * d, 22 * u * d, 11 * u * d, "255,236,200", 0.28 * fade);
      for (const s of [-1, 1]) {
        glow(ctx, fx + px * sep * s, fy + py * sep * s, 5 * u * d, "255,242,224", 0.95 * fade);
        glow(ctx, bx + px * sep * s, by + py * sep * s, 3.6 * u * d, "255,46,30", 0.85 * fade);
      }
    }
  }

  let dirty = true, lastDusk = -1;
  function frame(t, dt) {
    if (!cw) layout();
    const p = FX.actP(act);
    const dk = FX.smooth((p - 0.26) / 0.44);
    if (Math.abs(dk - lastDusk) > 0.001) { act.style.setProperty("--dusk", dk.toFixed(3)); lastDusk = dk; }
    // Cada luz se enciende con su retraso propio y se apaga rápido si se regresa
    for (const l of L) {
      const target = p >= l.at ? 1 : 0;
      const k0 = l.k;
      if (target > l.k) {
        l.k = Math.min(1, l.k + dt / (l.kind === "lamp" ? 900 : 420));
        if (l.kind === "lamp") l.warm = Math.min(1, l.warm + dt / 1600);
      } else if (target < l.k) {
        l.k = Math.max(0, l.k - dt / 260);
        if (l.k === 0) l.warm = 0;
      }
      if (l.k !== k0) dirty = true;
      if (l.kind === "lamp" && l.k > 0 && l.warm < 1) { l.warm = Math.min(1, l.warm + dt / 1600); dirty = true; }
    }
    if (dirty) { paintStatic(); dirty = false; }
    const traffic = FX.smooth((p - 0.42) / 0.12);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, cw, ch);
    if (lastDusk > 0.02) ctx.drawImage(cache, 0, 0);
    paintTraffic(t, traffic);
  }

  addEventListener("resize", layout);
  FX.loop(act, frame);
})();
