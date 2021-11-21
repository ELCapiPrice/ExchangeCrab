
//const { obtainAllExchanges } = require('../models/exchange');


const getAllExchanges = (req, res) => {
  //const value = obtainAllExchanges(); //Esta funcion estara definida en la DB
  const data = [
    {
      'id': 23,
      'owner': 'Praxedes',
      'limitDate': '23/02/20',
      'tema': 'Dulces'
    },
    {
      'id': 25,
      'owner': 'Praxedes',
      'limitDate': '23/02/20',
      'tema': 'Dulces'
    }
  ];

  res.status(200).json(data);

}



module.exports = {
  getAllExchanges
}




/*
const getAllExchanges = function () {

}
 */