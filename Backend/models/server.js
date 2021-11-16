const express = require('express')
let usuarios = require('../routes/usuarios')
let auth = require('../routes/auth')
let cors = require('cors')
const { dbConnection } = require('../database/config.databases')

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth'

        //Conecta a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();

    }

    async conectarDB() {
        //aqui podemo conectar multimples conexion multimples
        //aqui solo hacemos una conexion
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use(cors());

        //json
        this.app.use(express.json());

        //Lectaura y parseo del body
        this.app.use(express.json());

        //Directorio Publico
        this.app.use(express.static('public'));
    }

    routes() {

        //otro tipo de middl configuramos el router
        this.app.use(this.authPath, auth)
        this.app.use(this.usuariosPath, usuarios);


    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en : ", this.port)
        })
    }

}

module.exports = Server;