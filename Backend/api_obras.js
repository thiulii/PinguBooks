const express =require("express");
const app = express();
const port=3000;
app.use(express.json());

const {
    getAnObraById,
} = require("./PinguBooks")

app.get("/obras/:id", async(req, res) => {
  const id_obra = req.params.id;
  if (!id_obra || /[^0-9]/.test(id_obra)){
    return res.status(400).send("Id ingresado incorrectamente");
  }
  const response = await getAnObraById(id_obra);
  if (response === undefined){
    return res.status(404).send("id no encontrado");
  } 
  return res.status(200).json(response);
})