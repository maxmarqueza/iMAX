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

  // ---------------------------------------------------------------- Portada: entrada del cielo, las naves y el texto
  // ?v=entra-a|b|c. La foto se parte en capas con máscaras (img/entrada/): cielo, calle y naves. Detrás va un fondo sin
  // naves (hecho con IA) que solo se asoma mientras las naves se mueven. Al terminar se quitan las capas y queda la foto tal cual.
  // A: dentro de las letras IMAX, el cielo cae y las naves suben; después de la M, el título cae palabra por palabra.
  // B: después de la M, el cielo se enciende, las naves se levantan del suelo y el título sube palabra por palabra.
  // C: después de la M, cae el cielo, las naves caen y rebotan sobre la calle, y el título cae letra por letra.
  const ve = root.getAttribute("data-v-entra");
  if (hero && ve && !FX.reduce) {
    const cel = matchMedia("(max-width: 860px)").matches, k = cel ? "cel" : "pc";
    const scene = hero.querySelector(".hero__scene"), stage = hero.querySelector(".hero__stage");
    const foto = scene.querySelector("img");
    const src = cel ? "img/portada-celular.webp" : "img/portada-parque.webp";
    const capa = (tag, cls, m) => {
      const n = document.createElement(tag);
      n.className = "ent " + cls;
      if (tag === "img") { n.src = src; n.alt = ""; }
      // Ruta completa: un url() relativo dentro de una variable se resolvería desde fx/ y no cargaría
      if (m) n.style.setProperty("--m", `url("${new URL(`img/entrada/${k}-${m}.png`, location.href).href}")`);
      return n;
    };
    const fondo = capa("img", "ent-fondo"); fondo.src = `img/entrada/fondo-${k}.webp`;
    // Cielo: la foto con las naves borradas (el hueco se rellenó con el fondo de IA), recortada arriba del suelo
    const cielo = capa("img", "ent-cielo", "suelo"); cielo.src = `img/entrada/sinnaves-${k}.webp`;
    const calle = capa("img", "ent-calle", "calle");
    const suelo = capa("div", "ent-suelo", "suelo");
    const naves = capa("img", "ent-naves", "naves");
    suelo.appendChild(naves);
    scene.prepend(fondo);
    scene.append(cielo, calle, suelo);
    root.classList.add("v-entra");

    const words = () => [...hero.querySelectorAll(".hero__say p .w")];
    const bounce = (from) => [
      { transform: from, offset: 0 },
      { transform: "translate3d(0,0,0) scaleY(.97)", offset: 0.62 },
      { transform: "translate3d(0,-2.5%,0) scaleY(1.01)", offset: 0.8 },
      { transform: "none", offset: 1 },
    ];
    const run = (el, frames, ms, delay, easing) => el.animate(frames, { duration: ms, delay: delay || 0, easing: easing || "cubic-bezier(.22,1,.36,1)", fill: "both" });
    // Estado inicial de cada opción (antes de que se vea nada)
    const start = {
      a: () => { cielo.style.transform = "translate3d(0,-38%,0)"; naves.style.transform = "translate3d(0,60%,0)"; },
      b: () => { cielo.style.filter = fondo.style.filter = "brightness(.4) saturate(.5)"; naves.style.transform = "translate3d(0,70%,0)"; },
      c: () => { cielo.style.transform = "translate3d(0,-45%,0)"; naves.style.transform = "translate3d(0,-140%,0)"; },
    }[ve] || (() => {});
    start();
    // El título espera escondido hasta que le toca entrar
    words().forEach((w) => { w.style.opacity = "0"; });
    // Cuando la cámara ya pasó la M (fx/portada.js marca .is-dentro)
    const dentro = (fn) => {
      const t0 = performance.now();
      const look = () => (stage.classList.contains("is-dentro") || performance.now() - t0 > 4000 ? fn() : requestAnimationFrame(look));
      requestAnimationFrame(look);
    };
    const texto = (modo, delay) => {
      const ws = words();
      ws.forEach((w) => { w.style.opacity = "0"; });
      const anims = [];
      if (modo === "letras") {
        let i = 0;
        ws.forEach((w) => {
          w.style.opacity = "";
          const t = w.textContent;
          w.innerHTML = [...t].map((ch) => `<span class="ent-l">${ch}</span>`).join("");
          w.querySelectorAll(".ent-l").forEach((l) => {
            const r = R(-14, 14);
            anims.push(run(l, [
              { opacity: 0, transform: `translate3d(0,-2.2em,0) rotate(${r}deg)` },
              { opacity: 1, transform: `translate3d(0,0,0) rotate(${r * 0.2}deg) scaleY(.92)`, offset: 0.6 },
              { transform: "translate3d(0,-.18em,0) scaleY(1.02)", offset: 0.8 },
              { opacity: 1, transform: "none" },
            ], 700, delay + i++ * 28, "cubic-bezier(.45,0,.55,1)"));
          });
        });
      } else {
        ws.forEach((w, i) => {
          const r = R(-9, 9);
          const desde = modo === "sube" ? "translate3d(0,1.1em,0)" : `translate3d(0,-1.6em,0) rotate(${r}deg)`;
          anims.push(run(w, [
            { opacity: 0, transform: desde },
            { opacity: 1, transform: `translate3d(0,0,0) rotate(${modo === "sube" ? 0 : r * 0.15}deg) scaleY(.94)`, offset: 0.62 },
            { transform: "translate3d(0,-.12em,0) scaleY(1.02)", offset: 0.8 },
            { opacity: 1, transform: "none" },
          ], 820, delay + i * 90, "cubic-bezier(.45,0,.55,1)"));
          w.style.opacity = "";
        });
      }
      return anims;
    };
    // Al terminar, la foto original vuelve a quedar sola
    const limpiar = (anims) => Promise.all(anims.map((a) => a.finished)).then(() => {
      root.classList.remove("v-entra");
      [fondo, cielo, calle, suelo].forEach((n) => n.remove());
    });
    const fondoListo = Promise.all([fondo, cielo].map((im) => (im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; }))));
    fondoListo.then(() => {
      const anims = [];
      if (ve === "a") {
        cielo.style.transform = naves.style.transform = "";
        anims.push(run(cielo, [{ transform: "translate3d(0,-38%,0)" }, { transform: "none" }], 900, 150, "cubic-bezier(.3,1.15,.5,1)"));
        anims.push(run(naves, bounce("translate3d(0,60%,0)"), 950, 450, "cubic-bezier(.45,0,.55,1)"));
        dentro(() => {
          texto("cae", 250).forEach((a) => anims.push(a));
          limpiar(anims);
        });
      } else if (ve === "b") {
        dentro(() => {
          cielo.style.filter = fondo.style.filter = naves.style.transform = "";
          [cielo, fondo].forEach((n) => anims.push(run(n, [{ filter: "brightness(.4) saturate(.5)" }, { filter: "brightness(1) saturate(1)" }], 1200, 0, "ease-out")));
          anims.push(run(naves, bounce("translate3d(0,70%,0)"), 1000, 150, "cubic-bezier(.45,0,.55,1)"));
          texto("sube", 650).forEach((a) => anims.push(a));
          limpiar(anims);
        });
      } else if (ve === "c") {
        dentro(() => {
          cielo.style.transform = naves.style.transform = "";
          anims.push(run(cielo, [{ transform: "translate3d(0,-45%,0)" }, { transform: "none" }], 750, 0, "cubic-bezier(.3,1.1,.5,1)"));
          anims.push(run(naves, bounce("translate3d(0,-140%,0)"), 950, 200, "cubic-bezier(.45,0,.55,1)"));
          texto("letras", 750).forEach((a) => anims.push(a));
          limpiar(anims);
        });
      }
    });
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


  // ---------------------------------------------------------------- Nuestros trabajos (solo material real de IMAX)
  // A: el video corto de cortes rápidos a todo lo ancho. B: muro de 8 tomas que corren solas.
  // C: pantalla grande que va pasando las tomas y, debajo, las 8 tarjetas para elegir una.
  const vt = V("trab");
  const main = document.getElementById("contenido");
  if (main && (vt === "a" || vt === "b" || vt === "c")) {
    root.classList.add("v-trab-" + vt);
    const T = [
      ["terreno", "Terreno"], ["estructura", "Estructura de acero"], ["colado", "Colado de piso"],
      ["bomba", "Bombeo de concreto"], ["obra-frente", "Naves en obra"], ["nave", "Nave terminada"],
      ["calle", "Parque en operación"], ["escalera", "Oficinas y mezzanine"],
    ];
    const src = (n) => FX.videoSrc("media/trabajos/" + n + ".mp4", "media/trabajos/" + n + "-m.mp4");
    // Cada video corre solo mientras se ve
    const enVista = (v, load) => {
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { if (!v.src) v.src = load(); v.play().catch(() => {}); } else v.pause();
      }), { threshold: 0.25 });
      io.observe(v);
    };
    const sec = h("section", "trab", "");
    sec.id = "trabajos";
    const head = `<h2 class="hd-lg">Nuestros trabajos</h2><p class="lede">Tomas de nuestras obras: del terreno a la nave terminada.</p>`;

    if (vt === "a") {
      sec.classList.add("trab--a");
      sec.innerHTML = `<div class="trab__stage"><img src="img/trabajos/reel.webp" alt=""><video muted loop playsinline preload="none" aria-hidden="true"></video><div class="trab__shade" aria-hidden="true"></div><div class="trab__copy">${head}</div></div>`;
      const v = sec.querySelector("video");
      if (!FX.reduce) enVista(v, () => FX.videoSrc("media/trabajos/reel.mp4", "media/trabajos/reel-m.mp4"));
      v.addEventListener("playing", () => v.classList.add("is-on"), { once: true });
    }

    if (vt === "b") {
      sec.innerHTML = `<div class="vwrap"><div class="vhead">${head}</div></div>`;
      const grid = rejilla("vgrid--4", T, ([n, t]) => h("div", "vcard trab__card", `<figure><img src="img/trabajos/${n}.webp" alt="${t}" loading="lazy"><video muted loop playsinline preload="none" aria-hidden="true"></video></figure><div class="vbody"><h3>${t}</h3></div>`));
      sec.querySelector(".vwrap").appendChild(grid);
      if (!FX.reduce) grid.querySelectorAll("video").forEach((v, i) => {
        enVista(v, () => FX.videoSrc("media/trabajos/" + T[i][0] + "-m.mp4", "media/trabajos/" + T[i][0] + "-m.mp4"));
        v.addEventListener("playing", () => v.classList.add("is-on"), { once: true });
      });
      alVer(grid, () => { grid.classList.add("cayo"); caer([...grid.children]); }, 0.2);
    }

    if (vt === "c") {
      sec.innerHTML = `<div class="vwrap"><div class="vhead">${head}</div><div class="trab__screen"><img src="img/trabajos/${T[0][0]}.webp" alt=""><video muted playsinline preload="none" aria-hidden="true"></video><b class="trab__label">${T[0][1]}</b></div></div>`;
      const wrap = sec.querySelector(".vwrap");
      const v = sec.querySelector(".trab__screen video");
      const label = sec.querySelector(".trab__label");
      const poster = sec.querySelector(".trab__screen img");
      let cur = 0, started = false;
      const grid = rejilla("vgrid--4", T, ([n, t], i) => {
        const b = h("button", "vcard trab__pick", `<figure><img src="img/trabajos/${n}.webp" alt="" loading="lazy"><i></i></figure><div class="vbody"><h3>${t}</h3></div>`);
        b.type = "button";
        b.addEventListener("click", () => show(i));
        return b;
      });
      wrap.appendChild(grid);
      const cards = [...grid.querySelectorAll(".trab__pick")];
      function show(i) {
        cur = i;
        cards.forEach((c, k) => c.classList.toggle("is-sel", k === i));
        label.textContent = T[i][1];
        poster.src = "img/trabajos/" + T[i][0] + ".webp";
        if (FX.reduce) return;
        v.src = src(T[i][0]);
        v.play().catch(() => {});
      }
      v.addEventListener("ended", () => show((cur + 1) % T.length));
      v.addEventListener("playing", () => v.classList.add("is-on"));
      v.addEventListener("timeupdate", () => { if (v.duration) cards[cur].style.setProperty("--k", (v.currentTime / v.duration).toFixed(3)); });
      cards[0].classList.add("is-sel");
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { if (!started) { started = true; show(0); } else v.play().catch(() => {}); } else v.pause();
      }), { threshold: 0.3 });
      io.observe(sec.querySelector(".trab__screen"));
      alVer(grid, () => { grid.classList.add("cayo"); caer([...grid.children]); }, 0.2);
    }
    main.insertBefore(sec, document.getElementById("contacto"));
  }

})();
