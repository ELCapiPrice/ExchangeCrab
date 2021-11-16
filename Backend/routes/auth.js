const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin ,  helth_check} = require('../controllers/auth')
    //custom middleware que obtiene los errores
const { validarCampos } = require('../middlewares/validar_campos')
const router = new Router();

router.get('/helth-check',  helth_check);


router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login)

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin)





module.exports = router;