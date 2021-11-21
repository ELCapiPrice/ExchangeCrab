
//const { obtainAllExchanges } = require('../models/exchange');

const { Exchange } = require('../models/exchange');
const { Topic } = require('../models/topic');
const { Participant } = require('../models/participant');

const createNewExchange = async (req, res) => {
  let { key, topics, maxValue, limitDate, date, owner, ownerParticipate, comments } = req.body;
  console.log(key);
  console.log(topics);
  console.log(maxValue);
  console.log(limitDate);
  console.log(date);
  console.log(owner);
  console.log(ownerParticipate);
  console.log(comments);

  //Obtenemos una lista de los temas
  topics = topics.replaceAll(' ', '').split(',');

  try {
    /* TODO Verificar que la clave de intercambio no exista */

    /* Creamos el intercambio */
    const exchange = await Exchange.create({
      key,
      maxValue,
      limitDate,
      date,
      comments,
      owner
    });
    console.log(exchange);
    const idExchange = exchange.dataValues.id_exchange;

    /* Agregamos los temas que agrego el dueño (Unicamente 3)*/
    for (let i = 0; i < topics.length ; i++){
      const topic = await Topic.create({
        topic: topics[i],
        id_exchange: idExchange
      });
      if(i === 3) break;
    }

    /* Si el dueño tambien participa entonces lo agregamos */
    if(ownerParticipate){
      const participant = await Participant.create({
        topic: topics[0], //Le asignamos el primer tema por default. Luego lo puede cambiar
        id_exchange: idExchange, //ID del intercambio
        id_user: owner, //ID del usuario
        status: 1 //Estado aceptado
      });
    }

  } catch (e) {
    console.log(e);
  }


  res.status(200).json('Ok');
}






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
  getAllExchanges,
  createNewExchange
}




/*
const getAllExchanges = function () {

}
 */