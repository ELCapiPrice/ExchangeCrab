const { response } = require('express');
const {User} = require('../models/User')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');



const login = async(req, res = response) => {

    const { email, password } = req.body;
    console.log(email , password)
    try {

        //Verificr si el email existe el
        const usuario = await User.findOne({ where: {email} });

        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / Password no son corretos - user not foud"
            })
        }

        //Si el usuario esta activo para

        if (!usuario.is_active) {

            return res.status(400).json({
                msg: 'Su cuenta esta suspendida, contacte al admnistrador- user deleted'
            })
        }


        //Verificar constraseña 
        const validaPasword = bcrypt.compareSync(password, usuario.password);

        if (!validaPasword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password wrong'
            })
        }


        //Generar el JWT
        //const token = await generarJWT(usuario.id);


       return  res.status(200).json({
            message : "Incio de sesion exitoso"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `UPS, Hable con el administrador`
        })
    }

}


const create_user = async (req , res)=>{
    const {first_name , last_name , user_name, email , password }= req.body;
    //Message by default
    let message = {messaje:"UPS! Problmas al crear usuario"}

    try{

        const user_exist= await User.findOne({
            where: {email}
        });

        if (!user_exist){
            //Ciframos
        const password_cifrada= await bcrypt.hash(password,10)

        const user = await User.create ({
            id_unique: uuidv4(),
            user_name,
            first_name,
            last_name,
            password:password_cifrada,
            email,
        })

        delete user;
        delete password_cifrada;

        return res.status(201).json({message:"Usuario Creado"});
        
        }else {

        return res.status(400).json({message:"El usuario ya tiene cuenta ligada a ese email"});

        }
         

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