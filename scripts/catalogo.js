BDD_LINK = "http://localhost:3000";

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
document.addEventListener("DOMContentLoaded", async function(){
    await cargarCatalogo();
})