const express =require("express");
const app = express();
const {getAllPinguBooks, comparisonMail} =require(".../db/PinguBooks");
const { createdUser } = require("./db/PiguBooks");
const port=3000;
app.use(express.json());


//Organizar de cada uno el de autor, comentario y obra (GET, POST, DELETE y PUT)

app.get("/inicio", (req,res)=>{
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

//EMPECEMOS POR PERFILES
//VER PERFIL
app.get("/perfil/num", (req,res)=>{
    const response = req.params.num;
})


// CREAR PERFIL POST
app.post("/",(req, res)=>{
    const name =req.body.name;
    const biography = req.body.biography;
    const mail= req.body.mail;
    const dateBirthday = req.body.dateBirthday;
    const password= req.body.password; 
    const averageRatingWorks=req.body.averageRatingWorks;
    const dateLogIn=req.body.dateBirthday;
    const country=req.body.country;
    if((name===undefined) || (biography===undefined) || (mail===undefined) || (dateBirthday===undefined) || (password===undefined) ||(averageRatingWorks===undefined) || (dateLogIn===undefined) || (country===undefined)){
        return res.sendStatus(404).send("Error al crear usuario. Todos los campos deben estar llenos");
}
    const validationMail = comparisonMail(mail);
    if(validationMail !== 0){
        return res.sendStatus(409).send("El mail otorgado ya esta en uso");
        }
 const userName = await createdUser(name, biography, mail, dateBirthday, password, averageRatingWorks, dateLogIn, country);

})

//crear obras
app.post("/",(req, res)=>{
const
})

//filtrar libros por sus tag
app.get("",(req, res)=>{

}
)
app.listen(port, () => {
    console.log('Server listen port 3000');
  });
  
}) 