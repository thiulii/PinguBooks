BDD_LINK = "http://localhost:3000";

async function cargarTop(){

    const res = await fetch(BDD_LINK + "/obras?by=puntuacion&limit=10&order=desc");
    const obras = await res.json();

    obras.forEach((libro, i) => {
        const fila = document.createElement("a");
        fila.href = `libro.html?id=${libro.id_obras}`;
        fila.classList.add("libro", "container");
        
        const nombre = document.createElement("h7");
        nombre.innerHTML = `TOP ${i + 1}: ${libro.titulo}`;
        fila.appendChild(nombre);

        let foto = document.createElement("img");
        foto.src = libro.portada;
        foto.alt = `portada de ${libro.titulo}`;
        foto.classList.add("portadita")
        fila.appendChild(foto);

        const puntaje = document.createElement("p");
        puntaje.innerHTML = `⭐ ${libro.puntuacion.toFixed(2)}`;
        fila.appendChild(puntaje);

        const top = document.getElementById("top-tabla");
        top.appendChild(fila);
    });
}

async function cargarLatest(){

    const res = await fetch(BDD_LINK + "/obras?by=fecha_de_publicacion&order=desc&limit=24");
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

        const biblioteca = document.getElementById("latest");
        biblioteca.appendChild(elemento);
    
});
}
document.addEventListener("DOMContentLoaded", async function(){
    await cargarTop();
    await cargarLatest();
})