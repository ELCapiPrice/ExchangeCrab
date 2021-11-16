const validarJWT = require('../middlewares/validar-jswt')
const validarCampos = require('../middlewares/validar_campos')
const validaRoles = require('../middlewares/validar-roles')


module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles
}