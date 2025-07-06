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

// Crear un comentario
app.post("/comentarios", async (req, res) => {
  const { id_usuario, id_obra, estrellas, contenido } = req.body;

  if (!id_usuario) {
    return res.redirect("/inicio_sesion.html");
  }

  if (!contenido || isNaN(id_obra) || isNaN(estrellas) || estrellas < 0 || estrellas > 5) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const usuario = await getUsuario(id_usuario);
  if (!usuario) return res.status(400).json({ error: "Usuario no válido" });

  const comentario = await createComentario(id_usuario, id_obra, estrellas, contenido);
  if (!comentario) return res.status(500).json({ error: "Error al crear comentario" });

  return res.status(200).json({ status: "OK", comentario });
});

// Editar un comentario
app.put("/comentarios/:id_comentario", async (req, res) => {
  const id_comentario = parseInt(req.params.id_comentario);
  const { id_usuario, contenido, estrellas } = req.body;

  if (!id_usuario) return res.redirect("/inicion_sesion.html");
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

  if (!id_usuario) return res.redirect("/inicion_sesion.html");

  const autorComentario = await getComentarioOwner(id_comentario);
  if (!autorComentario || autorComentario.id_usuario !== id_usuario) {
    return res.status(403).json({ error: "No tenés permiso para borrar este comentario" });
  }

  const borrado = await deleteComentario(id_comentario);
  if (!borrado) return res.status(500).json({ error: "Error al eliminar comentario" });

  return res.status(200).json({ status: "OK" });
});

