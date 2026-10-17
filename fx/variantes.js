// Opciones de diseño por sección, solo para la vista previa (grupoimax.mx/opciones/secciones/).
// Cada sección lee su variante de <html data-v-*>; «a» (o sin atributo) es el sitio tal como está.
// Reglas: nada ligado al scroll, animación corta y automática al aparecer, todo a la vista y, al pasar
// el cursor, solo realce (se eleva y marco amarillo).
(function variantes() {
  const root = document.documentElement;
  const V = (k) => root.getAttribute("data-v-" + k) || "a";
  const A = FX.auto;
  const R = (a, b) => a + Math.random() * (b - a);
  const h = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

  // Caída de tarjetas, igual que en servicios
  function caer(slots, d0) {
    slots.forEach((s, i) => {
      if (FX.reduce) return;
      const rot = R(-9, 9), d = (d0 || 120) + i * 110;
      s.animate([
        { opacity: 0, transform: `translateY(-70vh) rotate(${rot}deg)` },
        { opacity: 1, transform: `translateY(0) rotate(${rot * 0.15}deg) scaleY(.96)`, offset: 0.62 },
        { transform: "translateY(-16px) rotate(0deg) scaleY(1.01)", offset: 0.8 },
        { opacity: 1, transform: "none" },
      ], { duration: 950, delay: d, easing: "cubic-bezier(.45,0,.55,1)", fill: "backwards" });
    });
  }
  // Subida escalonada, corta
  function subir(els, d0, step) {
    els.forEach((el, i) => {
      if (FX.reduce) return;
      el.animate([{ opacity: 0, transform: "translateY(22px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: (d0 || 0) + i * (step || 70), easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
    });
  }
  const alVer = (el, fn, r) => {
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold: r || 0.35 });
    io.observe(el);
  };
  // Cuadrícula de tarjetas con encabezado
  function rejilla(cls, items, card) {
    const grid = h("div", "vgrid " + cls);
    items.forEach((it, i) => { const slot = h("div", "vslot"); slot.appendChild(card(it, i)); grid.appendChild(slot); });
    return grid;
  }
  const cab = (titulo, texto) => h("div", "vhead", `<h2 class="hd-lg">${titulo}</h2>${texto ? `<p class="lede">${texto}</p>` : ""}`);

  // Barra de etapas tocable dentro de una escena con video
  function barra(act, items, videoEnd) {
    const v = act.querySelector("video[data-sc-scrub]");
    const nav = h("div", "vrail");
    nav.setAttribute("role", "group");
    nav.setAttribute("aria-label", "Etapas");
    const bs = items.map((it) => {
      const b = h("button", "", `<i></i><span>${it.t}</span>`);
      b.type = "button";
      b.addEventListener("click", () => {
        if (!v || !v.duration) return;
        v.currentTime = Math.min(v.duration - 0.05, (it.s / videoEnd) * v.duration + 0.02);
        v.play().catch(() => {});
      });
      nav.appendChild(b);
      return b;
    });
    (act.querySelector("[data-sc-stage]") || act).appendChild(nav);
    FX.loop(act, () => {
      const p = act.__auto || 0;
      let on = 0;
      items.forEach((it, i) => { if (p >= it.s - 0.001) on = i; });
      bs.forEach((b, i) => {
        const it = items[i], next = items[i + 1] ? items[i + 1].s : (videoEnd || 1);
        const k = FX.clamp01((p - it.s) / Math.max(next - it.s, 0.001));
        b.style.setProperty("--k", k.toFixed(3));
        b.classList.toggle("is-on", i === on);
      });
    });
  }

  // ---------------------------------------------------------------- De polvo a nave
  const anat = document.getElementById("anatomia");
  if (anat && V("anat") === "b") {
    root.classList.add("v-anat-b");
    barra(anat, [
      { t: "Terreno", s: 0 }, { t: "Terracerías", s: 0.085 }, { t: "Estructura", s: 0.205 },
      { t: "Piezas", s: 0.33 }, { t: "Montaje", s: 0.56 }, { t: "Entrega", s: 0.9 },
    ], 1);
  }
  if (anat && V("anat") === "c") {
    root.classList.add("v-anat-c");
    const E = [
      ["Terreno", "Un terreno nivelado y viento: así empieza."],
      ["Terracerías", "Despalme, cortes y rellenos compactados por capas hasta dejar la plataforma a nivel."],
      ["Estructura", "Zapatas, losa y patio de maniobras; las columnas de acero reciben las armaduras."],
      ["Piezas", "Cada pieza se fabrica a medida antes de montarse: lámina, largueros, armaduras y columnas."],
      ["Montaje", "Armaduras, largueros y muros cierran las cuatro fachadas; baja la cubierta engargolada."],
      ["Entrega", "Completa, probada y con su patio de maniobras, lista para operar."],
    ];
    const wrap = h("div", "vwrap");
    wrap.appendChild(cab("De polvo a nave", "Así se levanta una nave completa, de un terreno vacío a la entrega."));
    const grid = rejilla("vgrid--3", E, ([t, p], i) => h("div", "vcard", `<figure><img src="img/etapas/${i + 1}.webp" alt="${t}: etapa ${i + 1} de la construcción de una nave industrial" loading="lazy"><b class="vbadge">${String(i + 1).padStart(2, "0")}</b></figure><div class="vbody"><h3>${t}</h3><p>${p}</p></div>`));
    wrap.appendChild(grid);
    wrap.appendChild(h("p", "note", "Imágenes ilustrativas"));
    anat.appendChild(wrap);
    alVer(grid, () => { grid.classList.add("cayo"); caer([...grid.children]); });
  }


  // ---------------------------------------------------------------- Tomas reales de IMAX (sin etiqueta «ilustrativa»)
  // Cambia el video antes de que empiece a correr; portada.js y auto.js ya tienen sus eventos en el mismo <video>.
  function real(v, poster, name) {
    if (!v) return;
    const src = FX.videoSrc("media/" + name + ".mp4", "media/" + name + "-m.mp4", "media/" + name + "-4k.mp4");
    if (poster) poster.src = "img/" + name + "-poster.webp";
    if (!FX.reduce) { v.src = src; v.load(); }
  }
  const hero = document.getElementById("inicio");
  if (hero && V("hero") === "b") {
    root.classList.add("v-hero-b");
    real(hero.querySelector(".hero__video"), hero.querySelector(".hero__scene img"), "real-nave");
  }
  const proc = document.getElementById("proceso");
  if (proc && V("proc") === "b") {
    root.classList.add("v-proc-b");
    real(proc.querySelector("video[data-sc-scrub]"), proc.querySelector(".sc-stage__poster"), "real-obra");
  }
  const tour = document.getElementById("parque");
  if (tour && V("tour") === "b") {
    root.classList.add("v-tour-b");
    real(tour.querySelector(".tour__video"), tour.querySelector(".tour__poster"), "real-parque");
  }

  // ---------------------------------------------------------------- Contacto
  // B y C: formulario corto que empieza con cuatro tarjetas «¿Qué te interesa?» (caen al aparecer) y botón
  // grande de WhatsApp. C además cambia el dibujo a escala por la toma real de la nave en video.
  const form = document.getElementById("form-contacto");
  const vc = V("cont");
  if (form && (vc === "b" || vc === "c")) {
    root.classList.add("v-cont-" + vc);
    const sel = form.interes;
    const OP = [
      ["Rentar una nave", "Rentar", "nave.webp"],
      ["Comprar una nave", "Comprar", "nave-dorada.webp"],
      ["Construir una nave a la medida", "Construir a la medida", "obra.webp"],
      ["Desarrollar un parque industrial", "Parque industrial", "parque.webp"],
    ];
    const pick = h("fieldset", "vpick field--wide", "<legend>¿Qué te interesa?</legend>");
    const grid = h("div", "vpick__grid");
    const cards = OP.map(([val, t, img]) => {
      const slot = h("div", "vslot");
      const b = h("button", "vcard vpick__card", `<figure><img src="img/${img}" alt="" loading="lazy"></figure><span>${t}</span>`);
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => { sel.value = val; sync(); });
      b.dataset.val = val;
      slot.appendChild(b);
      grid.appendChild(slot);
      return b;
    });
    const sync = () => cards.forEach((b) => { const on = b.dataset.val === sel.value; b.classList.toggle("is-sel", on); b.setAttribute("aria-pressed", on); });
    sel.addEventListener("change", sync);
    document.querySelectorAll("[data-interes]").forEach((a) => a.addEventListener("click", () => setTimeout(sync)));
    sync();
    pick.appendChild(grid);
    pick.appendChild(h("p", "note", "Imágenes ilustrativas"));
    form.prepend(pick);
    alVer(grid, () => { grid.classList.add("cayo"); caer([...grid.children], 60); }, 0.3);

    // Botón grande de WhatsApp junto al título
    const intro = document.querySelector(".contact__intro");
    const wa = h("a", "vwa", `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1 .3-3.3-.7a11.4 11.4 0 0 1-4.4-3.9c-.3-.5-1.1-1.6-1.1-3s.7-2.2 1-2.5.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6a8 8 0 0 0 1.5 1.9 7.4 7.4 0 0 0 2.2 1.3c.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3s.1.7-.1 1.3Z"/></svg><span>Escríbenos por WhatsApp<b>33 1467 1188</b></span>`);
    wa.href = "https://wa.me/523314671188";
    wa.target = "_blank";
    wa.rel = "noopener";
    intro.querySelector(".lede").after(wa);
    intro.querySelector(".lede").textContent = "Dinos qué buscas y en qué zona; te contestamos por WhatsApp.";
    form.querySelector("button[type=submit]").textContent = "Enviar mensaje";

    if (vc === "c") {
      const fig = h("figure", "vcont-video", `<video muted loop playsinline preload="none" poster="img/real-nave-poster.webp" aria-hidden="true"></video>`);
      intro.querySelector(".escala").replaceWith(fig);
      const v = fig.querySelector("video");
      alVer(fig, () => {
        if (FX.reduce) return;
        v.src = FX.videoSrc("media/real-nave.mp4", "media/real-nave-m.mp4", "media/real-nave-4k.mp4");
        v.play().catch(() => {});
      }, 0.2);
    }
  }

})();
