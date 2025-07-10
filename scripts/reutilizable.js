const formBuscar = document.getElementById("navbarBuscarForm");
const inputBuscar = document.getElementById("navbarBuscarInput");


formBuscar.addEventListener("submit", function (e) {
  e.preventDefault(); // Evita que recargue la página
  const query = inputBuscar.value.trim();
  if (query !== "") {
    window.location.href = `/catalogo.html?search=${encodeURIComponent(query)}`;
  }
});