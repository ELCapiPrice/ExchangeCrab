const { response } = require('express');
const bcrypt = require('bcryptjs');
//importamos express validator
const { check, oneOf, validationResult } = require('express-validator');

//importamos el modelo
const Usuario = require('../models/usuario')
const { cifrarPassword } = require('../helpers/db_validators')




const usuariosGet = async(req, res) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    //  const usuarios = await Usuario.find(query)
    //    .skip(Number(desde))
    //   .limit(Number(limite));

    //   const total = await Usuario.countDocuments(query);

    //obsevamos que tenemos dos await y como tal no dependen uno del otro entonces usamos Promusess.all

    //Promise.all ejcuta amabas de manera simultanea y funciona hasta que ambas funcionen

    //podemos usar una destructuracon de arreglos[]
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite)),
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPut = async(req, res) => {
    //el id es  el nnombre que dimos  en las rutas :id
    const id = req.params.id;

    //excluimos 
    const { _id, password, google, correo, ...resto } = req.body

    //TODO Validar ocntra base de datos 
    // no se esta actaulizado el correo
    if (password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)



    res.json(usuario)
}

const usuariosPost = async(req, res) => {



    const { nombre, correo, password, rol } = req.body;
    //Crea mos una isntacia de nuestro mdoelo 
    //const usuario = new Usuario(body);
    const usuario = new Usuario({ nombre, correo, password, rol });




    //Cifrar la constraseña 
    await cifrarPassword(usuario);

    // const salt = bcrypt.genSaltSync();
    //cifralo en una solo via
    //usuario.password = bcrypt.hashSync(password, salt);




    //grabar el resgitro en mongodb 
    await usuario.save();
    res.json({
        ok: true,
        msg: 'Post API-Controlador',
        usuario
    })
}

const usuariosDelete = async(req, res) => {

    const { id } = req.params;

    //Fsicamente lo borramos
    // No es recomendable porque perdemos la intgridad referencial
    //const usuario = await Usuario.findByIdAndDelete(id);

    //como pasa todo por refrencia puedo extrarer 
    //const uid = req.uid;


    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    const usuarioIdentificado = req.usuario;


    res.json({
        usuario,
        usuarioIdentificado
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosDelete,
    usuariosPost
}