// Datos de contacto de IMAX. Llenar antes de publicar.
const CONFIG = {
  whatsapp: "", // con lada de país y sin signos, por ejemplo "5215512345678"
  phone: "",    // como se debe leer, por ejemplo "55 1234 5678"
  email: "",
  address: "",
};

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Datos de contacto visibles
document.querySelectorAll("[data-cfg]").forEach((el) => {
  const value = CONFIG[el.dataset.cfg];
  if (!value) return;
  el.textContent = value;
  if (el.dataset.cfg === "phone") el.href = "tel:" + value.replace(/\s+/g, "");
  if (el.dataset.cfg === "email") el.href = "mailto:" + value;
});

document.getElementById("anio").textContent = new Date().getFullYear();

// Barra de navegación y menú desplegable
const topBar = document.getElementById("top");
const mega = document.getElementById("mega");
const triggers = topBar.querySelectorAll("[aria-controls='mega']");

function setMenu(open) {
  mega.hidden = !open;
  topBar.classList.toggle("is-open", open);
  triggers.forEach((t) => t.setAttribute("aria-expanded", String(open)));
}

triggers.forEach((t) => t.addEventListener("click", () => setMenu(mega.hidden)));
mega.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
document.addEventListener("click", (e) => !topBar.contains(e.target) && setMenu(false));

// Portada: la barra se vuelve sólida y la imagen se desplaza más lento que la página
const heroImg = document.querySelector(".hero__media img");
const hero = document.querySelector(".hero");

function onScroll() {
  const y = window.scrollY;
  topBar.classList.toggle("is-solid", y > 40);
  if (!reducedMotion && y < hero.offsetHeight) heroImg.style.translate = "0 " + y * 0.18 + "px";
  updateRail();
}

// Paneles de servicios: se abre el que está bajo el cursor o con foco
const panels = document.querySelectorAll(".panel");
panels.forEach((panel) => {
  const open = () => panels.forEach((p) => p.classList.toggle("is-open", p === panel));
  panel.addEventListener("mouseenter", open);
  panel.addEventListener("focus", open);
});

// Los enlaces de cada servicio preseleccionan el interés en el formulario
document.querySelectorAll("[data-interes]").forEach((link) =>
  link.addEventListener("click", () => {
    document.getElementById("f-interes").value = link.dataset.interes;
  })
);

// Parque: puntos sobre la imagen
const SPOTS = [
  ["Acceso controlado", "Caseta de vigilancia, barda perimetral y un solo punto de entrada y salida para transporte de carga y personal."],
  ["Vialidad interna", "Calles de concreto dimensionadas para tráileres, con camellón, alumbrado y las redes de agua, drenaje y energía bajo tierra."],
  ["Patios de maniobras y andenes", "Cada nave tiene su patio para maniobrar y estacionar cajas, y andenes con rampa niveladora a la altura del tráiler."],
  ["Naves", "Estructura metálica de grandes claros, piso de concreto industrial y cubierta con lámina translúcida para aprovechar la luz natural."],
  ["Oficinas", "Área de oficinas y servicios integrada a la nave, con acceso y estacionamiento separados del tránsito de carga."],
];
const spot = document.querySelector(".spot");
const spotButtons = document.querySelectorAll("[data-spot]");

function showSpot(index) {
  document.getElementById("spot-title").textContent = SPOTS[index][0];
  document.getElementById("spot-text").textContent = SPOTS[index][1];
  spotButtons.forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.spot) === index)));
  spot.classList.remove("is-swap");
  void spot.offsetWidth;
  spot.classList.add("is-swap");
}

spotButtons.forEach((b) => b.addEventListener("click", () => showSpot(Number(b.dataset.spot))));

// Proceso: la línea avanza con el scroll y se enciende el paso alcanzado
const steps = document.getElementById("steps");
const railFill = document.getElementById("rail-fill");
const stepItems = steps.querySelectorAll(".step");

function updateRail() {
  const rect = steps.getBoundingClientRect();
  const mark = window.innerHeight * 0.6;
  const progress = Math.min(1, Math.max(0, (mark - rect.top) / rect.height));
  railFill.style.height = progress * 100 + "%";
  stepItems.forEach((item) => item.classList.toggle("is-on", item.getBoundingClientRect().top < mark));
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateRail);
onScroll();

// El formulario abre WhatsApp con el mensaje armado
const form = document.getElementById("form-contacto");
const status = form.querySelector(".form__status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  status.textContent = "";

  const required = [form.nombre, form.telefono];
  required.forEach((input) => input.setAttribute("aria-invalid", String(!input.value.trim())));
  const firstEmpty = required.find((input) => !input.value.trim());
  if (firstEmpty) {
    status.textContent = "Escribe tu nombre y tu teléfono para poder contactarte.";
    firstEmpty.focus();
    return;
  }

  if (!CONFIG.whatsapp) {
    status.textContent = "Falta configurar el número de WhatsApp de IMAX en script.js.";
    return;
  }

  const lines = [
    "Hola, soy " + form.nombre.value.trim() + (form.empresa.value.trim() ? " de " + form.empresa.value.trim() : "") + ".",
    "Me interesa: " + form.interes.value + ".",
    form.superficie.value.trim() && "Superficie aproximada: " + form.superficie.value.trim() + " m².",
    form.mensaje.value.trim(),
    "Mi teléfono: " + form.telefono.value.trim(),
  ].filter(Boolean);

  window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
});
