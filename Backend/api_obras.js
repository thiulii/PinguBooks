const express =require("express");
const app = express();
const port=3000;
app.use(express.json());

const {
    getAnObraById,
    esTag,
    getAllObras,
} = require("./PinguBooks")

app.get("/obras/:id", async(req, res) => {
  const id_obra = req.params.id;
  if (!id_obra || /[^0-9]/.test(id_obra)){
    return res.status(400).json({error:"Id ingresado incorrectamente"});
  }
  const response = await getAnObraById(id_obra);
  if (response === undefined){
    return res.status(404).send({error:"id no encontrado"});
  } 
  return res.json(response);
})

app.get("/obras", async(req, res) => {
    let order = req.query.order; //query param, al usar fetch se escribira "/obras?order=desc" va a ser o asc o desc
    if (!order){
        order = "asc";

    } else if (!["asc", "desc"].includes(order)){
        return res.status(400).json({error: "parametros incorrectos"});
    };

    const tags = req.query.tags;
    if (tags){
        tags = tags.split(",");
    }
    for (const tag of tags.split()){
        if (!esTag(tag)){
            return res.status(400).json({error: "parametros incorrectos"});
        }
    }

    const search = req.query.search;
    let by = req.query.by;
    if (!by){
        by = "fecha_de_publicacion";
    } else if (!["fecha_de_publicacion", "puntuacion"].includes(by)){
        return res.status(400).json({error: "parametros incorrectos"});
    }
    
    const response = await getAllObras(search, order, by, tags); //si no hay resultado no es un error, devuelve un array vacio
    if (response === undefined){
        return res.status(500).json({serverError: "ha ocurrido un error"})
    }
    return res.status(200).json(response)
})