// Inicio de cada escena en pantallas táctiles. El scroll es libre y continuo, como en la web (el recorrido
// extra de cada escena lo da fx/core.js); solo cuando el dedo suelta cerca del arranque de una escena, el
// navegador la acomoda completa para no quedar a medio relevo (scroll-snap de cercanía, nativo).
(function pasos() {
  if (!FX.coarse) return;
  const root = document.documentElement;
  const U = CSS.supports("height: 1lvh") ? "lvh" : "vh";

  // Arranque de cada escena fija (avance 0)
  const MAPA = { inicio: [0], servicios: [0], anatomia: [0], parque: [0], proceso: [0] };

  // Las marcas van en unidades de pantalla grande para no moverse cuando el navegador esconde su barra
  // (si se movieran, Safari volvería a ajustar y la página brincaría sola). Se reusan las que ya existen.
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

  function todo() {
    for (const [id, ps] of Object.entries(MAPA)) {
      const act = document.getElementById(id);
      if (act) marcar(act, enActo(act, ps));
    }
    // Ficha y contacto: su inicio
    for (const id of ["ficha", "contacto"]) {
      const s = document.getElementById(id);
      if (s) marcar(s, ["0px"]);
    }
    // Salida: la escena del pie
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
