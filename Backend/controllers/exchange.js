
//const { obtainAllExchanges } = require('../models/exchange');

const { Exchange } = require('../models/exchange');
const { Topic } = require('../models/topic');
const { Participant } = require('../models/participant');
const { User } = require('../models/user');

const createNewExchange = async (req, res) => {
  let { key, topics, maxValue, limitDate, date, owner, ownerParticipate, comments } = req.body;
  /*console.log(key);
  console.log(topics);
  console.log(maxValue);
  console.log(limitDate);
  console.log(date);
  console.log(owner);
  console.log(ownerParticipate);
  console.log(comments);*/

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
    return res.status(401).json({ error: "Error al crear el intercambio"});
  }
  return res.status(200).json({ msg: "Se creo el intercambio correctamente"});
}

const getExchangeByKey = async (req, res) => {
  const key = req.params.key;

  try {
    const exchange = await Exchange.findOne({
      where: {
        key
      }
    });
    if(exchange === null) return res.status(401).json({ error: "No existe un intercambio con esa clave"});
    /* Obtenemos los participantes del intercambio */
    const participants = await Participant.findAll({
      where: {
        id_exchange: exchange.id_exchange
      }
    });
    /* Obtenemos los temas del intercambio */
    const topics = await Topic.findAll({
      where: {
        id_exchange: exchange.id_exchange
      }
    });
    const data = {
      exchange,
      participants,
      topics
    }
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al obtener los intercambios por su clave"});
  }
}

const getExchangesByUserId = async (req, res) => {
  const id = req.params.id;

  try {
    const exchange = await Exchange.findAll({
      where: {
        owner: id
      }
    });

    const participants = await Participant.findAll({
      where: {
        id_user: id
      }
    });

    const data = {
      exchange,
      participants
    }

    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al obtener los intercambios de el usuario por su ID"});
  }
}

const inviteParticipantByEmail = async (req, res) => {
  const { email, exchangeId } = req.body;

  try {
    /* Buscamos al usuario por su correo */
    const user = await User.findOne({
      where: {
        email
      }
    });
    if(user === null) return res.status(400).json({error: "El usuario no se encuentra registrado"});

    /* Invitamos al participante a participar */
    const participant = await Participant.create({
      id_exchange: exchangeId,
      id_user: user.id_user,
    });
    /* TODO Enviar mensaje por correo electronico de que recibio una nueva invitacion */


    return res.status(200).json({ msg: "Se invito al usuario a participar "});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al invitar al usuario"});
  }
}


module.exports = {
  getExchangeByKey,
  createNewExchange,
  getExchangesByUserId,
  inviteParticipantByEmail
}




/*
const getAllExchanges = function () {

}
 */