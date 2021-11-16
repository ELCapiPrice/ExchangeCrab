const { response } = require('express');
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response) => {

    const { correo, password } = req.body;
    try {

        //Verificr si el email existe el
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / Password no son corretos"
            })
        }

        //Si el usuario esta activo para

        if (!usuario.estado) {

            return res.status(400).json({
                msg: 'Usuario / password no son correstco - false '
            })
        }


        //Verificar constraseña 
        const validaPasword = bcrypt.compareSync(password, usuario.password);

        if (!validaPasword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correstco - password erronea'
            })
        }


        //Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `Hable con el administrador`
        })
    }

}



const googleSignin = async(req, res) => {

    const { id_token } = req.body;
    try {
        const { correo, nombre, img } = await googleVerify(id_token)

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {

            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':D',
                img,
                google: true,
            }
            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario de DB

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el adminsitrador , usuario bloqueado'
            })
        }

        //Gnerar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })



    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es valdio'
        })
    }

}

module.exports = {
    login,
    googleSignin
}