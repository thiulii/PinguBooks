const express = require("express");
const app = express();
const port = 3001; // otro puerto para no chocar con obras y autores
app.use(express.json());

const {                    // dejo todas las funciones que voy a necesitar
  getAllComentarios,
  getComentario,
  createComentario,
  deleteComentario,
  modifyComentario,
  getComentarioOwner,
  getUsuario
} = require("./pingubooks");

// Muestra todos los comentarios de una obra
app.get("/comentarios/:id_obra", async (req, res) => {
  const id = parseInt(req.params.id_obra);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const comentarios = await getAllComentarios(id);
  return res.status(200).json(comentarios);
});

