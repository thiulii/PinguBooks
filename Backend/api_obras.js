const express =require("express");
const app = express();
const port=3000;
app.use(express.json());

const {
    getAnObra,
    getTag,
    getAllObras,
} = require("./PinguBooks")

app.get("/obras/:id", async(req, res) => {
  const id_obra = req.params.id;
  if (!id_obra || /[^0-9]/.test(id_obra)){
    return res.status(400).json({error:"Id ingresado incorrectamente"});
  }
  const response = await getAnObra(parseInt(id_obra));
  if (response === undefined){
    return res.status(404).send({error:"id no encontrado"});
  } 
  return res.json(response);
})

app.get("/obras", async(req, res) => {
    //usa query params, al usar fetch se escribira se podra especificar "order, tags (separados por comas), search, limit"
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
            if (!getTag(tag)){
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
    
    const limit = req.query.limit;
    if (!id_autor || /[^0-9]/.test(id_autor)){
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
            if (!getTag(tag)){
                return res.status(400).json({error: "tags incorrectos"});
            }
        }
    } else {
        tags = [];
    }
    const id_autor = parseInt(req.body.id_autor);
    const puntuacion = parseInt(req.body.puntuacion);
    const contenido = req.body.contenido;

    if (!titulo || isNaN(id_autor) || !descripcion || !contenido){
        return res.status(400).json({error: "Error al crear nueva obra, no se llenaron los datos obligatorios"})
    }
    if (puntuacion && (puntuacion>= 0 && puntuacion<=5)){
        return res.status(400).json({error: "puntuacion invalida"})
    }

    const obra = await createObra(titulo, portada, descripcion, tags, id_autor, puntuacion, contenido)
    if (!obra){
        return res.status(500).json({error: "error al crear la obra"})
    }
    return res.status(200).json({status: "OK"})
})