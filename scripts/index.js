BDD_LINK = "http://localhost:3000";

async function cargarTop(){
    const top = document.getElementById("top");
    const res = await fetch(BDD_LINK + "/obras?by=puntuacion&limit=10&order=desc");
    console.log("hola");
    return "lol"
}

document.addEventListener("DOMContentLoaded", async function(){
    await cargarTop();
})