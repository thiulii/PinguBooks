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


//COMPARA EL MAIL MANDADO CON LOS ACTUALES
async function comparisonMail(mail){
    const response = dbPinguBooks.query("SELECT * FROM  autores WHERE (mail = $1 )");
    if(response.rowCount ===0){
        return 0;
    }
    return response.rows;
}

//CREATE USUARIO
async function createdUser(name, biography, dateBirth, mail, password, averageRatingWorks, dateLogIn, country){
    const response = dbPinguBooks.query("INSERT INTO autores (nombre, biografia, fecha_de_nacimiento, mail, contraseña, puntuacion_promedio_de_obras, fecha_de_ingreso, pais) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ", [name, biography, dateBirth, mail, password, averageRatingWorks, dateLogIn, country]);
}

//FILTRAR OBRAS

async function TagWithWorkAnalysis(tagName){
    const TagExist =['romance',
        'fantasia', 'accion', 'misterio', 'suspensO', 'aventura', 'terror', 'ficcion', 'ciencia_ficcion', 'humor',  'poemas/poesia', 'relatos_breves', 'sobrenatural/paranormal']; //aqui hay que poner los tag que se usen
    if(!TagExist.includes(tagName)){
        return undefined;
    }
    const response = await dbPinguBooks.query("SELECT obras.titulo as obra, FROM obras INNER JOIN tag ON (tag.id_obra = obras.id_obras) WHERE tag.${tagName} = '1' "); // 1 ES SI, 0 ES NO
    return (await response).rows;
}
//Aqui exporto todas las funciones para usar en api.json
module.exports={
    getAllAutores,
    comparisonMail,
    createdUser,
    TagWithWorkAnalysis
}