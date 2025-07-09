const express =require("express");
const app = express();
const cors = require("cors");
const port=3000;
app.use(express.json());
app.use(cors());

const {  getAllAutores,
  createdUser,
  comparisonMail,
  changeUser,
  getAutor,
  deleteAutor,
  modifyAutor,

  getAnObra,
  getAllObras,
  createObra,
  deleteObra,
  modifyObra,

  getTag,
  getAllTags,
  createTag,
  modifyTag,
  deleteTag,

  getAllComentarios,
  getComentario,
  createComentario,
  deleteComentario,
  modifyComentario,
  getComentarioOwner,

  getAllObrasByAutor
} =require("./PinguBooks.js");


//const { createdUser } = require("./db/PiguBooks");
//const path =require("path");

// SECCION AUTORES ------------------------------------------------------------

app.get("/autores/:autor/obras", async(req, res) => {
  const autor_id = parseInt(req.params.autor);
  if (isNaN(autor_id) || !(await getAutor(autor_id))){
    return res.status(400).json({error: "parametro de autor invalido"});
  }
  const response = await getAllObrasByAutor(autor_id);
  if (response === undefined){
    return res.status(500).json({error: "No se pudo conseguir las obras"});
  }
  return res.status(200).json(response);
})

app.get("/autores/:id", async (req, res)=>{
  const id = Number(req.params.id);
  if(!id || isNaN(id)){
      return res.status(400).json({error: "error de id"}); 
  }
  try{
      const user = await getAutor(id);
  if(user===undefined){
      return  res.status(404).json({
          id_autor:null,
          mensaje:"Usuario no encontrado ¿Quiere iniciar seccion?",
          linkLogin: "../iniciar_sesion.html"
      }) //Envio el link para que vayan a ingresarse
  }
  return res.status(200).json(user); //envio el usuario para que se muestre por frontend
  }
  catch (error){
      console.error("Error en getAutor o en el endpoint:", error);
      console.error(id)
      return res.status(500).json({error: "error de servidor aqui"});
  }
})
app.delete("/autores/:id", async (req, res)=>{
  const idAutor = req.params.id
  const user = await deleteAutor(idAutor);
  try{if(user===true){
      res.status(200).send("Se borro el usuario")
  }
  return  res.status(404).send("Problema al eliminar usuario")}
  catch (error){
    return res.status(500).json({error: "error de servidor /autores/:id delete"});
}
})
app.put("/autores/:id", async (req, res)=>{
  const id = req.params.id;
  const name =req.body.name;
  const biography = req.body.biography;
  const mail= req.body.mail;
  const dateBirthday = req.body.dateBirthday;
  const password= req.body.password; 
  const country=req.body.country;
  const photo = req.body.photo;
  if(!name ||!dateBirthday || !mail || !password ){
      return res.status(404).send("Error al cambiar datos del usuario. Son obligatorios los campos de: nombre, fecha de nacimiento, mail y contraseña");
  }
  const user = await modifyAutor(id, name, biography, dateBirthday, mail, password, country, photo );
  try{
    if(user===true){
        
      return res.status(200).send("Se cambio el usuario")
  }  
      return  res.status(404).send("Problema al cambiar datos del usuario")
  }  
  catch (error){
      return res.status(500).json({error: `error de servidor /api/iniciar_sesion/${id}`});
  }
})

// CREAR PERFIL POST
app.post("/autores",async (req, res)=>{
    console.log(req.body);
    const puntuacion=0;
    const fechaIngreso=new Date();
  const nombre =req.body.name;
  const biografia= req.body.biography;
  const mail= req.body.mail;
  const fechaNacimiento = req.body.dateBirthday;
  const contraseña= req.body.password; 
  const pais=req.body.country;
  let foto = req.body.foto_perfil;
  if(!nombre || !fechaNacimiento || !mail || !contraseña ){
        return res.status(404).send("Error al crear usuario. Todos los campos deben estar llenos");
  }
  const validationMail = await comparisonMail(mail);
  try{
      if(validationMail !== undefined){
      return res.status(409).send("El mail otorgado ya esta en uso"); 
      }
      if(!foto){
        foto="./media/pinguperfil.jpg";
      }
    const userName = await createdUser(nombre,  biografia, fechaNacimiento, mail, contraseña, puntuacion, fechaIngreso, pais, foto);
    return res.status(201).send("Se creo usuario, puedes inicar seccion")
         
  }
  catch (error){
      return res.status(500).json({error: "error de servidor /autores post"});
  }
})
app.post("/iniciar_sesion", async (req, res)=>{
  try{
  const mail= req.body.mail;
  const password= req.body.password; 

  if((mail===undefined) || (password===undefined)){
      return res.tatus(404).json({mensaje:"Error al crear ingresar en usuario. Todos los campos deben estar llenos"});
  }
  const verify = await changeUser(mail, password)
  if(verify===undefined){
      return res.status(401).json({mensaje:"Error al iniciar sesion"})
  }
  return res.status(200).json({usuario:verify, mensaje:"contraseña correcta"})
}
catch(error){
  return res.status(500).json({error: `error de servidor`});
}
}
)
app.get("/autores", async (req, res)=>{
  const autores= await getAllAutores()//funcion que mande a todos los autores con una obra en un array
  try{
      if(autores===undefined){
          autores=[];
      }
      res.status(200).send({autores});
  }
  catch (error){
      return res.status(500).json({error: `error de servidor catalogo autores`});
  }
})


// SECCION OBRAS ---------------------------------------------------------------
app.get("/obras/:id", async(req, res) => {
  const id_obra = parseInt(req.params.id);
  if (isNaN(id_obra)){
    return res.status(400).json({error:"Id ingresado incorrectamente"});
  }

  const response = await getAnObra(id_obra);
  if (response === undefined){
    return res.status(404).send({error:"id no encontrado"});
  } 
  return res.json(response);
})

app.get("/obras", async(req, res) => {
    //usa query params, al usar fetch se escribira se podra especificar "order, tags (separados por comas), search, by y limit"
    let order = req.query.order; 
    if (!order){
        order = "asc";

    } else if (!["asc", "desc"].includes(order)){
        return res.status(400).json({error: "parametros incorrectos"});
    };

    let tags = req.query.tags;
    if (tags){
        tags = tags.split(",");
        for (const tag of tags){
            if (! (await getTag(tag))){
                return res.status(400).json({error: "tags incorrectos"});
            }
        }
    } else {
        tags = [];
    }

    const search = req.query.search;
    let by = req.query.by;
    if (!by){
        by = "fecha_de_publicacion";
    } else if (!["fecha_de_publicacion", "puntuacion"].includes(by)){
        return res.status(400).json({error: "parametros incorrectos"});
    }
    
    const limit = parseInt(req.query.limit);
    if (!isNaN(limit) && limit <= 0){
      return res.status(400).json({error:"parametros incorrectos"});
    }

    const response = await getAllObras(search, order, by, tags, parseInt(limit)); //si no hay resultado no es un error, devuelve un array vacio
    if (response === undefined){
        return res.status(400).json({serverError: "ha ocurrido un error"});
    }

    return res.status(200).json(response);
})


app.post("/obras", async(req, res) => {
    // usa body de json
    const titulo = req.body.titulo;
    let portada = req.body.portada;
    const descripcion = req.body.descripcion;
    let tags = req.body.tags;
    if (tags){
        tags = tags.split(",");
        for (const tag of tags){
            if (!(await getTag(tag))){
                return res.status(400).json({error: "tags incorrectos"});
            }
        }
    } else {
        tags = [];
    }
    const id_autor = parseInt(req.body.id_autor);
    const puntuacion = parseFloat(req.body.puntuacion);
    const contenido = req.body.contenido;

    if(!portada){
        portada="./media/imagen_default.png";
      }
    if (!titulo || isNaN(id_autor) || !descripcion || !contenido){
        return res.status(400).json({error: "Error al crear nueva obra, no se llenaron los datos obligatorios"});
    }

    if ((await getAutor(id_autor)) === undefined){
        return res.status(400).json({error: "autor invalido"});
    }

    if (!isNaN(puntuacion) && (puntuacion< 0 || puntuacion>5)){
        return res.status(400).json({error: "puntuacion invalida"});
    }

    const obra = await createObra(titulo, portada, descripcion, tags, id_autor, contenido)
    if (!obra){
        return res.status(500).json({error: "error al crear la obra"});
    }

    return res.status(201).json({status: "OK"});
})

app.delete("/obras/:id", async(req, res) => {
    id = parseInt(req.params.id)
    if (isNaN(id)){
        return res.status(400).json({error: "id invalido"});
    } 
    const obra = await deleteObra(id)
    
    if (obra === undefined){
        return res.status(404).json({error: "id no encontrado"});
    }
    return res.status(200).json({status: "ok"})
})

app.delete("/obras", (req, res) => {
    return res.status(403).json({error: "no podes eliminar todas las obras"})
})

app.put("/obras/:id", async(req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || !(await getAnObra(id))){
        return res.status(400).json({error: "id invalido"});
    } 
    const titulo = req.body.titulo;
    const portada = req.body.portada;
    const descripcion = req.body.descripcion;
    let tags = req.body.tags;
    if (tags){
        tags = tags.split(",");
        for (const tag of tags){
            if (!(await getTag(tag))){
                return res.status(400).json({error: "tags incorrectos"});
            }
        }
    } else {
        tags = [];
    }
    const fecha = req.body.fecha;
    const id_autor = parseInt(req.body.id_autor);
    const puntuacion = parseFloat(req.body.puntuacion);
    const contenido = req.body.contenido;

    if (id_autor && (await getAutor(id_autor)) === undefined){
        return res.status(400).json({error: "autor invalido"});
    }

    if (!isNaN(puntuacion) && (puntuacion < 0 || puntuacion > 5)){
        return res.status(400).json({error: "puntuacion invalida"});
    }

    const obra = await modifyObra(id, titulo, portada, descripcion, tags, fecha, id_autor, puntuacion, contenido);
    if (!obra){
        return res.status(500).json({error: "error al modificar la obra"});
    }

    return res.status(200).json({status: "OK"});

})

app.put("/obras", (req, res) => {
    return res.status(403).json({error: "no podes modificar todas las obras"})
})

//SECCION TAGS ------------------------------------------------
app.get("/tags", async(req, res) => {
    const tags = await getAllTags()
    if (tags === undefined){
        return res.status(500).json({error: "algo fallo"});
    }
    return res.status(200).json(tags);
})

app.get("/tags/:tag", async(req, res) =>{
    const tag = req.params.tag;
    const response = await getTag(tag);

    if (response === undefined) {
        return res.status(404).json({error: "no se ha encontrado el tag"});
    }
    return res.status(200).json(response);
})

app.post("/tags", async(req,res) => {
    const tag = req.body.tag;
    const desc = req.body.desc;
    if (!tag){
        return res.status(400).json({error: "no se especifico tag"});
    }

    const response = await createTag(tag, desc);
    if (response === undefined){
        return res.status(500).json({error: "no se pudo crear el tag"});
    }
    return res.status(201).json({status: "ok"})
})

app.delete("/tags/:tag", async(req, res) => {
    const tag = req.params.tag;

    const response = await deleteTag(tag);
    if (!response){
        return res.status(500).json({error: "no se pudo eliminar el tag"});
    }
    return res.status(200).json({status: "ok"})
})

app.put("/tags/:tag", async(req, res) => {
    const tag = req.params.tag;
    const desc = req.body.desc;
    if (!tag || !desc || !(await getTag(tag))){
        return res.status(400).json({error: "parametros incorrectos"});
    }

    const response = await modifyTag(tag, desc);
    if (!response){
        return res.status(500).json({error: "no se pudo modificar el tag"});
    }
    return res.status(200).json({status: "ok"})
})

app.delete("/tags", (req, res) => {
    return res.status(403).json({error: "no podes eliminar todos los tags"})
})

app.put("/tags", (req, res) => {
    return res.status(403).json({error: "no podes modificar todos los tags"})
})

// SECCION COMENTARIOS ---------------------------------------------

// Muestra todos los comentarios de una obra
app.get("/comentarios/:id_obra", async (req, res) => {
  const id = parseInt(req.params.id_obra);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const comentarios = await getAllComentarios(id);
  return res.status(200).json(comentarios);
});

// Crear un comentario
app.post("/comentarios", async (req, res) => {
  const { id_usuario, id_obra, estrellas, contenido } = req.body;

  if (!id_usuario) {
    return res.redirect("/iniciar_sesion.html");
  }

  if (!contenido || isNaN(id_obra) || isNaN(estrellas) || estrellas < 0 || estrellas > 5) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const usuario = await getAutor(id_usuario);
  if (!usuario) return res.status(400).json({ error: "Usuario no válido" });

  const comentario = await createComentario(id_usuario, id_obra, estrellas, contenido);
  if (!comentario) return res.status(500).json({ error: "Error al crear comentario" });

  return res.status(201).json({ status: "OK", comentario });
});

// Editar un comentario
app.put("/comentarios/:id_comentario", async (req, res) => {
  const id_comentario = parseInt(req.params.id_comentario);
  const { id_usuario, contenido, estrellas } = req.body;

  if (!id_usuario) return res.redirect("/iniciar_sesion.html");
  if (!contenido || isNaN(estrellas) || estrellas < 0 || estrellas > 5) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const autorComentario = await getComentarioOwner(id_comentario);
  if (!autorComentario || autorComentario.id_usuario !== id_usuario) {
    return res.status(403).json({ error: "No tenés permiso para modificar este comentario" });
  }

  const modificado = await modifyComentario(id_comentario, contenido, estrellas);
  if (!modificado) return res.status(500).json({ error: "Error al modificar comentario" });

  return res.status(200).json({ status: "OK" });
});

// Borrar un comentario
app.delete("/comentarios/:id_comentario", async (req, res) => {
  const id_comentario = parseInt(req.params.id_comentario);
  const { id_usuario } = req.body;

  if (!id_usuario) return res.redirect("/iniciar_sesion.html");

  const autorComentario = await getComentarioOwner(id_comentario);
  if (!autorComentario || autorComentario.id_usuario !== id_usuario) {
    return res.status(403).json({ error: "No tenés permiso para borrar este comentario" });
  }

  const borrado = await deleteComentario(id_comentario);
  if (!borrado) return res.status(500).json({ error: "Error al eliminar comentario" });

  return res.status(200).json({ status: "OK" });
});

// Evita borrar todos
app.delete("/comentarios", (req, res) => {
  return res.status(403).json({ error: "No podés eliminar todos los comentarios" });
});

// Evita modificar todos
app.put("/comentarios", (req, res) => {
  return res.status(403).json({ error: "No podés modificar todos los comentarios" });
});


app.get("/", (req, res) => {
    return res.status(400).json({ error: "No especificaste endpoint" });
  });

app.post("/", (req, res) => {
    return res.status(400).json({ error: "No especificaste endpoint" });
});

app.delete("/", (req, res) => {
    return res.status(400).json({ error: "No especificaste endpoint" });
  });

app.put("/", (req, res) => {
    return res.status(400).json({ error: "No especificaste endpoint" });
  });

app.listen(port, () => {
    console.log(`No Los escuchooooo\n estamos listosss\n uhhhhhhh vive en el puerto ${port}`);
  });
