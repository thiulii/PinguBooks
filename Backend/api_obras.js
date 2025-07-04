const express =require("express");
const app = express();
const port=3000;
app.use(express.json());

const {
    getAnObra,
    getTag,
    getAllObras,
    createObra,
    getAutor,
    deleteObra,
    modifyObra,
    getAllTags,
    createTag,
    modifyTag,
    deleteTag,
} = require("./pingubooks")

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
    const id_autor = parseInt(req.body.id_autor);
    const puntuacion = parseFloat(req.body.puntuacion);
    const contenido = req.body.contenido;

    if (!titulo || isNaN(id_autor) || !descripcion || !contenido){
        return res.status(400).json({error: "Error al crear nueva obra, no se llenaron los datos obligatorios"});
    }

    if ((await getAutor(id_autor)) === undefined){
        return res.status(400).json({error: "autor invalido"});
    }

    if (!isNaN(puntuacion) && (puntuacion< 0 || puntuacion>5)){
        return res.status(400).json({error: "puntuacion invalida"});
    }

    const obra = await createObra(titulo, portada, descripcion, tags, id_autor, puntuacion, contenido)
    if (!obra){
        return res.status(500).json({error: "error al crear la obra"});
    }

    return res.status(200).json({status: "OK"});
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
    return res.status(200).json(tag);
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
    return res.status(200).json({status: "ok"})
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


app.listen(port, () => {
    console.log(`hola estamos en el puerto ${port}`);
  });
