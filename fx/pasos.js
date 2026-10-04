// Pasos de la historia en pantallas táctiles. Con el dedo, un solo deslizón con inercia cruzaba varias
// escenas de golpe y la historia se perdía. Cada escena marca sus momentos y el navegador se detiene en
// el siguiente (scroll-snap nativo, sin tomar el control del scroll). El texto corrido sigue libre.
(function pasos() {
  if (!FX.coarse) return;
  const root = document.documentElement;
  const U = CSS.supports("height: 1lvh") ? "lvh" : "vh";

  // Avance del acto (0 a 1) donde cada paso ya se lee completo; salen de los data-sc-cue de cada escena
  const MAPA = {
    inicio: [0, 0.9],
    anatomia: [0, 0.145, 0.27, 0.4, 0.52, 0.66, 0.825, 0.97],
    parque: [0, 0.2, 0.365, 0.525, 0.685, 0.86],
    proceso: [0, 0.14, 0.232, 0.38, 0.58, 0.73, 0.93],
  };

  // Las marcas van en unidades de pantalla grande para no moverse cuando el navegador esconde su barra
  // (si se movieran, Safari volvería a ajustar y la página brincaría sola). Se reusan las que ya existen:
  // si en algún momento faltaran, el ajuste obligatorio mandaría la página al único alto que quedara.
  function marcar(box, tops) {
    const old = [...box.querySelectorAll(":scope > .paso")];
    tops.forEach((top, i) => {
      let m = old[i];
      if (!m) {
        m = document.createElement("i");
        m.className = "paso";
        m.setAttribute("aria-hidden", "true");
        box.appendChild(m);
      }
      m.style.top = top;
    });
    old.slice(tops.length).forEach((m) => m.remove());
  }
  const enActo = (act, ps) => {
    const span = parseFloat(act.dataset.scSpan) || 1.5;
    return ps.map((p) => `${(p * (span - 1) * 100).toFixed(3)}${U}`);
  };

  // Servicios: un paso por tarjeta y otro por la nota final, cada uno al centro de la pantalla
  // (misma fórmula del motor para el riel)
  function riel() {
    const act = document.getElementById("servicios");
    const rail = act && act.querySelector("[data-sc-pan]");
    if (!rail) return null;
    const extra = parseFloat(rail.getAttribute("data-sc-pan")) || 0;
    const vw = innerWidth, over = rail.scrollWidth - vw;
    if (over <= 0) return [act, [0]];
    const travel = over * (1 + extra);
    const left0 = rail.getBoundingClientRect().left - new DOMMatrix(getComputedStyle(rail).transform).m41;
    const ps = [0];
    act.querySelectorAll(".svc__item, .svc__note").forEach((it) => {
      const c = left0 + it.offsetLeft + it.offsetWidth / 2;
      ps.push(Math.min(1, Math.max(0, (c - vw / 2) / travel)));
    });
    return [act, ps.filter((p, i) => i === 0 || p - ps[i - 1] > 0.04)];
  }

  function todo() {
    // Primero se mide (el riel) y luego se escribe, sin medir en medio
    const r = riel();
    for (const [id, ps] of Object.entries(MAPA)) {
      const act = document.getElementById(id);
      if (act) marcar(act, enActo(act, ps));
    }
    if (r) marcar(r[0], enActo(r[0], r[1]));
    // Ficha y contacto: un alto al empezar; adentro se lee libre
    for (const id of ["ficha", "contacto"]) {
      const s = document.getElementById(id);
      if (s) marcar(s, ["0px"]);
    }
    // Salida: un alto al entrar a la escena del pie
    const pie = document.querySelector(".foot__scene");
    if (pie) marcar(pie, ["0px"]);
  }

  // Con el dedo el riel avanza con el scroll de la página; ya no se arrastra de lado
  const hint = document.querySelector(".svc__hint");
  if (hint) hint.textContent = "Desliza";

  // Solo cambia con el ancho (girar el teléfono); los cambios de alto son la barra del navegador
  let ancho = innerWidth;
  addEventListener("resize", () => { if (innerWidth !== ancho) { ancho = innerWidth; todo(); } });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(todo);
  todo();
  // El ajuste se enciende ya con todas las marcas puestas
  root.classList.add("con-pasos");
})();
