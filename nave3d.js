// La nave desarmada que se arma con el scroll.
// Modelo en Three.js: cada pieza tiene su posición final y un desplazamiento de
// "despiece"; el avance del acto las lleva de una a otra, en orden de obra.
// Three.js se carga solo cuando el acto está por entrar en pantalla.
let THREE;

const act = document.querySelector(".anat");
const stage = act && act.querySelector(".anat__stage");
const host = act && act.querySelector(".anat__canvas");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp01 = (n) => Math.min(1, Math.max(0, n));
const smooth = (n) => { n = clamp01(n); return n * n * (3 - 2 * n); };
const easeInOut = (n) => { n = clamp01(n); return n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2; };
const lerp = (a, b, t) => a + (b - a) * t;

// Fases del armado, en avance del modelo (0 a 1). Coinciden con la lista del acto.
const PHASES = [[0, 0.12], [0.1, 0.42], [0.4, 0.6], [0.56, 0.74], [0.7, 0.86], [0.76, 0.9]];

function progress() {
  const r = act.getBoundingClientRect();
  return clamp01(-r.top / Math.max(r.height - innerHeight, 1));
}

function ribTexture(light, dark, anisotropy) {
  const c = document.createElement("canvas");
  c.width = 64; c.height = 8;
  const g = c.getContext("2d");
  g.fillStyle = light; g.fillRect(0, 0, 64, 8);
  g.fillStyle = dark; g.fillRect(0, 0, 9, 8);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  return tex;
}

function build() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0d1a26, 430, 980);
  const camera = new THREE.PerspectiveCamera(28, 1, 1, 1400);

  // Luz
  const hemi = new THREE.HemisphereLight(0xc9dcf0, 0x0c1722, 1.25);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff0dc, 3.1);
  key.position.set(-70, 130, 110);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -120; key.shadow.camera.right = 120;
  key.shadow.camera.top = 110; key.shadow.camera.bottom = -110;
  key.shadow.camera.near = 20; key.shadow.camera.far = 420;
  key.shadow.bias = -0.0005; key.shadow.normalBias = 0.6;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6ea4e8, 1.1);
  rim.position.set(90, 50, -120);
  scene.add(rim);

  // Materiales
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const M = {
    yard: new THREE.MeshStandardMaterial({ color: 0x16242f, roughness: 0.95 }),
    slab: new THREE.MeshStandardMaterial({ color: 0xa9b6bf, roughness: 0.88 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xeef2f5, roughness: 0.5, metalness: 0.25 }),
    roof: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.48, metalness: 0.35, map: ribTexture("#ccd6dd", "#aab7c1", aniso) }),
    sky: new THREE.MeshStandardMaterial({ color: 0xe9f5ff, roughness: 0.25, emissive: 0x9cc8ee, emissiveIntensity: 0.25 }),
    wall: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62, metalness: 0.2, map: ribTexture("#2f5273", "#274662", aniso) }),
    door: new THREE.MeshStandardMaterial({ color: 0xf0f3f5, roughness: 0.6 }),
    accent: new THREE.MeshStandardMaterial({ color: 0xf6b93b, roughness: 0.55 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x7fb4dc, roughness: 0.12, metalness: 0.55, transparent: true, opacity: 0.9, emissive: 0xffc56a, emissiveIntensity: 0 }),
    lamp: new THREE.MeshStandardMaterial({ color: 0x38424a, emissive: 0xffc35c, emissiveIntensity: 0 }),
    trailer: new THREE.MeshStandardMaterial({ color: 0xf3f5f6, roughness: 0.55 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x1a232b, roughness: 0.8 }),
    cab: new THREE.MeshStandardMaterial({ color: 0x2f5273, roughness: 0.45, metalness: 0.3 }),
    edge: new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }),
  };
  M.roof.map.repeat.set(26, 1);
  M.wall.map.repeat.set(30, 1);

  // Medidas (metros): 8 crujías de 12 m, 36 m de claro libre
  const L = 96, D = 36, HE = 10, HR = 12.2, BAY = 12, NB = 8;
  const slope = Math.atan((HR - HE) / (D / 2));
  const rafter = Math.hypot(D / 2, HR - HE);

  // Base: patio de maniobras y cuadrícula de terreno
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), new THREE.ShadowMaterial({ opacity: 0.32 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(720, 30, 0x3a5f80, 0x2a4a66);
  grid.material.transparent = true; grid.material.opacity = 0.16; grid.position.y = 0.02;
  scene.add(grid);
  const yard = new THREE.Mesh(new THREE.BoxGeometry(L + 34, 0.3, 62), M.yard);
  yard.position.set(0, 0.15, D / 2 + 31); yard.receiveShadow = true;
  scene.add(yard);

  // El edificio se apoya a la altura del andén (1.2 m)
  const nave = new THREE.Group();
  nave.position.y = 1.2;
  scene.add(nave);

  const parts = [];
  function add(obj, off, rot, t0, t1, parent) {
    obj.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    obj.userData.fly = { home: obj.position.clone(), turn: obj.rotation.clone(), off: new THREE.Vector3(...off), rot: new THREE.Vector3(...rot), t0, t1 };
    (parent || nave).add(obj);
    parts.push(obj);
    return obj;
  }
  const box = (w, h, d, mat) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  const edged = (mesh) => { mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), M.edge)); return mesh; };

  // 0. Piso
  const slab = edged(box(L + 1.4, 1.2, D + 1.4, M.slab));
  slab.position.y = -0.6;
  add(slab, [0, -8, 0], [0, 0, 0], 0, 0.12);

  // 1. Estructura: marcos de claro libre, vigas de alero y largueros
  for (let i = 0; i <= NB; i++) {
    const frame = new THREE.Group();
    frame.position.x = -L / 2 + i * BAY;
    [-1, 1].forEach((s) => {
      const col = box(0.55, HE, 0.55, M.steel);
      col.position.set(0, HE / 2, s * (D / 2));
      frame.add(col);
      const raf = box(0.45, 0.75, rafter + 0.3, M.steel);
      raf.position.set(0, (HE + HR) / 2, s * (D / 4));
      raf.rotation.x = s * slope;
      frame.add(raf);
    });
    add(frame, [(i - NB / 2) * 6, 17, 0], [0, 0, 0], 0.1 + i * 0.02, 0.25 + i * 0.02);
  }
  [-1, 1].forEach((s) => {
    const eave = box(L, 0.4, 0.4, M.steel);
    eave.position.set(0, HE - 0.2, s * (D / 2));
    add(eave, [0, 27, s * 9], [0, 0, 0], 0.28, 0.4);
    for (let k = 1; k <= 5; k++) {
      const z = (D / 2) * (k / 6);
      const purlin = box(L + 0.8, 0.26, 0.26, M.steel);
      purlin.position.set(0, HE + (HR - HE) * (1 - z / (D / 2)) + 0.5, s * z);
      add(purlin, [0, 29 + k * 1.3, s * (4 + k * 2)], [0, 0, 0], 0.29 + k * 0.012, 0.41 + k * 0.012);
    }
  });

  // 2. Cubierta: una lámina por crujía y por agua, con tragaluz en crujías alternas
  for (let i = 0; i < NB; i++) {
    [1, -1].forEach((s) => {
      const panel = edged(box(BAY - 0.12, 0.2, rafter + 0.5, M.roof));
      panel.position.set(-L / 2 + BAY / 2 + i * BAY, (HE + HR) / 2 + 0.82, s * (D / 4));
      panel.rotation.x = s * slope;
      if (i % 2 === 1) {
        const light = box(1.5, 0.08, rafter - 5, M.sky);
        light.position.y = 0.13;
        panel.add(light);
      }
      const t0 = 0.4 + i * 0.014 + (s < 0 ? 0.012 : 0);
      add(panel, [(i - 3.5) * 5, 41 + ((i + (s > 0 ? 0 : 1)) % 2) * 4.5, s * 10], [s * 0.22, 0, (i - 3.5) * 0.035], t0, t0 + 0.15);
    });
  }

  // 3. Muros: paneles por crujía al frente y al fondo, y dos hastiales
  for (let i = 0; i < NB; i++) {
    const x = -L / 2 + BAY / 2 + i * BAY;
    const front = edged(box(BAY - 0.1, HE, 0.3, M.wall));
    front.position.set(x, HE / 2, D / 2 + 0.3);
    add(front, [(i - 3.5) * 3, 5, 31], [0.34, 0, 0], 0.56 + i * 0.012, 0.69 + i * 0.012);
    const back = edged(box(BAY - 0.1, HE, 0.3, M.wall));
    back.position.set(x, HE / 2, -D / 2 - 0.3);
    add(back, [(i - 3.5) * 3, 5, -31], [-0.34, 0, 0], 0.57 + i * 0.012, 0.7 + i * 0.012);
  }
  const gableShape = new THREE.Shape();
  gableShape.moveTo(-D / 2 - 0.45, 0); gableShape.lineTo(D / 2 + 0.45, 0); gableShape.lineTo(D / 2 + 0.45, HE);
  gableShape.lineTo(0, HR + 0.1); gableShape.lineTo(-D / 2 - 0.45, HE); gableShape.closePath();
  const gableMat = new THREE.MeshStandardMaterial({ color: 0x2b4c6b, roughness: 0.62, metalness: 0.2 });
  [-1, 1].forEach((s) => {
    const gable = edged(new THREE.Mesh(new THREE.ExtrudeGeometry(gableShape, { depth: 0.3, bevelEnabled: false }), gableMat));
    gable.rotation.y = Math.PI / 2;
    gable.position.set(s * (L / 2 + 0.3) - 0.15, 0, 0);
    // El hastial izquierdo sube en vez de abrirse, para no invadir la columna de texto
    add(gable, s < 0 ? [-10, 30, 0] : [34, 5, 0], [0, s < 0 ? 0 : 0.3, 0], 0.6, 0.74);
  });

  // 4. Andenes: puertas seccionales, lámparas y marquesina
  const lamps = [];
  const doorXs = [];
  let n = 0;
  for (let i = 1; i < NB; i++) {
    [-3, 3].forEach((dx) => {
      const x = -L / 2 + BAY / 2 + i * BAY + dx;
      doorXs.push(x);
      const door = new THREE.Group();
      door.position.set(x, 1.75, D / 2 + 0.55);
      door.add(box(3.7, 3.9, 0.14, M.accent));
      const leaf = box(3.1, 3.4, 0.2, M.door);
      leaf.position.set(0, -0.1, 0.06);
      door.add(leaf);
      const lamp = box(0.7, 0.28, 0.4, M.lamp);
      lamp.position.set(0, 2.55, 0.25);
      door.add(lamp);
      lamps.push(lamp);
      add(door, [0, 8 + (n % 2) * 3.5, 47], [0, 0, 0], 0.7 + n * 0.007, 0.8 + n * 0.007);
      n++;
    });
  }
  const canopy = edged(box(L - BAY - 0.6, 0.26, 2.8, M.steel));
  canopy.position.set(BAY / 2, 5.0, D / 2 + 1.8);
  add(canopy, [0, 13, 37], [0, 0, 0], 0.74, 0.86);

  // 5. Oficinas en la primera crujía
  const office = new THREE.Group();
  office.position.set(-L / 2 + BAY / 2, 4, D / 2 + 3.9);
  const glassBox = box(BAY - 0.4, 8, 7, M.glass);
  glassBox.add(new THREE.LineSegments(new THREE.EdgesGeometry(glassBox.geometry), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 })));
  office.add(glassBox);
  const floorLine = box(BAY - 0.2, 0.3, 7.2, M.steel);
  office.add(floorLine);
  const cap = box(BAY, 0.35, 7.6, M.steel);
  cap.position.y = 4.15;
  office.add(cap);
  add(office, [-10, 9, 44], [0, -0.35, 0], 0.76, 0.9);

  // Final: llegan tráileres a los andenes
  [2, 7, 11].forEach((d, k) => {
    const truck = new THREE.Group();
    truck.position.set(doorXs[d], 0, D / 2 + 0.9 + 7);
    const body = box(2.7, 2.9, 13.6, M.trailer);
    body.position.y = 1.2 + 1.45;
    truck.add(body);
    [-4.6, -3.2, 4.4, 8.6].forEach((z) => {
      const axle = box(2.6, 1.0, 1.0, M.dark);
      axle.position.set(0, 0.5, z);
      truck.add(axle);
    });
    const cab = box(2.6, 3.1, 2.6, M.cab);
    cab.position.set(0, 2.3, 8.3);
    truck.add(cab);
    add(truck, [0, 0, 118], [0, 0, 0], 0.85 + k * 0.03, 0.97 + k * 0.01, scene).userData.fly.away = true;
  });

  // Luz cálida de andenes al terminar
  const glow = [-26, 6, 36].map((x) => {
    const light = new THREE.PointLight(0xffb24a, 0, 64, 1.7);
    light.position.set(x, 7.5, D / 2 + 9);
    scene.add(light);
    return light;
  });

  // Puntos de anclaje de las etiquetas
  const anchors = [
    new THREE.Vector3(34, 0.6, D / 2 + 1), new THREE.Vector3(12, HE + 1.6, D / 2),
    new THREE.Vector3(24, HR + 2.4, 4), new THREE.Vector3(L / 2 + 0.6, 7.4, 6),
    new THREE.Vector3(-6, 5, D / 2 + 1.4), new THREE.Vector3(-L / 2 + 6, 9.4, D / 2 + 5),
  ].map((v) => v.add(new THREE.Vector3(0, 1.2, 0)));

  const from = new THREE.Vector3(), to = new THREE.Vector3(), look = new THREE.Vector3(), v = new THREE.Vector3();
  let width = 1, height = 1;

  function resize() {
    width = host.clientWidth; height = host.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function pose(t, yaw) {
    for (const obj of parts) {
      const f = obj.userData.fly;
      const k = 1 - easeInOut((t - f.t0) / (f.t1 - f.t0));
      obj.position.set(f.home.x + f.off.x * k, f.home.y + f.off.y * k, f.home.z + f.off.z * k);
      obj.rotation.set(f.turn.x + f.rot.x * k, f.turn.y + f.rot.y * k, f.turn.z + f.rot.z * k);
      if (f.away) obj.visible = k < 0.999;
    }
    // Se encienden los andenes y baja la luz del día
    const on = smooth((t - 0.89) / 0.1);
    M.lamp.emissiveIntensity = on * 3.4;
    M.glass.emissiveIntensity = on * 0.24;
    glow.forEach((light) => { light.intensity = on * 95; });
    key.intensity = lerp(3.1, 1.55, on);
    hemi.intensity = lerp(1.25, 0.85, on);

    // Cámara: de la vista de despiece a una vista baja de tres cuartos
    // En pantallas anchas el modelo ocupa los dos tercios derechos; en vertical va centrado
    const narrow = camera.aspect < 1;
    const c = easeInOut(t);
    const reach = narrow ? 1.12 / camera.aspect : Math.max(1, 1.78 / camera.aspect);
    scene.fog.near = 430 * reach; scene.fog.far = 980 * reach;
    from.set(-186, 142, 252); to.set(-84, 34, 168);
    v.lerpVectors(from, to, c).multiplyScalar(reach);
    const a = (yaw || 0) + lerp(-0.08, 0.1, c);
    camera.position.set(v.x * Math.cos(a) - v.z * Math.sin(a), v.y, v.x * Math.sin(a) + v.z * Math.cos(a));
    look.set(narrow ? 2 : lerp(-30, -25, c) * reach, lerp(narrow ? 34 : 20, narrow ? 16 : 3, c), 6);
    camera.lookAt(look);
  }

  return {
    renderer, scene, camera, anchors, resize, pose,
    render() { renderer.render(scene, camera); },
    project(index, out) {
      v.copy(anchors[index]).project(camera);
      out.x = (v.x * 0.5 + 0.5) * width; out.y = (-v.y * 0.5 + 0.5) * height;
      return out;
    },
  };
}

function start() {
  const model = build();
  if (!model) return;
  act.classList.add("has-3d");

  const items = [...act.querySelectorAll(".anat__list li")];
  const tags = [...act.querySelectorAll(".anat__tag")];
  const point = { x: 0, y: 0 };
  let cur = -1, yaw = 0, yawGoal = 0, raf = 0, visible = true, lastActive = -2;

  // El modelo termina de armarse un poco antes de que el acto se suelte
  const toModel = (p) => clamp01((p - 0.02) / 0.9);

  function ui(t) {
    let active = -1;
    PHASES.forEach(([a], i) => { if (t >= a) active = i; });
    if (t >= 0.93) active = 6;
    if (active !== lastActive) {
      lastActive = active;
      items.forEach((li, i) => { li.classList.toggle("is-on", i === active); li.classList.toggle("is-done", i < active); });
    }
    tags.forEach((tag, i) => {
      const [a, b] = PHASES[i];
      const shown = t > a + (b - a) * 0.75 && t < 0.99;
      tag.classList.toggle("is-on", shown);
      if (shown) {
        model.project(i, point);
        tag.style.transform = "translate3d(" + (point.x - 12).toFixed(1) + "px," + (point.y - 15).toFixed(1) + "px,0)";
      }
    });
  }

  function frame() {
    raf = 0;
    const goal = toModel(progress());
    cur = cur < 0 || reduce ? goal : lerp(cur, goal, 0.14);
    if (Math.abs(goal - cur) < 0.0004) cur = goal;
    yaw = lerp(yaw, yawGoal, 0.08);
    model.pose(cur, yaw);
    model.render();
    ui(cur);
    if (visible && (cur !== goal || Math.abs(yaw - yawGoal) > 0.0005)) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (visible && !raf) raf = requestAnimationFrame(frame); };

  model.resize();
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", () => { model.resize(); kick(); });
  if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
    stage.addEventListener("pointermove", (e) => { yawGoal = (e.clientX / innerWidth - 0.5) * 0.16; kick(); });
  }
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; kick(); }).observe(stage);
  kick();

  // Captura de la imagen de respaldo (solo la usa el script de verificación)
  window.__naveShot = (t) => { model.pose(t, 0); model.render(); return model.renderer.domElement.toDataURL("image/webp", 0.9); };
}

if (act && !reduce) {
  // Se construye cuando el acto está por entrar, no al cargar la página
  const io = new IntersectionObserver(async (entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    try {
      THREE = await import("./vendor/three.module.min.js");
      start();
    } catch (e) {
      // Sin Three.js queda la imagen de respaldo
    }
  }, { rootMargin: "150% 0px" });
  io.observe(act);
}
