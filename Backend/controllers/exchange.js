
//const { obtainAllExchanges } = require('../models/exchange');

const { Op } = require('sequelize');
const { Exchange } = require('../models/Exchange');
const { Topic } = require('../models/Topic');
const { Participant } = require('../models/Participant');
const { User } = require('../models/User');

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

    let exchangesParticipate = [];

    for(let i = 0; i < participants.length; i++) {
      const exchangeParticipants = await Exchange.findOne({
        where: {
          id_exchange: participants[i].dataValues.id_exchange,
          active: true
        }
      });
      if(exchangeParticipants === null) continue;
      exchangesParticipate.push(exchangeParticipants.dataValues);
    }

    let exchangeInvitations = [];
    for(let i = 0; i < participants.length; i++) {
      if(participants[i].dataValues.status != 0) continue;
      const invitations = await Exchange.findAll({
        where: {
          id_exchange: participants[i].dataValues.id_exchange,
          active: true
        }
      });
      exchangeInvitations.push(invitations.dataValues);
    }

    const data = {
      exchange,
      'participing': participants,
      exchangesParticipate,
      exchangeInvitations
    }

    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al obtener los intercambios de el usuario por su ID"});
  }
}

const inviteParticipantByEmail = async (req, res) => {
  const { email, key } = req.body;

  /* TODO Revisar si el usuario ya fue invitado */

  try {
    /* Buscamos al usuario por su correo */
    const user = await User.findOne({
      where: {
        email,
        is_active: true
      }
    });
    if(user === null) return res.status(400).json({error: "El usuario no se encuentra registrado"});

    const exchange = await Exchange.findOne({
      where: {
        key
      }
    });

    const check = await Participant.findOne({
      where: {
        id_user: user.id_user,
        active: true
      }
    });
    if(check) return res.status(400).json({ msg: "Ese usuario ya fue invitado. "});

    /* Invitamos al participante a participar */
    const participant = await Participant.create({
      id_exchange: exchange.dataValues.id_exchange,
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
  const idUser = req.body.idUser;

  try {
    /* Verificamos que el dueño es el que borra su intercambio */

    const exchange = await Exchange.findOne({
      where: {
        owner : idUser,
        id_exchange : idExchange
      }
    });

    if(!exchange) return res.status(400).json({ error: "No eres el creador de ese intercambio"});

    /* Borramos logicamente el intercambio */
    await Exchange.update({
      active: false
    }, {
      where: {
        id_exchange: idExchange,
        owner : idUser
      }
    });

    /* Borramos logicamente los participantes del intercambio */
    const participant = await Participant.update({
      active: false
    }, {
      where: {
        id_exchange: idExchange,
      }
    });
    /* Borramos logicamente los temas del intercambio */
    const topic = await Topic.update({
      active: false
    }, {
      where: {
        id_exchange: idExchange,
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

    const participants = await Participant.findOne({
      where: {
        id_user: idUser,
        status: true
      }
    });
    if(participants) return res.status(400).json({error: "Error, ya estas registrado en ese intercambio!"});

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

  console.log(idUser, idExchange);

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
  const { idExchange,
  maxValue,
  limitDate,
  date,
  comments } = req.body;

  try {

    /* Actualizamos los valores del intercambio */
    const exchange = Exchange.update({
      maxValue,
      limitDate,
      date,
      comments
    }, {
      where: {
        id_exchange: idExchange,
        active: true
      }
    });

    return res.status(200).json({ msg: "Se edito corrextamente el intercambio."});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al editar el intercambio."});
  }
}

const forceStartExchange = async (req, res) => {
  const { idExchange } = req.params;


  try {
    /* Obtenemos los participantes del intercambio */
    const participants = await Participant.findAll({
      where: {
        id_exchange: idExchange,
        status: 1,
        topic: {
          [Op.ne]: null
        },
        active: true
      }
    });
    //if(participants.length < 2) return res.status(400).json({ error: "Para forzar el inicio del intercambio se necesitan al menos 2 participantes confirmados."});

    for(let i = 0; i < participants.length; i++) {
      console.log(participants[i].dataValues);
    }

    return res.status(200).json({ msg: "Ok."});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al forzar el intercambio."});
  }
}



module.exports = {
  getExchangeByKey,
  createNewExchange,
  getExchangesByUserId,
  inviteParticipantByEmail,
  deleteExchangeById,
  joinExchangeByKey,
  changeStatusOfParticipation,
  deleteUserFromExchange,
  editExchangeById,
  forceStartExchange
}