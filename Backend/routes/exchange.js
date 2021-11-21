const express = require('express');
const router = express.Router();

const { getAllExchanges } = require('../controllers/exchange');


router.get('/exchange', getAllExchanges);


module.exports = router;




