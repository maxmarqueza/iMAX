// Datos de contacto de IMAX. Llenar antes de publicar.
const CONFIG = {
  whatsapp: "", // con lada de país y sin signos, por ejemplo "5215512345678"
  phone: "",    // como se debe leer, por ejemplo "55 1234 5678"
  email: "",
  address: "",
};

// Datos de contacto visibles
document.querySelectorAll("[data-cfg]").forEach((el) => {
  const value = CONFIG[el.dataset.cfg];
  if (!value) return;
  el.textContent = value;
  if (el.dataset.cfg === "phone") el.href = "tel:" + value.replace(/\s+/g, "");
  if (el.dataset.cfg === "email") el.href = "mailto:" + value;
});

document.getElementById("anio").textContent = new Date().getFullYear();

// Filtro de naves por modalidad
const chips = document.querySelectorAll(".chip");
const rows = document.querySelectorAll(".stock__row[data-mode]");
const empty = document.querySelector(".stock__empty");

function applyFilter(mode) {
  let visible = 0;
  rows.forEach((row) => {
    const show = mode === "todas" || row.dataset.mode.split(" ").includes(mode);
    row.hidden = !show;
    if (show) visible++;
  });
  chips.forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.filter === mode)));
  empty.hidden = visible > 0;
}

chips.forEach((chip) => chip.addEventListener("click", () => applyFilter(chip.dataset.filter)));
document.querySelectorAll("[data-filter-link]").forEach((link) =>
  link.addEventListener("click", () => applyFilter(link.dataset.filterLink))
);

// Los enlaces de cada servicio preseleccionan el interés en el formulario
document.querySelectorAll("[data-interes]").forEach((link) =>
  link.addEventListener("click", () => {
    document.getElementById("f-interes").value = link.dataset.interes;
  })
);

// "Pedir informes" de una nave llena el campo de detalles
const form = document.getElementById("form-contacto");
const status = form.querySelector(".form__status");

document.querySelectorAll("[data-nave]").forEach((link) =>
  link.addEventListener("click", () => {
    form.mensaje.value = "Quiero informes de la " + link.dataset.nave + ".";
  })
);

// El formulario abre WhatsApp con el mensaje armado
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
