const express =require("express");
const app = express();
const port=3000;
app.use(express.json());
const {  getAllAutores,
    createdUser,
    comparisonMail,
    changeUser,
    verifyUser,
    getAutor,
    deleteAutor,
    modifyAutor
  } =require("./PinguBooks.js");

  app.get("/perfil/:id", async (req, res)=>{
    const id = Number(req.params.id);
    if(!id || isNaN(id)){
        return res.status(400).json({error: "error de id"}); 
    }
    console.log(id);
    try{
        
        console.log(id)
        const user = await getAutor(id);
    if(user===undefined){
        return  res.status(200).json({
            id_autor:null,
            mensaje:"Usuario no encontrado ¿Quiere iniciar seccion?",
            linkLogin: "../iniciar_sesion.html"
        }) //Envio el link para que vayan a ingresarse
    }
    return res.status(200).json(user); //envio el usuario para que se muestre por frontend
    }
    catch (error){
        console.error(id)
        return res.status(500).json({error: "error de servidor"});
    }
})

  // CREAR PERFIL POST
  app.post("/registro",(req, res)=>{
      const name =req.body.name;
      const biography = req.body.biography;
      const mail= req.body.mail;
      const dateBirthday = req.body.dateBirthday;
      const password= req.body.password; 
      const averageRatingWorks=req.body.averageRatingWorks;
      const dateLogIn=req.body.dateLogIn;
      const country=req.body.country;
      if((name===undefined) || (biography===undefined) || (mail===undefined) || (dateBirthday===undefined) || (password===undefined) ||(averageRatingWorks===undefined) || (dateLogIn===undefined) || (country===undefined)){
          return res.sendStatus(404).send("Error al crear usuario. Todos los campos deben estar llenos");
  }
      const validationMail = comparisonMail(mail);
      if(validationMail !== 0){
          return res.sendStatus(409).send("El mail otorgado ya esta en uso");
          }
   const userName = createdUser(name, biography, mail, dateBirthday, password, averageRatingWorks, dateLogIn, country);
   res.status(201).send("Se creo que usuario, puedes inicar seccion")
  })

  app.put("/log-in:id",(req, res)=>{
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
        //funcion que cambie valores del autor usando el id del autor
        res.status(200).send("Ya se actualizo los datos del usuario")
    }
)

app.delete("/perfil/:id", (req, res)=>{
    const idAutor = req.params.id
    //funcion eliminar comentarios del autor
    //funcion eliminar comentarios en las obras del autor
    //funcion eliminar obras
    //funcion eliminar autor
})

app.put("",(req, res)=>{

})

app.get("/catalogo/autores", ()=>{
    //funcion que mande a todos los autores con una obra en un array
})
app.listen(port, () => {
    console.log('No Los escuchooooo\n estamos listosss\n uhhhhhhh vive en el puerto ${port} 3000');
  });
