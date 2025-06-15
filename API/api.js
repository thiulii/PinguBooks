const express =require("express");
const app = express();
const {getAllPinguBooks} =require(".../db/PinguBooks");
const port=3000;
app.use(express.json());

//Organizar de cada uno el de autor, comentario y obra (GET, POST, DELETE y PUT)

app.get("/", (req,res)=>{
    res.send("");
})

//GET
app.get( "", (req, res)=>{
    const pingu = getAllPinguBooks();
    res.json(pingu);
})


app.get( "", (req, res)=>{
    const pingu =getPingu(req.params.id)
if(pingu===undefined){
    return res.sendStatus(400).send("Error al hacer tal cosa");
    }
    req.param.;
    res.json();
}

)
//POST
//409 es para cuando ya existe el id, etc
app.post( "", (req, res)=>{
    if(===undefined){
return res.sendStatus(400).send("Error al hacer tal cosa");
}

res.status(201).send("Se hizo con exito");


//DELETE
app.delete( "", (req, res)=>{
    if(===undefined){
        return res.sendStatus(404).send("Error al hacer tal cosa");
}

})

//PUT o pacth
app.put("", (req, res)=>{}

)
app.listen(port, () => {
    console.log('Server listen port 3000');
  });
  
})