const express =require("express");
const app = express();
const path =require("path");
//const {getAllPinguBooks, comparisonMail} =require(".../db/PinguBooks");
//const { createdUser } = require("./db/PiguBooks");
const port=3000;
app.use(express.json());


//Organizar de cada uno el de autor, comentario y obra (GET, POST, DELETE y PUT)
app.get("/", (req,res)=>{
  res.send("QUe onda viejo");
})
app.get("/inicio", (req,res)=>{
    res.send("QUe onda viejo");
})
/*
app.use(express.static(path.join(__dirname, 'public')));
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/prueba', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'aceptar_datos_backend.html'));
});*/

// CREAR PERFIL POST
app.post("/log-in",(req, res)=>{
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
 const userName = createdUser(name, biography, mail, dateBirthday, password, averageRatingWorks, dateLogIn, country);

})


app.listen(port, () => {
    console.log('No Los escuchooooo\n estamos listosss\n uhhhhhhh vive en el puerto ${port} 3000');
  });
