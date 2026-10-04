// Datos de contacto de IMAX. Llenar antes de publicar.
const CONFIG = {
  whatsapp: "", // con lada de país y sin signos, por ejemplo "5215512345678"
  phone: "",    // como se debe leer, por ejemplo "55 1234 5678"
  email: "",
  address: "",
};

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const clamp01 = (n) => Math.min(1, Math.max(0, n));
const smooth = (n) => { n = clamp01(n); return n * n * (3 - 2 * n); };
const lerp = (a, b, t) => a + (b - a) * t;
// Avance de un acto fijo (0 a 1), con la misma fórmula que usa el motor para --sc-p
const actP = (el) => {
  const r = el.getBoundingClientRect();
  return clamp01(-r.top / Math.max(r.height - innerHeight, 1));
};

ScrollCraft.mount(document.body);

// Datos de contacto visibles
// Lo que todavía no tiene dato no se muestra
document.querySelectorAll("[data-cfg]").forEach((el) => {
  const value = CONFIG[el.dataset.cfg];
  if (!value) { el.closest("div").hidden = true; return; }
  el.textContent = value;
  if (el.dataset.cfg === "phone") el.href = "tel:" + value.replace(/\s+/g, "");
  if (el.dataset.cfg === "email") el.href = "mailto:" + value;
});
document.querySelectorAll(".contact__data").forEach((dl) => { dl.hidden = !dl.querySelector("div:not([hidden])"); });
document.getElementById("anio").textContent = new Date().getFullYear();

// Barra de navegación y menú con vista previa
const topBar = document.getElementById("top");
const mega = document.getElementById("mega");
const triggers = topBar.querySelectorAll("[aria-controls='mega']");
const megaItems = [...mega.querySelectorAll(".mega__item:not(.mega__item--mobile)")];
const megaImgs = [...mega.querySelectorAll(".mega__preview img")];

function setMenu(open) {
  mega.hidden = !open;
  topBar.classList.toggle("is-open", open);
  triggers.forEach((t) => t.setAttribute("aria-expanded", String(open)));
}
function previewItem(index) {
  megaItems.forEach((item, i) => item.classList.toggle("is-on", i === index));
  megaImgs.forEach((img, i) => img.classList.toggle("is-on", i === index));
}
megaItems.forEach((item, i) => {
  item.addEventListener("mouseenter", () => previewItem(i));
  item.addEventListener("focus", () => previewItem(i));
});
previewItem(0);
triggers.forEach((t) => t.addEventListener("click", () => setMenu(mega.hidden)));
mega.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
document.addEventListener("click", (e) => !topBar.contains(e.target) && setMenu(false));
addEventListener("scroll", () => topBar.classList.toggle("is-solid", scrollY > 40), { passive: true });

// Los enlaces de cada servicio preseleccionan el interés en el formulario
document.querySelectorAll("[data-interes]").forEach((link) =>
  link.addEventListener("click", () => {
    document.getElementById("f-interes").value = link.dataset.interes;
  })
);

// ---------------------------------------------------------------- Portada
// El nombre IMAX es una placa oscura con las letras recortadas: adentro se ve
// la nave en video. Al bajar, la cámara atraviesa una letra y la placa se disuelve.
(function hero() {
  const act = document.querySelector(".hero");
  const stage = act.querySelector(".hero__stage");
  const video = act.querySelector(".hero__video");
  const canvas = act.querySelector(".hero__plate");
  const ctx = canvas.getContext("2d");
  const PLATE = "#0d1a26";
  let w = 0, h = 0, dpr = 1, size = 0, left = 0, baseline = 0, ox = 0, oy = 0, lastKey = "";

  // Video de ambiente: se elige el archivo según el ancho y se pausa fuera de pantalla
  if (!reduce) {
    video.autoplay = true;
    video.src = innerWidth <= 860 ? video.dataset.srcMobile : video.dataset.src;
    video.play().catch(() => {});
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }).observe(stage);
  }

  const font = (px) => "800 " + px + "px Archivo, system-ui, sans-serif";
  function setFont(px) {
    ctx.font = font(px);
    if ("fontStretch" in ctx) ctx.fontStretch = "expanded";
  }

  function layout() {
    const r = stage.getBoundingClientRect();
    w = r.width; h = r.height;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    setFont(100);
    const m = ctx.measureText("IMAX");
    const narrow = w < 700;
    const target = Math.min(w * (narrow ? 0.9 : 0.84), 1400, h * (narrow ? 1.2 : 1.9));
    size = (100 * target) / m.width;
    const cap = ((m.actualBoundingBoxAscent || 70) / 100) * size;
    const cy = h * (narrow ? 0.29 : 0.34);
    baseline = cy + cap / 2;
    left = (w - target) / 2;
    // Centro del asta derecha de la M: por ahí entra la cámara
    ox = left + (ctx.measureText("IM").width / 100) * size - 0.17 * size;
    oy = cy;
    stage.style.setProperty("--wm-bottom", Math.round(baseline + size * 0.1) + "px");
    lastKey = "";
    draw();
  }

  function draw() {
    if (reduce || !w) return;
    const p = actP(act);
    const t = clamp01((p - 0.03) / 0.5);
    const scale = 1 + Math.pow(t, 2.6) * 26;
    const alpha = 1 - smooth((t - 0.5) / 0.42);
    const key = scale.toFixed(3) + "|" + alpha.toFixed(3);
    if (key === lastKey) return;
    lastKey = key;
    canvas.style.opacity = alpha.toFixed(3);
    if (alpha <= 0) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = PLATE;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "destination-out";
    ctx.translate(ox, oy);
    ctx.scale(scale, scale);
    ctx.translate(-ox, -oy);
    setFont(size);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#000";
    ctx.fillText("IMAX", left, baseline);
  }

  if (!reduce) {
    addEventListener("scroll", draw, { passive: true });
    addEventListener("resize", layout);
    layout();
    if (document.fonts) {
      document.fonts.load(font(100), "IMAX").then(layout).catch(() => {});
      document.fonts.ready.then(layout);
    }
    // La escena se desplaza un poco con el cursor, detrás de la placa
    if (finePointer) {
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      const step = () => {
        cx = lerp(cx, tx, 0.08); cy = lerp(cy, ty, 0.08);
        stage.style.setProperty("--px", cx.toFixed(4));
        stage.style.setProperty("--py", cy.toFixed(4));
        raf = Math.abs(cx - tx) + Math.abs(cy - ty) > 0.002 ? requestAnimationFrame(step) : 0;
      };
      stage.addEventListener("pointermove", (e) => {
        tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5;
        if (!raf) raf = requestAnimationFrame(step);
      });
    }
  }
})();

// ------------------------------------------------------- Recorrido del parque
// La cámara viaja de punto a punto sobre la vista aérea, guiada por el scroll.
(function tour() {
  const act = document.querySelector(".tour");
  const stage = act.querySelector(".tour__stage");
  const world = act.querySelector(".tour__world");
  const cam = act.querySelector(".tour__cam");
  const pins = [...act.querySelectorAll(".pin")];
  const dots = [...act.querySelectorAll(".tour__dots button")];
  // Punto de interés (fracción de la imagen) y acercamiento de cada parada
  const STOPS = [
    { fx: 0.504, fy: 0.80, s: 1.9, at: 0.2 },
    { fx: 0.505, fy: 0.56, s: 1.7, at: 0.365 },
    { fx: 0.655, fy: 0.57, s: 2.0, at: 0.525 },
    { fx: 0.79, fy: 0.53, s: 1.75, at: 0.685 },
    { fx: 0.80, fy: 0.71, s: 2.15, at: 0.86 },
  ];
  const HOLD = 0.035;
  let cur = null, active = -2, raf = 0;

  function target(p) {
    const narrow = innerWidth <= 860;
    const keys = [{ fx: 0.5, fy: 0.5, s: 1, at: 0, wide: true }];
    STOPS.forEach((st) => { keys.push({ ...st, at: st.at - HOLD }); keys.push({ ...st, at: st.at + HOLD }); });
    keys.push({ fx: 0.6, fy: 0.6, s: 1.25, at: 1.02, wide: true });
    let a = keys[0], b = keys[keys.length - 1];
    for (let i = 0; i < keys.length - 1; i++) {
      if (p >= keys[i].at && p <= keys[i + 1].at) { a = keys[i]; b = keys[i + 1]; break; }
    }
    const t = smooth((p - a.at) / Math.max(b.at - a.at, 0.0001));
    const sx = (k) => (k.wide ? 0.5 : narrow ? 0.5 : 0.66);
    const sy = (k) => (k.wide ? 0.5 : narrow ? 0.34 : 0.5);
    return { fx: lerp(a.fx, b.fx, t), fy: lerp(a.fy, b.fy, t), s: lerp(a.s, b.s, t), sx: lerp(sx(a), sx(b), t), sy: lerp(sy(a), sy(b), t) };
  }

  function apply(c) {
    const vw = stage.clientWidth, vh = stage.clientHeight;
    const W = world.offsetWidth, H = world.offsetHeight;
    const x0 = (vw - W) / 2, y0 = (vh - H) / 2;
    let tx = c.sx * vw - x0 - c.fx * W * c.s;
    let ty = c.sy * vh - y0 - c.fy * H * c.s;
    tx = Math.min(-x0, Math.max(vw - x0 - W * c.s, tx));
    ty = Math.min(-y0, Math.max(vh - y0 - H * c.s, ty));
    cam.style.transform = "translate3d(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px,0) scale(" + c.s.toFixed(4) + ")";
    cam.style.setProperty("--cam-s", c.s.toFixed(4));
  }

  function setActive(p) {
    let index = -1;
    STOPS.forEach((st, i) => { if (p >= st.at - 0.085) index = i; });
    if (index === active) return;
    active = index;
    pins.forEach((el, i) => el.classList.toggle("is-on", i === index));
    dots.forEach((el, i) => el.classList.toggle("is-on", i === index));
  }

  function frame() {
    raf = 0;
    const p = actP(act);
    const goal = target(p);
    if (!cur || reduce) cur = goal;
    else for (const k in goal) cur[k] = lerp(cur[k], goal[k], 0.12);
    apply(cur);
    setActive(p);
    const moving = Object.keys(goal).some((k) => Math.abs(cur[k] - goal[k]) > 0.0005);
    if (moving) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  function goTo(index) {
    const rect = act.getBoundingClientRect();
    const travel = act.offsetHeight - innerHeight;
    scrollTo({ top: scrollY + rect.top + travel * (STOPS[index].at + 0.005), behavior: reduce ? "auto" : "smooth" });
  }
  pins.concat(dots).forEach((el) => el.addEventListener("click", () => goTo(Number(el.dataset.stop))));

  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", () => { cur = null; kick(); });
  kick();
})();

// Rayos X: con la nave ya terminada, el cursor deja ver la estructura que la sostiene
(function xray() {
  const stage = document.querySelector(".build__stage");
  if (!stage || !finePointer || reduce) return;
  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    stage.style.setProperty("--lx", (e.clientX - r.left).toFixed(0) + "px");
    stage.style.setProperty("--ly", (e.clientY - r.top).toFixed(0) + "px");
  });
})();

// Con la nave terminada, el botón deja ver la estructura completa (también en pantallas táctiles)
(function xrayToggle() {
  const btn = document.querySelector(".xray-toggle");
  const stage = document.querySelector(".build__stage");
  if (!btn || !stage) return;
  btn.addEventListener("click", () => {
    const on = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", String(on));
    btn.textContent = on ? "Ver la nave terminada" : "Ver la estructura";
    stage.classList.toggle("is-xray", on);
  });
})();

// El formulario abre WhatsApp con el mensaje armado
const form = document.getElementById("form-contacto");
const status = form.querySelector(".form__status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  status.textContent = "";

  const required = [form.nombre, form.telefono];
  required.forEach((input) => input.setAttribute("aria-invalid", String(!input.value.trim())));
  const firstEmpty = required.find((input) => !input.value.trim());
  if (firstEmpty) {
    status.textContent = "Escribe tu nombre y tu teléfono para poder contactarte.";
    firstEmpty.focus();
    return;
  }

  if (!CONFIG.whatsapp) {
    status.textContent = "Falta configurar el número de WhatsApp de IMAX en script.js.";
    return;
  }

  const lines = [
    "Hola, soy " + form.nombre.value.trim() + (form.empresa.value.trim() ? " de " + form.empresa.value.trim() : "") + ".",
    "Me interesa: " + form.interes.value + ".",
    form.superficie.value.trim() && "Superficie aproximada: " + form.superficie.value.trim() + " m².",
    form.zona.value.trim() && "Zona: " + form.zona.value.trim() + ".",
    form.altura.value.trim() && "Altura libre: " + form.altura.value.trim() + " m.",
    form.andenes.value.trim() && "Andenes: " + form.andenes.value.trim() + ".",
    form.energia.value.trim() && "Energía: " + form.energia.value.trim() + " kVA.",
    form.fecha.value.trim() && "Fecha de ocupación: " + form.fecha.value.trim() + ".",
    form.mensaje.value.trim(),
    "Mi teléfono: " + form.telefono.value.trim(),
  ].filter(Boolean);

  window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
});

// Ficha técnica: pestañas por sistema (clic, flechas, inicio y fin)
(function spec() {
  const tabs = [...document.querySelectorAll(".spec__tabs [role='tab']")];
  const panels = [...document.querySelectorAll(".spec__panel")];
  if (!tabs.length) return;
  function select(index, focus) {
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach((panel, i) => panel.classList.toggle("is-on", i === index));
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));
    tab.addEventListener("keydown", (e) => {
      const move = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (move) { e.preventDefault(); select((i + move + tabs.length) % tabs.length, true); }
      if (e.key === "Home") { e.preventDefault(); select(0, true); }
      if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
    });
  });
  // Enlaces que abren una pestaña concreta, como el de las preguntas frecuentes
  document.querySelectorAll("a[data-spec]").forEach((a) => a.addEventListener("click", () => select(Number(a.dataset.spec))));
  select(0);
})();

// ------------------------------------------------------------------- Pie
// La página termina como empezó: el nombre es una ventana hacia la nave.
(function footWord() {
  const box = document.querySelector(".foot__word");
  if (!box) return;
  const video = box.querySelector("video");
  const canvas = box.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const font = (px) => "800 " + px + "px Archivo, system-ui, sans-serif";
  function setFont(px) {
    ctx.font = font(px);
    if ("fontStretch" in ctx) ctx.fontStretch = "expanded";
  }
  function draw() {
    const r = box.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--sc-canvas").trim() || "#0d1a26";
    ctx.fillRect(0, 0, r.width, r.height);
    setFont(100);
    const size = (100 * r.width * 0.95) / ctx.measureText("IMAX").width;
    setFont(size);
    const cap = ctx.measureText("IMAX").actualBoundingBoxAscent || size * 0.7;
    ctx.globalCompositeOperation = "destination-out";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#000";
    ctx.fillText("IMAX", r.width / 2, (r.height + cap) / 2);
  }
  draw();
  addEventListener("resize", draw);
  if (document.fonts) {
    document.fonts.load(font(100), "IMAX").then(draw).catch(() => {});
    document.fonts.ready.then(draw);
  }
  if (reduce) return;
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!video.src) video.src = innerWidth <= 860 ? video.dataset.srcMobile : video.dataset.src;
      video.play().catch(() => {});
    } else video.pause();
  }, { rootMargin: "300px 0px" }).observe(box);
})();
