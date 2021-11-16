const mongoose = require('mongoose');

const dbConnection = async() => {

    //siemre usar trycath en conexiones en general usar try

    try {
        //await porque regresa una promesa
        await mongoose.connect(process.env.MONGO_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("Base de datos online");

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos')
    }



}



module.exports = {
    dbConnection
}