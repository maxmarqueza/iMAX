// De polvo a nave: la etapa se escribe en el cielo con letras enormes, detrás de la sierra. Cada palabra sale por
//    detrás de las montañas y se hunde al terminar su etapa; las piezas que flotan la cruzan por delante
//    gracias a un mate de todo el video (media/cielo-mate.webp) y a la máscara del cielo.
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
})();
