async function cargarCatalogo(){

    const res = await fetch(BDD_LINK + "/obras?order=desc");
    const obras = await res.json();

    obras.forEach((libro) => {
        const elemento = document.createElement("div");
        elemento.classList.add("col-6", "col-md-4", "col-lg-3", "mb-3", "libro");
        
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

        const top = document.getElementById("catalogoObras");
        top.appendChild(elemento);
    
});
}
document.addEventListener("DOMContentLoaded", async function(){
    await cargarCatalogo();
})