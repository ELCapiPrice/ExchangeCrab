//MODELO USUARIO
/*
{
    nombre: 'asd',
    correo: 'chuz@gmail.com',
    password: '1232',
    img: '12e23',
    rol: '1231',
    estado: false,
    google: false
}
*/
const { Schema, model } = require('mongoose')

const UsuarioSchema = Schema({
    nombre: {
        type: 'String',
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: 'String',
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: 'String',
        required: [true, 'El correo es obligatorio'],
    },
    img: {
        type: 'String',
    },
    rol: {
        type: 'String',
        required: true,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE']
    },
    estado: {
        type: 'Boolean',
        default: true
    },
    google: {
        type: 'Boolean',
        default: false
    }

});

//NOTA DEBEMOS USAR UNA FUNCION NORMAL PORQUE VAMOS USAR THIS
//UNA UFUNCION DE FLECHA MANTIENE LO QUE APUNTA EL THIS FUERA DE LA MISMA 
// y aqui necesito que el this apunte a la la instancia creada 
UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject();

    usuario.uid = _id

    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);