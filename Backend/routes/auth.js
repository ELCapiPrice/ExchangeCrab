const { Router } = require('express');
const { check } = require('express-validator');
const { login, helth_check , create_user, login_render ,get_users ,data_user } = require('../controllers/auth')
    //custom middleware que obtiene los errores
const { validarCampos } = require('../middlewares/validar_campos')
const router = new Router();

router.get('/helth-check',  helth_check);

router.get('/login' , login_render);


router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login)

router.get('/get-users', get_users );
router.post('/create-user' , create_user);
router.get('/user/:email' , data_user);



module.exports = router;