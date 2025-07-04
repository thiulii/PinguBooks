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
    const response = await dbPinguBooks.query("SELECT * FROM  autores");
    if(response.rowCount ===0){
        return undefined;
    }
    return response.rows;
}

//Crea Usuario
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

//Compara el mail ingresado con los registrados en la tabla. Undefined si este no existe.
async function comparisonMail(mail){
    const response = await dbPinguBooks.query("SELECT * FROM  autores WHERE (mail = $1 )");
    if(response.rowCount ===0){
        return undefined;
    }
    return response.rows[0];
}

// Verificacion de usuario sea el dueño de la obra
async function verifyUser (idObra, idUsuario) {
    const idAutor = await dbPinguBooks.query("SELECT id_autor FROM obras, WHERE id_obra = $1", idObra);
    if(idUsuario !== idAutor){
        return undefined; // elegir como devolver error
    }
    return idAutor.rows; //elegir como decir que si es el mismo
}

// Muestra todos los comentarios de una obra
async function getAllComentarios(idObra){
    const response = await dbPinguBooks.query("SELECT * FROM comentarios where id_obra =$1", idObra);
    return response.rows;
    
}


// Aca se exportan todas las funciones...
module.exports={
    //User
    getAllAutores,
    createdUser,
    
    verifyUser,
    comparisonMail,

    //Obras
    changeUser,
   
    //Comentarios
    getAllComentarios,
}