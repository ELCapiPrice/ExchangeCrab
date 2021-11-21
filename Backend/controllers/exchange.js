
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
        key,
        active: true
      }
    });
    if(exchange === null) return res.status(401).json({ error: "No existe un intercambio con esa clave"});
    /* Obtenemos los participantes del intercambio */
    const participants = await Participant.findAll({
      where: {
        id_exchange: exchange.id_exchange,
        active: true
      }
    });
    /* Obtenemos los temas del intercambio */
    const topics = await Topic.findAll({
      where: {
        id_exchange: exchange.id_exchange,
        active: true
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
        owner: id,
        active: true
      }
    });

    const participants = await Participant.findAll({
      where: {
        id_user: id,
        active: true
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

  /* TODO Revisar si el usuario ya fue invitado */

  try {
    /* Buscamos al usuario por su correo */
    const user = await User.findOne({
      where: {
        email,
        active: true
      }
    });
    if(user === null) return res.status(400).json({error: "El usuario no se encuentra registrado"});

    /* Invitamos al participante a participar */
    const participant = await Participant.create({
      id_exchange: exchangeId,
      id_user: user.id_user,
    });
    /* TODO Enviar mensaje por correo electronico de que recibio una nueva invitacion */


    return res.status(200).json({ msg: "Se invito al usuario a participar."});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al invitar al usuario"});
  }
}

const deleteExchangeById = async (req, res) => {
  const idExchange = req.body.idExchange;

  try {
    /* Borramos logicamente el intercambio */
    const exchange = await Exchange.update({
      active: false
    }, {
      where: {
        id_exchange: idExchange
      }
    });
    /* Borramos logicamente los participantes del intercambio */
    const participant = await Participant.update({
      active: false
    }, {
      where: {
        id_exchange: idExchange
      }
    });
    /* Borramos logicamente los temas del intercambio */
    const topic = await Topic.update({
      active: false
    }, {
      where: {
        id_exchange: idExchange
      }
    });
    return res.status(200).json({ msg: "Se borro el intercambio correctamente."});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al borrar el intercambio"});
  }
}

const joinExchangeByKey = async (req, res) => {
  const { key, topic, idUser } = req.body;

  try {
    /* Obtenemos la informacion del intercambio */
    const exchange = await Exchange.findOne({
      where: {
        key,
        active: true
      }
    });
    if(!exchange) return res.status(400).json({error: "Error, el código de intercambio no existe!"});

    /* Unimos al usuario al intercambio */
    const participant = await Participant.create({
      topic,
      id_exchange: exchange.id_exchange,
      id_user: idUser,
      status: 1
    });

    return res.status(200).json({ msg: "Te has unido exitosamente al intercambio."});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al unirse al intercambio"});
  }

}

const changeStatusOfParticipation = async (req, res) => {
  const { idExchange, accept, idUser } = req.body;

  try {

    /* Modificamos el estado del participante */
    const participant = await Participant.update({
      status: accept
    }, {
      where: {
        id_user: idUser,
        id_exchange: idExchange
      }
    });

    return res.status(200).json({ msg: "Se cambio el estado de la invitación."});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al aceptar/rechazar la invitación"});
  }


}

const deleteUserFromExchange = async (req, res) => {
  const { idUser, idExchange } = req.body;

  try {
    /* Buscar a participante y desactivar su campo active */
    const participant = await Participant.update({
      active: false
    }, {
      where: {
        id_exchange: idExchange,
        id_user: idUser
      }
    });

    return res.status(200).json({ msg: "Se removio al usuario del intercambio."});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al borrar al usaurio del intercambio."});
  }
}

const editExchangeById = async (req, res) => {
  //TODO Esta historia continuara...

  //TODO Tus intercambios agregar otro boton de info
}


module.exports = {
  getExchangeByKey,
  createNewExchange,
  getExchangesByUserId,
  inviteParticipantByEmail,
  deleteExchangeById,
  joinExchangeByKey,
  changeStatusOfParticipation,
  deleteUserFromExchange
}