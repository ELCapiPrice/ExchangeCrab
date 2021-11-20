const Sequelize = require("sequelize");
const colors = require('colors');
require('dotenv').config({ path: '../dev.env' })

let sequelize;
try {
    sequelize = new Sequelize('exchange', 'admin', 'hola12345', {
        //host: process.env.HOST,
        host: 'exchange.cb3wuyiqo7gd.us-east-2.rds.amazonaws.com',
        dialect: 'mysql',
        port: 3306,
        ssl: true,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
          },
        
         
    });
    console.log("Conexion a la base de datos correcta".green);
} catch (e) {
    console.log("Problema en la conexion ".red + e);
}
module.exports = sequelize;