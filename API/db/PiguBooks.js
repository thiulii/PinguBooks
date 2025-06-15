//Este es el archivo que conecta api.js y la bdd pingubooks

const {Pool}= require("pg");
// Pool es para evitar conect y end en cada funcion
const dbPinguBooks = new Pool({
user:postgres,
password: postgres,
host:localhost,
port: 5432,
database:pingubooks,
})

//query("PONGO LO QUE VOY A SELECCIONAR")
// async para hacer la promesa, osea que espere la respuesta del await
async function getAllAutores(){
    const response = dbPinguBooks.query("SELECT * FROM  autores");
    if(response.rowCount ===0){
        return undefined;
    }
    return response.rows;
}
async function getAllObras(){
    const response = dbPinguBooks.query("SELECT * FROM  obras");
    
}
async function getAllComentarios(){
    const response = dbPinguBooks.query("SELECT * FROM comentarios");
    
}

//Funcion para  devolver si existe el id en la tabla

//funcion para crear autor
//Funcion para cambiar algo de autor
// Funcion que relacione puntuacion comentarios con puntuacion autor
// SK

await Pool.end();
//Aqui exporto todas las funciones para usar en api.json
module.exports={
    getAll
}