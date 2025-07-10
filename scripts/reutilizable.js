const formBuscar = document.getElementById("navbarBuscarForm");
const inputBuscar = document.getElementById("navbarBuscarInput");


formBuscar.addEventListener("submit", function (e) {
  e.preventDefault();
  const search = inputBuscar.value.trim();
  if (search !== "") {
    window.location.href = `/catalogo.html?search=${encodeURIComponent(search)}`;
  }
});