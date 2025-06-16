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
//Muestra todas las obras
async function getAllObras(){
    const response = dbPinguBooks.query("SELECT id_obra FROM obras");
    
}
//muestra todos los comentarios de una obra
async function getAllComentarios(id_obra){
    const response = dbPinguBooks.query("SELECT * FROM comentarios where id_obra =$1", id_obra);
    return (await response).rows;
    
}
//CREATE USUARIO
async function createdUser(name, biography, dateBirth, mail, password, averageRatingWorks, dateLogIn, country){
    const response = dbPinguBooks.query("INSERT INTO autores (nombre, biografia, fecha_de_nacimiento, mail, contraseña, puntuacion_promedio_de_obras, fecha_de_ingreso, pais) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ", [name, biography, dateBirth, mail, password, averageRatingWorks, dateLogIn, country]);
}
//Crear obra
async function createWork(idAutor, params) {
    
}
//Verifica si esta bien la contraseña del mail dado, undefined si esta mal la contraseña
async function changeUser(mail, password) {
    const passwordReal =dbPinguBooks.query("SELECT contraseña FROM autores, WHERE mail =$1", mail);
    if(password !== passwordReal){
        return undefined; 
    }
    return (await passwordReal).rows;
    
}
//COMPARA EL MAIL MANDADO CON LOS ACTUALES, a ver si existe. Undefined si no existe.
async function comparisonMail(mail){
    const response = dbPinguBooks.query("SELECT * FROM  autores WHERE (mail = $1 )");
    if(response.rowCount ===0){
        return undefined;
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
// verificacion de usuario sea el dueño de la obra
async function verifyUser (idObra, idUsuario) {
    const idAutor = dbPinguBooks.query("SELETC id_autor FROM obras, WHERE id_obra = $1", idObra);
    if(idUsuario !== idAutor){
        return undefined; // elegir como devolver error
    }
    return idAutor.rows; //elegir como decir que si es el mismo
}
//borrar obras
async function deleteWork(idUsuario, idObra) {
    const workExist = dbPinguBooks.query("",);
    if (idObra.length === 0){
        return undefined;
    }
}

//Aqui exporto todas las funciones para usar en api.json
module.exports={
    getAllAutores,
    getAllComentarios,
    getAllObras,
    comparisonMail,
    createdUser,
    TagWithWorkAnalysis,
    verifyUser,
    deleteWork,
    changeUser
}