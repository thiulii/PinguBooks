//Este es el archivo que conecta api.js y la db

const { Pool } = require("pg");         // Pool es para evitar conect y end en cada funcion
                                        // Pool para manejar conexiones de forma eficiente
const dbPinguBooks = new Pool({

user:"postgres",
password: "postgres",
host:"localhost",
port: 5432,
database:"PinguBooks",
})


// TABLA AUTORES

// Devuelve todos los autores
async function getAllAutores() {
  const res = await dbPinguBooks.query("SELECT * FROM autores");
  return res.rowCount === 0 ? undefined : res.rows;

}

// Crea un nuevo autor y lo devuelve
async function createdUser(nombre, biografia, fechaNacimiento, mail, contraseña, puntuacion = 0, fechaIngreso = new Date(), pais) {
  const res = await dbPinguBooks.query(
    "INSERT INTO autores (nombre, biografia, fecha_de_nacimiento, mail, contraseña, puntuacion_promedio_de_obras, fecha_ingreso, pais) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
    [nombre, biografia, fechaNacimiento, mail, contraseña, puntuacion, fechaIngreso, pais]
  );
  return res.rows[0];
}

// Compara si el mail ya existe en la base de datos
async function comparisonMail(mail) {
  try{
  const res = await dbPinguBooks.query("SELECT * FROM autores WHERE mail = $1", [mail]);
  return res.rowCount === 0 ? undefined : res.rows[0];
}
catch(err){
  console.error("Error al comparar mails:", err);
  return undefined;
}}

// Verifica si la contraseña coincide con el mail dado
async function changeUser(mail, password) {
  try{
  const res = await dbPinguBooks.query("SELECT id_autor, contraseña FROM autores WHERE mail = $1", [mail]);
  if (res.rowCount === 0 || res.rows[0].contraseña !== password) return undefined;
  return res.rows[0].id_autor;
}
catch(err){
  console.error("Error:", err);
  return undefined;}
}

// Verifica si el autor de una obra coincide con el usuario dado
async function verifyUser(idObra, idUsuario) {
  const res = await dbPinguBooks.query("SELECT id_autor FROM obras WHERE id_obras = $1", [idObra]);
  if (res.rowCount === 0 || res.rows[0].id_autor !== idUsuario) return undefined;
  return true;
}

// Devuelve los datos de un autor según su ID
async function getAutor(id_autor) {
  const res = await dbPinguBooks.query("SELECT * FROM autores WHERE id_autor = $1", [id_autor]);
  return res.rowCount === 0 ? undefined : res.rows[0];
}

// Elimina un autor por ID (sus obras se borran en cascada)
async function deleteAutor(id_autor) {
  try {
    await dbPinguBooks.query("DELETE FROM autores WHERE id_autor = $1", [id_autor]);
    return true;
  } catch (err) {
    console.error("Error al borrar autor:", err);
    return undefined;
  }
}

// Modifica todos los datos de un autor por su ID
async function modifyAutor(id_autor, nombre, biografia, fechaNacimiento, mail, contraseña, pais, foto_perfil) {
  try {
    await dbPinguBooks.query(`
      UPDATE autores
      SET nombre = $1, biografia = $2, fecha_de_nacimiento = $3, mail = $4, contraseña = $5, pais = $6, foto_perfil = $7
      WHERE id_autor = $8
    `, [nombre, biografia, fechaNacimiento, mail, contraseña, pais, foto_perfil, id_autor]);
    return true;
  } catch (err) {
    console.error("Error al modificar autor:", err);
    return undefined;
  }
}

// TABLA OBRAS

// Crea una obra con sus tags y la devuelve
async function createObra(titulo, portada, descripcion, tags, id_autor, contenido) {
  try {
    const res = await dbPinguBooks.query(`
      INSERT INTO obras (titulo, portada, descripcion, id_autor, contenido)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [titulo, portada, descripcion, id_autor, contenido]
    );

    const obra = res.rows[0];

    if (tags && tags.length > 0) {
      for (let tag of tags) {
        await dbPinguBooks.query("INSERT INTO obra_tag (id_obra, nombre_tag) VALUES ($1, $2)", [obra.id_obras, tag]);
      }
    }

    return obra;
  } catch (err) {
    console.error("Error al crear obra:", err);
    return undefined;
  }
}

// Devuelve una obra completa según su ID
async function getAnObra(idObra) {
  const res = await dbPinguBooks.query("SELECT * FROM obras WHERE id_obras = $1", [idObra]);
  return res.rowCount === 0 ? undefined : res.rows[0];
}

// Elimina una obra y sus relaciones (tags y comentarios)
async function deleteObra(id_obra) {
  try {
    await dbPinguBooks.query("DELETE FROM comentarios WHERE id_obra = $1", [id_obra]);
    await dbPinguBooks.query("DELETE FROM obra_tag WHERE id_obra = $1", [id_obra]);
    await dbPinguBooks.query("DELETE FROM obras WHERE id_obras = $1", [id_obra]);
    return true;
  } catch (err) {
    console.error("Error al borrar obra:", err);
    return undefined;
  }
}

// Modifica una obra por su ID (mantiene puntuación intacta)
async function modifyObra(id_obra, titulo, portada, descripcion, tags, fecha_publicacion, id_autor, puntuacion, contenido) {
  try {
    await dbPinguBooks.query(`
      UPDATE obras
      SET titulo = COALESCE($1, titulo),
          portada = COALESCE($2, portada),
          descripcion = COALESCE($3, descripcion),
          fecha_de_publicacion = COALESCE($4, fecha_de_publicacion),
          id_autor = COALESCE($5, id_autor),
          contenido = COALESCE($6, contenido),
          puntuacion =  COALESCE($8, puntuacion)
      WHERE id_obras = $7
    `, [titulo, portada, descripcion, fecha_publicacion, id_autor, contenido, id_obra, puntuacion]);

    if (tags) {
      await dbPinguBooks.query("DELETE FROM obra_tag WHERE id_obra = $1", [id_obra]);
      for (let tag of tags) {
        await dbPinguBooks.query("INSERT INTO obra_tag (id_obra, nombre_tag) VALUES ($1, $2)", [id_obra, tag]);
      }
    }

    return true;
  } catch (err) {
    console.error("Error al modificar obra:", err);
    return undefined;
  }
}

// Devuelve todas las obras filtradas por búsqueda, orden, criterio, tags y límite

async function getAllObras(busqueda, orden, criterio, tags, limite) {
  try {
    let query = `
      SELECT DISTINCT obras.*
      FROM obras
      LEFT JOIN obra_tag ON obras.id_obras = obra_tag.id_obra
    `;
    const condiciones = [];
    const valores = [];
    let idx = 1;

    if (busqueda) {
      condiciones.push(`(
        obras.titulo ILIKE '%' || $${idx} || '%' OR    
        CAST(obras.id_obras AS TEXT) = $${idx}
      )`);
      valores.push(busqueda);
      idx++;
    }

    if (tags && tags.length > 0) {
      condiciones.push(`obra_tag.nombre_tag = ANY($${idx})`);
      valores.push(tags);
      idx++;
    }

    if (condiciones.length > 0) {
      query += " WHERE " + condiciones.join(" AND ");
    }

    const columnasValidas = ["fecha_de_publicacion", "puntuacion"];
    const criterioValido = columnasValidas.includes(criterio) ? criterio : "fecha_de_publicacion";

    query += ` ORDER BY obras.${criterioValido} ${orden}`;

    if (limite) {
      query += ` LIMIT $${idx}`;
      valores.push(limite);
    }

    const res = await dbPinguBooks.query(query, valores);
    return res.rows;
  } catch (error) {
    console.error("Error al filtrar obras:", error);
    return [];
  }
}

// Solo muestra las que coincidan con todos los filtros indicados (si hay).
// Permite ordenar por fecha o puntuación, de forma ascendente o descendente.
// Si se especifica un límite, lo aplica a la cantidad de resultados.
// Si no encuentra nada o hay error, devuelve un array vacío.
// ILIKE --> no es case-sensitive, es lo mismo ROMANTICO que romantico.


// TABLA TAGS

// Devuelve un tag si existe
async function getTag(nombre) {
  const res = await dbPinguBooks.query("SELECT * FROM tags WHERE nombre = $1", [nombre]);
  return res.rowCount === 0 ? undefined : res.rows[0];
}

// Devuelve todos los tags
async function getAllTags() {
  try {
    const res = await dbPinguBooks.query("SELECT * FROM tags");
    return res.rows;
  } catch (err) {
    console.error("Error al obtener tags:", err);
    return undefined;
  }
}

// Crea un tag nuevo
async function createTag(nombre, descripcion) {
  try {
    const res = await dbPinguBooks.query(
      "INSERT INTO tags (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [nombre, descripcion]
    );
    return res.rows[0];
  } catch (err) {
    console.error("Error al crear tag:", err);
    return undefined;
  }
}

// Modifica la descripción de un tag
async function modifyTag(nombre, descripcion) {
  try {
    const res = await dbPinguBooks.query(
      "UPDATE tags SET descripcion = $1 WHERE nombre = $2 RETURNING *;",
      [descripcion, nombre]
    );
    return res.rowCount === 0 ? undefined : res.rows[0];
  } catch (err) {
    console.error("Error al modificar tag:", err);
    return undefined;
  }
}

// Elimina un tag por su nombre
async function deleteTag(nombre) {
  try {
    const res = await dbPinguBooks.query("DELETE FROM tags WHERE nombre = $1 RETURNING *;", [nombre]);
    return res.rowCount === 0 ? undefined : res.rows[0];
  } catch (err) {
    console.error("Error al eliminar tag:", err);
    return undefined;
  }
}

// Devuelve todos los comentarios de una obra
async function getAllComentarios(idObra) {
  try {
    const res = await dbPinguBooks.query("SELECT * FROM comentarios WHERE id_obra = $1 ORDER BY fecha_de_publicacion desc", [idObra]);
    return res.rows;
  } catch(err){
    console.error("Error al conseguir comentarios: ", err);
    return undefined
  }
}

async function getComentario(idComentario){
  try{
    const res = await dbPinguBooks.query("SELECT * FROM comentarios WHERE id_comentarios = $1;", [idComentario]);
    return res.rows[0];
  } catch(err){
    console.error("Error al conseguir el comentario: ", err);
    return undefined;
  }
}

async function modifyObraRating(id_obra){
  try{
    const total = await dbPinguBooks.query(`
      SELECT count(*) AS cantidad, sum(c.estrellas) AS suma_estrellas
      FROM comentarios c
      WHERE id_obra = $1`, [id_obra]);
    const nuevo_tot_est = total.rows[0];
    const cantidad = parseInt(nuevo_tot_est.cantidad);
    const suma = parseInt(nuevo_tot_est.suma_estrellas);
    
    let promedio;
    if (cantidad == 0){
      promedio = 0
    } else{
      promedio = suma / cantidad
    }

    const res = await modifyObra(id_obra, null, null, null, null, null, null, promedio, null);
    if (res === undefined){
      return undefined;
    }
    return true;
  } catch {
    return undefined;
  }
}


async function createComentario(usuario, obra, estrellas, contenido){
  try{
    const res = await dbPinguBooks.query(`
      INSERT INTO comentarios (id_usuario, id_obra, estrellas, contenido_comentario)
      VALUES ($1, $2, $3, $4)
      RETURNING *;`, [usuario, obra, estrellas, contenido]);
    const modificacion = await modifyObraRating(obra);
    if (! modificacion){
      return undefined;
    }  
    return res.rows[0];
  } catch(err){
    console.error("Error al crear el comentario: ", err)
    return undefined;
  }
}


async function modifyComentario(id, contenido, estrellas){
  try{
    const res = await dbPinguBooks.query(`
      UPDATE comentarios
      SET contenido_comentario = COALESCE($2, contenido_comentario),
      estrellas = COALESCE($3, estrellas)
      WHERE id_comentarios = $1
      RETURNING *`, [id, contenido, estrellas]);
    const modificacion = await modifyObraRating(res.rows[0].id_obra);
    if (! modificacion){
      return undefined;
    }
    return res.rows[0];

  } catch(err){
    console.error("Error al modificar comentario", err);
    return undefined;
  }
}

async function deleteComentario(id){
  try{
    const res = await dbPinguBooks.query(`
    DELETE FROM comentarios WHERE id_comentarios = $1
    RETURNING *`, [id]);

    const modificacion = await modifyObraRating(res.rows[0].id_obra);
    if (! modificacion){
      return undefined;
    }  
    return res.rows[0];
  } catch(err) {
    console.error("Error al eliminar comentario:", err);
    return undefined;
  }
}

async function getComentarioOwner(id){
  try{
    const res = await getComentario(id);
    if (res === undefined){
      return undefined;
    }
    return res.id_usuario;
  } catch(err){
    console.error("error:", err);
    return undefined;
  }
}

async function getAllObrasByAutor(id_autor){
  try{
    const res = await dbPinguBooks.query("SELECT * FROM obras WHERE id_autor = $1 ORDER BY fecha_de_publicacion desc;", [id_autor]);
    return res.rows;
  }catch(err){
    console.error("Error al conseguir obras de autor:", err);
    return undefined;
  }
}

// EXPORTACION DE FUNCIONES
module.exports = {
  getAllAutores,
  createdUser,
  comparisonMail,
  changeUser,
  verifyUser, 
  getAutor,
  deleteAutor,
  modifyAutor,

  createObra,
  getAnObra,
  deleteObra,
  modifyObra,
  getAllObras,

  getTag,
  getAllTags,
  createTag,
  modifyTag,
  deleteTag,

  getAllComentarios,
  getComentario,
  createComentario,
  modifyComentario,
  deleteComentario,
  getComentarioOwner,

  getAllObrasByAutor
};
