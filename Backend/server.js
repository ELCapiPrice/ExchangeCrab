const express = require('express')

let auth = require('./routes/auth')
let exchange = require('./routes/exchange')
let cors = require('cors')
const sequelize = require('./database/config.databases')
const {User} = require('./models/User')
const { Exchange } = require('./models/Exchange')
const { Topic } = require('./models/Topic')
const { Participant } = require('./models/Participant')
const {Friendship} = require('./models/Friendship')
const cookieParser = require('cookie-parser');

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.authPath = '/api'

        //Conecta a base de datos
          this.connectDB();

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

    async connectDB() {
        try {
            await sequelize.authenticate();
            console.log('Conexion con la base de datos establecida'.green);

            await Promise.all([User.sync(), Exchange.sync(), Topic.sync(), Participant.sync(), Friendship.sync() ]).then(()=> {
                console.log("Modelos Creados");
            }).catch(err=>{
                console.log("ERROR: " , err);
            })

            /*
            await Promise.all([User.sync(), Comment.sync(), Friendship.sync(), Chat.sync()]).then(() => {
                User.hasMany(Comment, { as: 'Comments', foreignKey: 'id_comment' });
                Comment.belongsTo(User, { foreignKey: 'id_user' });
                User.hasMany(Friendship, { foreignKey: 'id_friendship' });
                Friendship.belongsTo(User, { foreignKey: 'id_user' });
                //User.belongsTo(Friendship, { foreignKey: 'id_friendship' });

            }).catch(err => {
                console.log(err);
            })
            */
           // console.log("Todos los modelos fueron sincronizados correctamente".green);
        } catch (error) {
            console.error('Problema al conectrase o al sicronizar modelos'.red, error);
        }

    }


    middlewares() {

        //CORS
        this.app.use(cors());

        //json //Lectaura y parseo del body
        this.app.use(express.json());

        
        this.app.use(express.urlencoded({ extended: true }));

        //Directorio Publico
        this.app.use(express.static('public'));

        this.app.use(cookieParser());
    }

    routes() {

        //otro tipo de middl configuramos el router
        this.app.use(this.authPath, auth)
        this.app.use(this.authPath, exchange)



    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en : ", this.port)
        })
    }

}

module.exports = Server;