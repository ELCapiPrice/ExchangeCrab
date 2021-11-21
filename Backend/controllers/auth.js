const { response } = require('express');
const {User} = require('../models/User')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const  path = require('path');
const {generarJWT} = require('../helpers/generarJWT')


const login_render =(req , res)=>{
    res.sendFile(path.join(__dirname, '../../frontend/auth.html'));
}



const login = async(req, res = response) => {

    const { email, password } = req.body;
    console.log(email , password)
    try {

        //Verificr si el email existe el
        const usuario = await User.findOne({ where: {email} });

        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / Password no son corretos"
            })
        }

        //Si el usuario esta activo para

        if (!usuario.is_active) {

            return res.status(400).json({
                msg: 'Su cuenta esta suspendida, contacte al admnistrador'
            })
        }


        //Verificar constraseña 
        const validaPasword = bcrypt.compareSync(password, usuario.password);

        if (!validaPasword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos'
            })
        }

        delete usuario
        delete password
        delete email


        //Generar el JWT
        //const token = await generarJWT(usuario.id);
       const token = await generarJWT(usuario.dataValues.id_unique, usuario.dataValues.email);
       return  res.cookie("token",token).status(202).json({
            msg : "OK"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: `UPS, Hable con el administrador`
        })
    }

}






const create_user = async (req , res)=>{

    /* 
         this.email=email;
        this.username=username;
        this.name=name;
        this.lastname=lastname;
        this.password=password;
    */

    const {email , username , firstname , lastname , password}= req.body;
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
            email,
            firstname,
            username,
            lastname,
            password:password_cifrada,
        })

        delete user;
        delete password_cifrada;

        return res.status(201).json({message:"OK"});
        
        }else {

        return res.status(400).json({message:"Usuario ya registrado"});

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
    create_user,
    login_render
}