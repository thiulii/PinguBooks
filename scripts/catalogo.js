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



// tags seleccionados (agregar y sacar)

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".dropdown-menu button").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    });
  });

async function cargarBuscadorTags(){
    const res = fetch(BDD_LINK + "/tags")
    const tagColocar = 
}

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
let mostrarCriterio;

function cargarCriterio(){
    if (!by || !["fecha_de_publicacion", "puntuacion"].includes(by)){
        criterioSeleccionado="fecha_de_publicacion";
    } else {
        criterioSeleccionado = by;
    }
    if (criterioSeleccionado==="fecha_de_publicacion"){
        mostrarCriterio = "fecha de publicacion";
    } else {
        mostrarCriterio = "estrellas"
    }

    botonesCriterio.forEach((boton) => {
        const criterio = boton.textContent.trim();
        boton.addEventListener("click", () => {
            if (criterio === "fecha de publicacion"){
                criterioSeleccionado = "fecha_de_publicacion";
                mostrarCriterio = criterio;
            } else{
                criterioSeleccionado = "puntuacion";
                mostrarCriterio = "estrellas";
            }
            dropdownCriterio.innerText= `Criterio: ${mostrarCriterio}`;
          });
    })

    dropdownCriterio.innerText= `Criterio: ${mostrarCriterio}`;
}

let ordenSeleccionado;
const botonesOrden = document.querySelectorAll(".ordenBoton");
const dropdownOrden = document.getElementById("dropdownOrden")
let mostrarOrden;

function cargarOrden(){
    if (!order || !["desc", "asc"].includes(order)){
        ordenSeleccionado="desc";
    } else {
        ordenSeleccionado = order;
    }
    if (ordenSeleccionado==="desc"){
        mostrarOrden = "descendiente";
    } else {
        mostrarOrden = "ascendiente"
    }

    botonesOrden.forEach((boton) => {
        const orden = boton.textContent.trim();
        boton.addEventListener("click", () => {
            if (orden === "descendiente"){
                ordenSeleccionado = "desc";
                mostrarOrden = orden;
            } else{
                ordenSeleccionado = "asc";
                mostrarOrden = orden;
            }
            dropdownOrden.innerText= `Orden: ${mostrarOrden}`;
          });
    })

    dropdownOrden.innerText= `Orden: ${mostrarOrden}`;
}

async function cargarCatalogo(){
    const res = await fetch(BDD_LINK + "/obras?");
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

document.addEventListener("DOMContentLoaded", async function(){
    await cargarBuscadorTags();
    await cargarTags();
    await cargarCriterio();
    await cargarOrden(); 
    await cargarCatalogo();
})
