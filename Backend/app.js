require('dotenv').config();
const Server = require('./server');


//hacemos la instacia
const server= new Server();
server.listen();
