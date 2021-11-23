const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar_campos')

const { getExchangeByKey,
  createNewExchange,
  getExchangesByUserId,
  inviteParticipantByEmail,
  deleteExchangeById,
  joinExchangeByKey,
  changeStatusOfParticipation,
  deleteUserFromExchange,
  editExchangeById,
  forceStartExchange } = require('../controllers/exchange');


router.get('/exchange/key/:key', getExchangeByKey);
router.get('/exchange/user/:id', getExchangesByUserId);

router.get('/exchange/force/:idExchange', forceStartExchange);

router.post('/exchange/invite', inviteParticipantByEmail);

router.post('/exchange/status', changeStatusOfParticipation);

router.post('/exchange/join', joinExchangeByKey);

router.delete('/exchange/delete', deleteExchangeById);

router.put('/exchange/edit', editExchangeById);

router.delete('/exchange/user/delete', deleteUserFromExchange);

router.post('/exchange',
  check('key', 'La clave del intercambio es obligatoria.').not().isEmpty(),
  check('topics', 'Al menos 1 tema es obligatorio.').not().isEmpty(),
  check('maxValue', 'Debes especificar el valor máximo del valor del regalo.').not().isEmpty(),
  check('limitDate', 'Debes establecer una fecha límite para registrarse en el intercambio.').not().isEmpty(),
  check('date', 'Debes establecer la fecha de realizacion del intercambio').not().isEmpty(),
  check('owner', 'No se especifico el dueño del intercambio').not().isEmpty(),
  validarCampos,
  createNewExchange);


module.exports = router;




