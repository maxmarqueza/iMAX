// Mide la reproducción de los videos de De polvo a nave y Proceso: cuadros mostrados por segundo,
// cuadros perdidos y pausas por carga
import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: false, args: ["--autoplay-policy=no-user-gesture-required", "--window-position=-2400,0"] });
for (const [w, h, dpr, m] of [[1440, 900, 1, false], [1440, 900, 2, false], [390, 844, 3, true]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: m });
  await p.goto("http://localhost:4173/?solo=anatomia", { waitUntil: "load" });
  const r = await p.evaluate(() => new Promise((res) => {
    const v = document.querySelector("#anatomia video");
    let frames = 0, waits = 0, t0 = 0;
    v.addEventListener("waiting", () => waits++);
    const cb = (now) => { if (!t0) t0 = now; frames++; if (!v.ended) v.requestVideoFrameCallback(cb); };
    v.addEventListener("playing", () => { if (!t0) v.requestVideoFrameCallback(cb); }, { once: true });
    v.addEventListener("ended", () => {
      const q = v.getVideoPlaybackQuality ? v.getVideoPlaybackQuality() : {};
      res({ src: v.currentSrc.split("/").pop(), dur: +v.duration.toFixed(2), real: +((performance.now() - t0) / 1000).toFixed(2), fps: +(frames / ((performance.now() - t0) / 1000)).toFixed(1), perdidos: q.droppedVideoFrames, total: q.totalVideoFrames, pausas: waits });
    });
    setTimeout(() => res({ error: "no terminó", src: v.currentSrc, t: v.currentTime }), 30000);
  }));
  console.log(w, "dpr", dpr, JSON.stringify(r));
  await p.close();
}
await browser.close();
