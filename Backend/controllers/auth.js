const { response } = require('express');
const {User} = require('../models/User')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');



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


const create_user = async (req , res)=>{
    const {first_name , last_name , user_name, email , password }= req.body;
    let message = {messaje:"UPS! Problmas al crear usuario"}

    try{
        const user = await User.create ({

            id_unique: uuidv4(),
            user_name,
            first_name,
            last_name,
            password,
            email,
        })

        res.status(201).json({message:"Usuario Creado"})


    }catch(e){
        res.status(400).json(message);
        console.log(e)
    }

}


const helth_check= (req , res) =>{
    return res.status(200).json({
        msg: "Running"
    })
}
module.exports = {
    login,
    helth_check,
    create_user
}