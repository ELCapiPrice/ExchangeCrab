const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {
    //leer los header
    const token = req.header('x-token');
    console.log(token);
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {

        const { uid } = jwt.verify(token, 'secretkey')

        //ller el usuario que corresponda al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            })
        }



        //si el usuario no ha sido eliminado por ende no puede logearse
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            })
        }

        req.usuario = usuario;
        next();

    } catch (err) {
        console.log(err);
        res.status(401).json({
            msg: 'Token no valido'
        })

    }




}


module.exports = {
    validarJWT
}