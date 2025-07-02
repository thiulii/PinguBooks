//Este es el archivo que conecta api.js y la bdd pingubooks

const {Pool}= require("pg");
// Pool es para evitar conect y end en cada funcion
const dbPinguBooks = new Pool({
user:"postgres",
password: "postgres",
host:"localhost",
port: 5432,
database:"pingubooks",
})

//query("PONGO LO QUE VOY A SELECCIONAR")
// async para hacer la promesa, osea que espere la respuesta del await
async function getAllAutores(){
    const response = await dbPinguBooks.query("SELECT * FROM  autores");
    if(response.rowCount ===0){
        return undefined;
    }
    return response.rows;
}
//CREATE USUARIO
async function createdUser(name, biography, dateBirth, mail, password, averageRatingWorks, dateLogIn, country){
    const response = await dbPinguBooks.query("INSERT INTO autores (nombre, biografia, fecha_de_nacimiento, mail, contraseña, puntuacion_promedio_de_obras, fecha_de_ingreso, pais) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ", [name, biography, dateBirth, mail, password, averageRatingWorks, dateLogIn, country]);
}
//Verifica si esta bien la contraseña del mail dado, undefined si esta mal la contraseña
async function changeUser(mail, password) {
    const passwordReal = await dbPinguBooks.query("SELECT contraseña FROM autores, WHERE mail =$1", mail);
    if(password !== passwordReal){
        return undefined; 
    }
    return passwordReal.rows;
    
}
//COMPARA EL MAIL MANDADO CON LOS ACTUALES, a ver si existe. Undefined si no existe.
async function comparisonMail(mail){
    const response = await dbPinguBooks.query("SELECT * FROM  autores WHERE (mail = $1 )");
    if(response.rowCount ===0){
        return undefined;
    }
    return response.rows[0];
}
// verificacion de usuario sea el dueño de la obra
async function verifyUser (idObra, idUsuario) {
    const idAutor = await dbPinguBooks.query("SELETC id_autor FROM obras, WHERE id_obra = $1", idObra);
    if(idUsuario !== idAutor){
        return undefined; // elegir como devolver error
    }
    return idAutor.rows; //elegir como decir que si es el mismo
}
//Muestra todas las obras
async function getAllObras(){
    const response = await dbPinguBooks.query("SELECT id_obra FROM obras");
    
}
//Crear obra
async function createWork( titulo, portada, descripcion, id_tag, id_autor, fecha_de_publicacion, puntuacion, contenido ) {
    const response = await dbPinguBooks.query("INSERT INTO obras(titulo, portada, descripcion, id_tag, id_autor, fecha_de_publicacion, puntuacion, contenido)", [titulo, portada, descripcion, id_tag, id_autor, fecha_de_publicacion, puntuacion, contenido]);
    console.log("response", response);
    console.log("rowCount", response.rowCount);
    return response.rowCount;
}
//MOstrar todo lo de la obra pedida
async function getAnObra(idObra){
    const response = await dbPinguBooks.query("SELECT * FROM obras, WHERE id_obra=$1", idObra);
    if(response.length===0){
        return undefined
    }
    return response.rows[0];
    
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

//borrar obras
async function deleteWork(idUsuario, idObra) {
    const workExist = await dbPinguBooks.query("",);
    if (idObra.length === 0){
        return undefined;
    }
}
//muestra todos los comentarios de una obra
async function getAllComentarios(idObra){
    const response = await dbPinguBooks.query("SELECT * FROM comentarios where id_obra =$1", idObra);
    return response.rows;
    
}


//Aqui exporto todas las funciones para usar en api.json
module.exports={
    //User
    getAllAutores,
    createdUser,
    
    verifyUser,
     comparisonMail,

     //obras
    createWork,
    changeUser,
    getAllObras,
    deleteWork,
    TagWithWorkAnalysis,
    getAnObra,
   
   //Comentarios
    getAllComentarios,
}