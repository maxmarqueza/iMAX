// Datos de contacto de IMAX. Llenar antes de publicar.
const CONFIG = {
  whatsapp: "", // con lada de país y sin signos, por ejemplo "5215512345678"
  phone: "",    // como se debe leer, por ejemplo "55 1234 5678"
  email: "",
  address: "",
};

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const clamp01 = (n) => Math.min(1, Math.max(0, n));
const smooth = (n) => { n = clamp01(n); return n * n * (3 - 2 * n); };
const lerp = (a, b, t) => a + (b - a) * t;
// Avance de un acto fijo (0 a 1), el mismo de fx/core.js (fx/auto.js lo reemplaza por tiempo)
const actP = (el) => FX.actP(el);

ScrollCraft.mount(document.body);

// Datos de contacto visibles
// Lo que todavía no tiene dato no se muestra
document.querySelectorAll("[data-cfg]").forEach((el) => {
  const value = CONFIG[el.dataset.cfg];
  if (!value) { el.closest("div").hidden = true; return; }
  el.textContent = value;
  if (el.dataset.cfg === "phone") el.href = "tel:" + value.replace(/\s+/g, "");
  if (el.dataset.cfg === "email") el.href = "mailto:" + value;
});
document.querySelectorAll(".contact__data").forEach((dl) => { dl.hidden = !dl.querySelector("div:not([hidden])"); });
document.getElementById("anio").textContent = new Date().getFullYear();

// Barra de navegación y menú con vista previa
const topBar = document.getElementById("top");
const mega = document.getElementById("mega");
const triggers = topBar.querySelectorAll("[aria-controls='mega']");
const megaItems = [...mega.querySelectorAll(".mega__item:not(.mega__item--mobile)")];
const megaImgs = [...mega.querySelectorAll(".mega__preview img")];

function setMenu(open) {
  mega.hidden = !open;
  topBar.classList.toggle("is-open", open);
  triggers.forEach((t) => t.setAttribute("aria-expanded", String(open)));
}
function previewItem(index) {
  megaItems.forEach((item, i) => item.classList.toggle("is-on", i === index));
  megaImgs.forEach((img, i) => img.classList.toggle("is-on", i === index));
}
megaItems.forEach((item, i) => {
  item.addEventListener("mouseenter", () => previewItem(i));
  item.addEventListener("focus", () => previewItem(i));
});
previewItem(0);
triggers.forEach((t) => t.addEventListener("click", () => setMenu(mega.hidden)));
mega.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
document.addEventListener("click", (e) => !topBar.contains(e.target) && setMenu(false));
addEventListener("scroll", () => topBar.classList.toggle("is-solid", scrollY > 40), { passive: true });

// Los enlaces de cada servicio preseleccionan el interés en el formulario
document.querySelectorAll("[data-interes]").forEach((link) =>
  link.addEventListener("click", () => {
    document.getElementById("f-interes").value = link.dataset.interes;
  })
);

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
    form.zona.value.trim() && "Zona: " + form.zona.value.trim() + ".",
    form.altura.value.trim() && "Altura libre: " + form.altura.value.trim() + " m.",
    form.andenes.value.trim() && "Andenes: " + form.andenes.value.trim() + ".",
    form.energia.value.trim() && "Energía: " + form.energia.value.trim() + " kVA.",
    form.fecha.value.trim() && "Fecha de ocupación: " + form.fecha.value.trim() + ".",
    form.mensaje.value.trim(),
    "Mi teléfono: " + form.telefono.value.trim(),
  ].filter(Boolean);

  window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
});

