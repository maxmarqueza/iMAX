import { chromium } from "playwright-core";
const url = process.argv[2] || "http://localhost:4173/?solo=anatomia";
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: false, args: ["--autoplay-policy=no-user-gesture-required"] });
for (const [w, h, dpr] of [[1380, 800, 2], [1380, 800, 1]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await p.goto(url, { waitUntil: "load" });
  await p.waitForTimeout(4000);
  const r = await p.evaluate(() => new Promise((res) => {
    const v = document.querySelector("#anatomia video");
    const raf = []; let last = 0, run = true; const vf = []; let lt = 0; const long = [];
    new PerformanceObserver((l) => l.getEntries().forEach((e) => long.push(Math.round(e.duration)))).observe({ type: "longtask" });
    const loop = (t) => { if (last) raf.push(t - last); last = t; if (run) requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    const cb = (now) => { if (lt) vf.push(now - lt); lt = now; if (!v.ended) v.requestVideoFrameCallback(cb); };
    v.requestVideoFrameCallback(cb);
    const st = (a) => { const s = [...a].sort((x, y) => x - y); return { n: a.length, mediana: +s[Math.floor(s.length / 2)].toFixed(1), p95: +s[Math.floor(s.length * .95)].toFixed(1), max: +s[s.length - 1].toFixed(1), sobre34: a.filter((x) => x > 34).length }; };
    v.addEventListener("ended", () => { run = false; const q = v.getVideoPlaybackQuality(); res({ src: v.currentSrc.split("/").pop(), raf: st(raf), video: st(vf), perdidos: q.droppedVideoFrames, total: q.totalVideoFrames, largas: long }); }, { once: true });
    document.querySelector("#anatomia .repetir").click();
    setTimeout(() => res({ error: "no terminó", t: v.currentTime }), 20000);
  }));
  console.log("dpr", dpr, JSON.stringify(r));
  await p.close();
}
await browser.close();
