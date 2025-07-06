const express =require("express");
const app = express();
const cors = require("cors");
const port=3000;
const path = require("path")
app.use(express.json());
app.use(cors());
const {  getAllAutores,
    createdUser,
    comparisonMail,
    changeUser,
    getAutor,
    deleteAutor,
    modifyAutor
  } =require("./PinguBooks.js");

app.get("/",(req, res)=>{
    console.log("Hola");
})

app.get("/api/perfil/id", async (req, res)=>{
    const id = Number(req.params.id);
    if(!id || isNaN(id)){
        return res.status(400).json({error: "error de id"}); 
    }
    try{
        console.log(id)
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
app.delete("/perfil/id", (req, res)=>{
    const idAutor = req.params.id
    const user =deleteAutor(idAutor);
    if(user===true){
        res.status(200).send("Se borro el usuario")
    }
    return  res.status(404).send("Problema al eliminar usuario")
})
app.put("/api/inciar_sesion/id", async (req, res)=>{
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
  app.post("/api/registro",async (req, res)=>{
    const name =req.body.name;
    const biography = req.body.biography;
    const mail= req.body.mail;
    const dateBirthday = req.body.dateBirthday;
    const password= req.body.password; 
    const averageRatingWorks=req.body.averageRatingWorks;
    const dateLogIn=req.body.dateLogIn;
    const country=req.body.country;
    if(!name || !dateBirthday || !mail || !password ){
          return res.sendStatus(404).send("Error al crear usuario. Todos los campos deben estar llenos");
    }
    const validationMail = await comparisonMail(mail);
    try{
        if(validationMail !== 0){
        return res.status(409).send("El mail otorgado ya esta en uso"); 
        }
        const userName = await createdUser(name, biography, dateBirthday, mail, password, averageRatingWorks, dateLogIn, country);
        try{
            return res.status(201).send("Se creo que usuario, puedes inicar seccion")
            }
        catch (error){
            return res.status(500).json({error: "error de servidor /api/registro en createdUser"});
        }
    }
    catch (error){
        return res.status(500).json({error: "error de servidor /api/registro en comparisonMail"});
    }
  
})

  
app.post("/api/inciar_sesion", async (req, res)=>{
    const mail= req.body.mail;
    const password= req.body.password; 

    if((mail===undefined) || (password===undefined)){
        return res.sendStatus(404).send("Error al crear ingresar en usuario. Todos los campos deben estar llenos");
    }
    const verify = await changeUser(mail, password)
    if(verify===undefined){
        return res.status(401).send("contraseña incorrecta")
    }
    return res.status(200).json({usuario:verify, mensaje:"contraseña correcta"})
}
)

app.get("/api/catalogo/autores", async (req, res)=>{
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
app.listen(port, () => {
    console.log('No Los escuchooooo\n estamos listosss\n uhhhhhhh vive en el puerto ${port} 3000');
  });
