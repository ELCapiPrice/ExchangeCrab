//importamos mi schema 
const Role = require('../models/role')
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El ${rol} no esta registrado en la base da datos`)
    }

}

const emailExiste = async(correo = '') => {
    console.log(typeof correo);
    const existeEmail = await Usuario.findOne({ 'correo': correo })
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya esta registardo`)
    }
}



const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);

    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`)
    }
}




//esto es un afuncion pero corregir los de put 
const cifrarPassword = async(usuario = "", password = "") => {
    const salt = bcrypt.genSaltSync();
    if (usuario !== "") {
        usuario.password = bcrypt.hashSync(usuario.password, salt);
    } else {
        password = bcrypt.hashSync(password, salt);
    }
}



module.exports = {
    esRolValido,
    emailExiste,
    cifrarPassword,
    existeUsuarioPorId
}