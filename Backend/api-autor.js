const express =require("express");
const app = express();
const port=3000;
app.use(express.json());
const { getAllAutores,
    //user
    createdUser,
    
    verifyUser,
     comparisonMail,
  } =require("./PinguBooks.js");

  app.get("/perfil/:id",(req, res)=>{
//funcion que me pase toda la informacion del autor con solo su id y de una sus obras
    if(user===undefined){
        return  res.status(200).json({
            id_autor:null,
            mensaje:"Usuario no encontrado ¿Quiere inciar seccion?",
            linkLogin: "../registro.html"
        }) //Envio el link para que vayan a ingresarse
    }
    return res.status(200).json(user); //envio el usuario para que se muestre por frontend

})

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
   res.status(201).send("Se creo que usuaario, puedes inicar seccion")
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
    //funcion que mande a todos los autores en un array
})
app.listen(port, () => {
    console.log('No Los escuchooooo\n estamos listosss\n uhhhhhhh vive en el puerto ${port} 3000');
  });
