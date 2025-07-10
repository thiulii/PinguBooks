BDD_LINK = "http://localhost:3000";
const queryString = window.location.search; //para leer el url
const urlParams = new URLSearchParams(queryString);
const search = urlParams.get('search');
const order = urlParams.get('order');
const by = urlParams.get('by');
const tagsParam = urlParams.get("tags");
let tagsIniciales = []
if (tagsParam){
    tagsIniciales = tagsParam.split(",")
}

async function cargarCatalogo(){
    console.log("entro al menos!")
    const res = await fetch(BDD_LINK + "/obras?order=desc");
    const obras = await res.json();

    obras.forEach((libro) => {
        const elemento = document.createElement("div");
        elemento.classList.add("col-6", "col-md-3", "col-lg-2", "mb-3", "libro");
        
        const link = document.createElement("a");
        link.href = `libro.html?id=${libro.id_obras}`;
        elemento.appendChild(link);

        const foto = document.createElement("img");
        foto.src = libro.portada;
        foto.alt = `portada de ${libro.titulo}`;
        foto.classList.add("portada")
        link.appendChild(foto);

        const nombre = document.createElement("h5");
        nombre.innerHTML = `${libro.titulo}`;
        link.appendChild(nombre);

        const biblioteca = document.getElementById("catalogoObras");
        biblioteca.appendChild(elemento);
    
});
}

// tags seleccionados (agregar y sacar)

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".dropdown-menu button").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    });
  });

const botonesTags = document.querySelectorAll(".btn-warning");
const tagsSeleccionados = new Set();
const dropdownTags = document.getElementById("tagsDropdown");

function cargarTags(){
    botonesTags.forEach((boton) => {
        const tag = boton.textContent.trim();
    
        // Si es uno de los tags que vino desde el URL
        if (tagsIniciales.includes(tag)) {
          tagsSeleccionados.add(tag);
          boton.classList.remove("btn-warning");
          boton.classList.add("btn-success");
        }
    
        // Escuchar clicks para seleccionar/desseleccionar
        boton.addEventListener("click", () => {
          if (tagsSeleccionados.has(tag)) {
            tagsSeleccionados.delete(tag);
            boton.classList.remove("btn-success");
            boton.classList.add("btn-warning");
          } else {
            tagsSeleccionados.add(tag);
            boton.classList.remove("btn-warning");
            boton.classList.add("btn-success");
          }
          dropdownTags.innerText= `Tags: ${tagsSeleccionados.size} seleccionados`;
        });
      });
    dropdownTags.innerText= `Tags:  ${tagsSeleccionados.size} seleccionados`;
}
  
let criterioSeleccionado;
const botonesCriterio = document.querySelectorAll(".criterioBoton");
const dropdownCriterio = document.getElementById("dropdownCriterio")
let mostrarOrden;

function cargarFiltros(){
    if (!by || !["fecha_de_publicacion", "puntuacion"].includes(by)){
        criterioSeleccionado="fecha_de_publicacion";
    }
    if (criterioSeleccionado="fecha_de_publicacion"){
        mostrarOrden = "fecha de publicacion";
    }

    criterioBoton.forEach((boton) => {
        
    })

    dropdownCriterio.innerText= `Criterio: ${mostrarOrden}`;
}



document.addEventListener("DOMContentLoaded", async function(){

    await cargarTags();
    await cargarFiltros(order, by, tags); 
    await cargarCatalogo(search, order, by, tags);
})
