const { usuariosGet, usuariosPut, usuariosDelete, usuariosPost } = require('../controllers/usuarios');
//expres validtaor es una gran coleccion de midlwares 
const { check } = require('express-validator');
const { Router } = require('express');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db_validators')
    //const { validarJWT } = require('../middlewares/validar-jswt')
    //const { validarCampos } = require('../middlewares/validar_campos')
    //const { esAdminRole, tieneRole } = require('../middlewares/validar-roles')

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares/index')


const router = Router();
router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'No es  un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut)

//el arguemento de en medio son los middlearews
router.post('/', [
    check('nombre', "El nombre es obligatorio").not().isEmpty(),
    check('password', "El password debe ser de mas de 6 caracteres").isLength({ min: 6 }),
    check('correo', "El correo no es valido").isEmail(),
    check('correo').custom(emailExiste),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    //check('rol').custom((rol) => esRolValido(rol)),
    //podemos ahorrarnos eso solo amndamos la refrencia de la funcion de
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost)

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es  un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete)


module.exports = router;