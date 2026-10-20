// Portada en celular: después de pasar por la M, las naves se construyen en video (time-lapse de 4 s, Seedance 2.5,
// media/obra-m.mp4). Las letras IMAX muestran el terreno vacío (cartel del video). El video se corta a los 3.2 s, antes
// de que la nave quede terminada, y se funde con la foto 4K: la nave terminada se ve una sola vez. El título empieza a
// caer palabra por palabra en el segundo 2 y todo queda listo antes del 4. En computadora no cambia nada.
(function obra() {
  const hero = document.getElementById("inicio");
  if (!hero || FX.reduce || !matchMedia("(max-width: 860px)").matches) return;
  const root = document.documentElement;
  const scene = hero.querySelector(".hero__scene"), stage = hero.querySelector(".hero__stage");
  const CORTE = 3.2, FUNDIDO = 550, TEXTO = 2;
  const v = document.createElement("video");
  v.className = "obra-video"; v.muted = true; v.playsInline = true; v.preload = "auto";
  v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
  v.poster = "img/obra-m-poster.webp"; v.src = "media/obra-m.mp4";
  scene.append(v);
  root.classList.add("con-obra");
  const words = () => [...hero.querySelectorAll(".hero__say p .w")];
  words().forEach((w) => { w.style.opacity = "0"; });
  FX.espera.push(new Promise((r) => { if (v.readyState >= 3) r(); v.addEventListener("canplaythrough", r, { once: true }); v.addEventListener("error", r, { once: true }); }));

  const R = (a, b) => a + Math.random() * (b - a);
  let titulo = false, fin = false;
  const caeTitulo = () => {
    titulo = true;
    words().forEach((w, i) => {
      const r = R(-9, 9);
      w.style.opacity = "";
      w.animate([
        { opacity: 0, transform: `translate3d(0,-1.6em,0) rotate(${r}deg)` },
        { opacity: 1, transform: `translate3d(0,0,0) rotate(${r * 0.15}deg) scaleY(.94)`, offset: 0.62 },
        { transform: "translate3d(0,-.12em,0) scaleY(1.02)", offset: 0.8 },
        { opacity: 1, transform: "none" },
      ], { duration: 820, delay: i * 90, easing: "cubic-bezier(.45,0,.55,1)", fill: "both" });
    });
  };
  const final = () => {
    fin = true;
    v.pause();
    v.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FUNDIDO, easing: "ease-out", fill: "forwards" }).finished.then(() => {
      v.remove();
      root.classList.remove("con-obra");
    });
  };
  const vigila = () => {
    if (!titulo && v.currentTime >= TEXTO) caeTitulo();
    if (!fin && (v.currentTime >= CORTE || v.ended)) final();
    if (!fin) requestAnimationFrame(vigila);
  };
  const correr = () => {
    const p = v.play();
    if (p) p.catch(() => { caeTitulo(); final(); }); // si el teléfono no deja reproducir, queda la foto con el título
    requestAnimationFrame(vigila);
  };
  // Arranca cuando la cámara ya pasó la M (fx/portada.js marca .is-dentro)
  FX.portadaLista.then(() => {
    const t0 = performance.now();
    const look = () => (stage.classList.contains("is-dentro") || performance.now() - t0 > 6000 ? correr() : requestAnimationFrame(look));
    requestAnimationFrame(look);
  });
})();
