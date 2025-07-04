DROP TABLE IF EXISTS autores CASCADE;          -- este cascade es para que se pueda eliminar por cascada, lo que seria que borrando un autor tambien se borren sus obras...
CREATE TABLE autores (
    id_autor SERIAL PRIMARY KEY, 
    nombre VARCHAR(100), 
    biografia VARCHAR(1000), 
    fecha_de_nacimiento DATE,
    mail VARCHAR(100) UNIQUE NOT NULL, 
    contraseña VARCHAR(100) NOT NULL, 
    puntuacion_promedio_de_obras INT DEFAULT 0, 
    fecha_ingreso DATE DEFAULT CURRENT_DATE, 
    pais VARCHAR(50), 
    foto_perfil VARCHA
);

DROP TABLE IF EXISTS obras CASCADE;
CREATE TABLE obras (
    id_obras SERIAL PRIMARY KEY, 
    titulo VARCHAR(200) NOT NULL, 
    portada VARCHAR,
    descripcion VARCHAR(1000) NOT NULL, 
    id_autor INT NOT NULL REFERENCES autores(id_autor) ON DELETE CASCADE,
    fecha_de_publicacion DATE DEFAULT CURRENT_DATE,
    puntuacion FLOAT DEFAULT 0 CHECK (puntuacion >= 0 AND puntuacion <= 5),
    contenido TEXT NOT NULL
);

DROP TABLE IF EXISTS comentarios CASCADE;
CREATE TABLE comentarios (
    id_comentarios SERIAL PRIMARY KEY, 
    id_usuario INT REFERENCES autores(id_autor) ON DELETE CASCADE, 
    id_obra INT REFERENCES obras(id_obras) ON DELETE CASCADE,
    estrellas INT NOT NULL CHECK (estrellas >= 0 AND estrellas <= 5), 
    fecha_de_publicacion DATE DEFAULT CURRENT_DATE, 
    contenido_comentario VARCHAR(500)
);

DROP TABLE IF EXISTS tags CASCADE;
CREATE TABLE tags (
    nombre VARCHAR PRIMARY KEY,
    descripcion VARCHAR
);

-- NO ES UNA TABLA, SOLO ES PARA PODER RELACIONAR LAS OBRAS CON SUS TAGS
DROP TABLE IF EXISTS obra_tag CASCADE;
CREATE TABLE obra_tag (
    id_obra INT REFERENCES obras(id_obras) ON DELETE CASCADE,
    nombre_tag VARCHAR REFERENCES tags(nombre) ON DELETE CASCADE,
    PRIMARY KEY (id_obra, nombre_tag)
);