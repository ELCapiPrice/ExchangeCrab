
//const { obtainAllExchanges } = require('../models/exchange');

const { Op } = require('sequelize');
const { Exchange } = require('../models/Exchange');
const { Topic } = require('../models/Topic');
const { Participant } = require('../models/Participant');
const { User } = require('../models/User');
const { Friendship } = require('../models/Friendship');
const { isEmailAddress } = require('../helpers/is_email');
const  {emailConfirmacion} = require('../utils/sendEmail')
const {emailGift} = require ('../utils/EmailToUser')
const {DoublyLinkedList} = require('../helpers/generar_intercambio');
const {login} = require("./auth");
const { giftlist } = require('simple-gift-exchange');
const { use } = require('../routes/exchange');


/* CREAR INTERCAMBIO LISTO */
const createNewExchange = async (req, res) => {
  let { key, topics, maxValue, limitDate, date, owner, ownerParticipate, comments } = req.body;

  //Separamos por comas los temas.
  topics = topics.replaceAll(' ', '').split(',');
  /* Buscamos el usuario que creo el intercambio */
  let user = await User.findOne({ where: {id_user: owner, is_active: true} });
  /* Extraemos sus datos */
  let  email = user.dataValues.email;
  let firstName = user.dataValues.firstname;
  let lastName = user.dataValues.lastname;

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
    for (let i = 0; i < topics.length ; i++) {
      const topic = await Topic.create({
        topic: topics[i],
        id_exchange: idExchange
      });
      if(i === 3) break; //Si agrego mas de 3 pues no los agregamos
    }

    /* Si el dueño tambien participa entonces lo agregamos */
    if(ownerParticipate) {
      const participant = await Participant.create({
        topic: topics[0], //Le asignamos el primer tema por default. Luego lo puede cambiar
        id_exchange: idExchange, //ID del intercambio
        email: email, //email del usuario
        fistname: firstName,
        lastname: lastName,
        status: 1 //Estado aceptado
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(401).json({ error: "Error al crear el intercambio"});
  }
  await emailConfirmacion (email , key)
  return res.status(200).json({ msg: "Se creo el intercambio correctamente."});
}

/* LISTO */
/* Unirse por la clave del intercambio */
const joinExchangeByKey = async (req, res) => {
  let { key, topic, email, firstName, lastName, idUser } = req.body;

  if(idUser) { //Si el usuario esta registrado entonces sacamos su info en la base de datos
    //Sacar nombres y correo de la tabla usuarios por su id;
    const user = await User.findOne({
      where: {
        id_user: idUser,
        is_active: true
      }
    }).catch(err => res.status(400).json({error: "Error, no se encontro un usuario con tu id: " + err}));

    firstName = user.firstname;
    lastName = user.lastname;
    email = user.email;
  }

  /*let user = await User.findOne({ where: {id_user: idUser} });
  let  email=user.dataValues.email;*/

  try {
    /* Obtenemos el intercambio al que se quiere meter */
    const exchange = await Exchange.findOne({
      where: {
        key,
        active: true
      }
    });
    /* Si no encontro el intercambio por su key, entonces no existe el intercambio */
    if(!exchange) return res.status(400).json({error: "Error, el código de intercambio no existe!"});

    /* Obtenemos la información si ya esta participando */
    const participant = await Participant.findOne({
      where: {
        id_exchange: exchange.id_exchange,
        email: email,
        active: true
      }
    });
    /* Si encontro al participante en ese intercambio quiere decir que: Ya esta participando, Fue invitado y no ha aceptado la invitación, o rechazo la invitación pero quiere unirse */
    if(participant){
      switch (participant.status) {
        case 0: //Esta en estado pendiente. Osea que ya fue invitado pero nunca acepto por el correo
          /* Actualizar el estado, topic, nombre y apellido del registro */
          Participant.update({
            topic: topic,
            firstname: firstName,
            lastname: lastName,
            status: 1
          }, {
            where: {
              id_exchange: exchange.id_exchange,
              email: email,
              active: true
            }
          });
          await emailConfirmacion (email , key);
          return res.status(200).json({msg: "Te has unido exitosamente al intercambio que ya te habian invitado!"});
        case 1: //Ya se encuentra en el intercambio
          return res.status(400).json({error: "Error, ya estas registrado en ese intercambio!"});
        case 2: //Esta en estado rechazada. Osea que fue invitado y rechazo la solicitud
          return res.status(400).json({error: "Error, rechazaste la solicitud para unirte a este intercambio y no puedes voler a unirte!"});
        default:
          break;
      }
    }
    /* Si no encontro al participante entonces vamos a hacer un nuevo registro */
    await Participant.create({
      topic,
      id_exchange: exchange.id_exchange,
      email: email,
      firstname: firstName,
      lastname: lastName,
      status: 1
    });
    await emailConfirmacion (email , key);
    return res.status(200).json({ msg: "Te has unido exitosamente al intercambio."});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al unirse al intercambio: " + e.message});
  }
}


/* LISTO */
/* Invitar participantes por su correo electronico */
const inviteParticipantByEmail = async (req, res) => {
  const { email, key } = req.body;

  /* TODO Revisar si el usuario ya fue invitado */

  try {
    const exchange = await Exchange.findOne({
      where: {
        key,
        active: true
      }
    });

    if(!exchange) return res.status(400).json({ error: "No existe un intercambio con la key especificada. "});

    const check = await Participant.findOne({
      where: {
        id_exchange: exchange.id_exchange,
        email: email,
        active: true
      }
    });

    if(check) return res.status(400).json({ msg: "Ese usuario ya fue invitado. "});

    /* Invitamos al participante a participar */
    const participant = await Participant.create({
      id_exchange: exchange.dataValues.id_exchange,
      email: email,
    });

    /* TODO Le enviamos un correo electronico al invitado con el link con el siguiente formato */
    /* http://localhost/join.html?key=key&email=email */
    /* OJO. Obviamente el link no va a servir por que actualmente nosotros estamos corriendo el front con live server
    *  lo que provoca que a localhost le asigne un puerto random (en mi caso con webstorm) asi que para la demostración
    *  abrimos el archivo join.html con live server y le agregamos los parametros por la url manualmente sacados del correo que le llego al usuario */

    // Ya te deje las variables KEY y EMAIL para que lo envies
    //Aqui va la funcion para que envie email

    return res.status(200).json({ msg: "Se invito al usuario a participar."});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al invitar al usuario"});
  }
}

/* GET */
const getTopicsByExchangeId = async (req, res) => {
  /* Ejemplo para consultar los topics */
  /* localhost:7777/api/exchange/getTopics?exchangeId=3 */
  
  const { exchangeId } = req.query;
  console.log(exchangeId);

  try {
    const topics = await Topic.findAll({
      where: {
        id_exchange: exchangeId,
        active: true
      }
    })
    return res.status(200).json(topics);
    
  } catch (error) {
    return res.json({"ERROORR": 500}) 
  }

}

/* LISTO */
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

    return res.status(200).json({ msg: "Se edito correctamente el intercambio."});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al editar el intercambio."});
  }
}

/* LISTO */
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

/* LISTO */
const getExchangesByUserId = async (req, res) => {
  const id = req.params.id;

  try {
    const exchange = await Exchange.findAll({
      where: {
        owner: id,
        active: true
      }
    });

    const user = await User.findOne({
      where: {
        id_user: id,
        is_active: true
      }
    });


    const participants = await Participant.findAll({
      where: {
        email: user.email,
        active: true
      }
    });

    let exchangesParticipate = [];

    for(let i = 0; i < participants.length; i++) {
      if(participants[i].status !== 1) break;
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
    //console.log(participants);
    for(let i = 0; i < participants.length; i++) {
      if(participants[i].dataValues.status != 0) continue;
      console.log("Entra");
      const invitations = await Exchange.findOne({
        where: {
          id_exchange: participants[i].dataValues.id_exchange,
          active: true
        }
      });
      //console.log(invitations.dataValues);
      exchangeInvitations.push(invitations.dataValues);
    }

    //console.log(exchangeInvitations);

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

/* LISTO */
const deleteExchangeById = async (req, res) => {
  const idExchange = req.body.idExchange;
  const idUser = req.body.idUser;

  try {
    /* Verificamos que el dueño es el que borra su intercambio */

    const exchange = await Exchange.findOne({
      where: {
        owner : idUser,
        id_exchange : idExchange,
        active: true
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

const deleteUserFromExchange = async (req, res) => {
  const { idUser, idExchange, email } = req.body;

  /* Si nos mandan el email, hay que borrar al usuario de participantes por su Email */
  if(email) {
    const participant = await Participant.findOne({
      where: {
        email: email,
        active: true
      }
    });
    if(!participant) return res.status(400).json({error: "Error, no se encontro el usuario para borrarlo."});

    await Participant.update({
      active: false
    }, {
      where: {
        id_exchange: idExchange,
        email: email
      }
    });
    return res.status(200).json({ msg: "Se removio al usuario del intercambio."});
  }


  console.log(idUser, idExchange);
  if(!idUser || !idExchange) return res.status(400).json({error: "Error, no se enviaron los datos requeridos."});


  const user = await User.findOne({
    where: {
      id_user: idUser,
      is_active: true
    }
  });
  if(!user) return res.status(400).json({error: "Error, no se encontro el usuario para borrarlo."});

  try {
    /* Buscar a participante y desactivar su campo active */
    const participant = await Participant.update({
      active: false
    }, {
      where: {
        id_exchange: idExchange,
        email: user.email
      }
    });

    return res.status(200).json({ msg: "Se removio al usuario del intercambio."});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al borrar al usaurio del intercambio."});
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

/* Cuando invitas a un participante */
const inviteParticipant = async (req, res) => {
  let { idExchange, email  } = req.body;

  /* Buscamos la informacion del intercambio */
  let exchange = await Exchange.findOne({
    where: {
      id_exchange: idExchange
    }
  });
  if(!exchange) return res.status(400).json({error: "No existe el intercambio con la ID especificada: "})

  /* Agregamos el participante a la tabla de participantes */
  await Participant.create({
    id_exchange: idExchange,
    email: email
  }).catch(err => {
    console.log(err)
    return res.status(500).json({error: "Ocurrio un error al invitar al participante: " + err.message})
  });

  let key = exchange.key;

  /* TODO Le enviamos un correo electronico al invitado con el link con el siguiente formato */
  /* http://localhost/join.html?key=key&email=email */
  /* OJO. Obviamente el link no va a servir por que actualmente nosotros estamos corriendo el front con live server
  *  lo que provoca que a localhost le asigne un puerto random (en mi caso con webstorm) asi que para la demostración
  *  abrimos el archivo join.html con live server y le agregamos los parametros por la url manualmente sacados del correo que le llego al usuario */

  // Ya te deje las variables KEY y EMAIL para que lo envies
  //Aqui va la funcion para que envie email

  res.status(200).json({msg: "Se invito correctamente al participante."});
}


const forceStartExchange = async (req, res) => {
  const { idExchange } = req.params;

  try {
    /* Obtenemos los participantes del intercambio */
    /* Solo los confirmados y que seleccionaron 1 tema */
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
    if(participants.length < 2) return res.status(400).json({ error: "Para forzar el inicio del intercambio se necesitan al menos 2 participantes confirmados."});
    console.log(participants[0].dataValues.email);

    //En suaurios se van a guardar los email de los participantes
    let usuarios =[]
    for (let i =  0 ; i<participants.length ; i++){
        usuarios.push(participants[i].dataValues.email)
  
      }

    //genrera el intercmabio ejemplo [ ["chuz@yahoo.com" , "mike@yahoo.com"] , ["prax@gmail.com"] , ["pedro@gmail.co"]]
    const exchange = giftlist(usuarios)
    console.log(exchange);

    for (let i=0 ; i<exchange.length ; i++){
      for ( j=0; j<exchange[i].length-1; j++ ){
        console.log(`${exchange[i][j]} gives a gift to  ${exchange[i][j+1]}`);

        console.log("TEST");
        console.log(exchange[i][0],exchange[i][0],);
        await Participant.update({
          userToGift: exchange[i][j+1] //exchange[i][j].email
        }, {
          where: {
            email: exchange[i][j],
            active: true
          }
        });
      }

      const user = await User.findOne({
        where : {
          email : exchange[i][1]
        }
      })
      console.log(user.dataValues.firstname  )

      await emailGift(exchange[i][0],exchange[i][1], user.dataValues.firstname  ,  user.dataValues.lastname)
    }




    //console.log(yaRecibieron);


    return res.status(200).json({ msg: "Ok."});
  } catch (e) {
    console.log(e);
    return res.status(400).json({error: "Error al forzar el intercambio."});
  }
}


const  list_exchanges= async(req , res) =>{


  const exchanges = await Exchange.findAll({where: {active: true}});

  if (exchanges){
  return  res.status(200).json(exchanges)
  }

  return res.status(401).json("UPPS Problemas la procesar la peticion")

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
  forceStartExchange,
  list_exchanges,
  getTopicsByExchangeId
}