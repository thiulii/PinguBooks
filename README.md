# PinguBooks
Si es la primera vez que levantas la pagina se debe descargar las dependencias necesarias para usar el proyecto, para eso sera necesario usar *npm install* en la terminal, y con ayuda del package.json se tendran todas disponibles.
Aparte, con ayuda del package.json existe el comando:
 *npm run dev* sirve para levantar el archivo api.js con nodemon, o sea se levante el proyecto y se actualice de forma automatica cualquier cambio que se realice
Ademas existe *npm start* que levanta el frontend con http server

## Makefile 
Tiene funciones/comandos para trabajar con el proyecto:
*run-backend* para iniciar todo el proceso de backend, que adentro tiene otras funciones que son start-bdd y start-backend
*start-bdd* va a la carpeta backend y con docker levanta la base de datos.
*stop-bdd* detiene la base de datos que estabamos usando
*start-backend* usa el comando del package.json *npm run dev* para levantar la api.js
*start-frontend* usa el comando de package.json *npm start*
*run-postgres* sirve para entras a postgres donde tenes la base de datos PinguBooks

## Importante
Mantener formato para que funcione, eso incluye las imagenes por default/ las cosas en la carpeta media y las de style 
Importante primero hacer start-bdd, run-postgres y copiar en database PinguBooks las tablas de db.sql.
Importante levantar en orden todo en el orden de primero la base de datos luego la api y por ultimo frontend, todo esto se puede hacer con los comandos de Makefile
Si falla algun puerto como el de la bdd para liberar el puerto puedes usar *sudo systemctl stop postgresql*
