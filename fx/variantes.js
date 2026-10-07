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

  // ---------------------------------------------------------------- Proceso
  const build = document.getElementById("proceso");
  const PASOS = [
    ["Terreno y factibilidad", "Uso de suelo, mecánica de suelos, topografía y factibilidades de agua, drenaje y energía.", 0],
    ["Proyecto e ingeniería", "Proyecto arquitectónico, estructural y de instalaciones a partir de tu operación.", 0.115],
    ["Permisos", "Uso de suelo, impacto ambiental y vial, Protección Civil y licencia de construcción.", 0.235],
    ["Obra", "Terracerías, cimentación, estructura, cubierta, muros, piso, instalaciones y urbanización.", 0.345],
    ["Entrega", "Pruebas, terminación de obra y entrega lista para instalar equipo y operar.", 0.845],
  ];
  if (build && V("proceso") === "b") {
    root.classList.add("v-proceso-b");
    barra(build, PASOS.map(([t, , s]) => ({ t, s })), 0.8);
  }
  if (build && V("proceso") === "c") {
    root.classList.add("v-proceso-c");
    build.querySelector(".build__stage").appendChild(h("div", "vtitulo", '<h2 class="hd-lg">De un terreno vacío a una nave operando</h2><p class="lede">Cinco pasos, una sola empresa responsable de todos.</p>'));
    const wrap = h("div", "vwrap vwrap--dark");
    const grid = rejilla("vgrid--5", PASOS, ([t, p], i) => h("div", "vcard vcard--dark", `<div class="vbody"><b class="vnum">${String(i + 1).padStart(2, "0")}</b><h3>${t}</h3><p>${p}</p></div>`));
    wrap.appendChild(grid);
    build.appendChild(wrap);
    alVer(grid, () => { grid.classList.add("cayo"); caer([...grid.children]); });
  }

  // ---------------------------------------------------------------- Preguntas
  const faq = document.querySelector(".faq__list");
  if (faq && V("faq") === "a") {
    root.classList.add("v-faq-a");
    alVer(faq, () => subir([...faq.querySelectorAll("details")], 0, 60), 0.15);
  }
  if (faq && V("faq") === "b") {
    root.classList.add("v-faq-b");
    const ds = [...faq.querySelectorAll("details")];
    ds.forEach((d) => { d.removeAttribute("open"); const s = h("div", "vslot"); d.before(s); s.appendChild(d); });
    alVer(faq, () => { faq.classList.add("cayo"); caer([...faq.children], 80); }, 0.15);
  }
})();
