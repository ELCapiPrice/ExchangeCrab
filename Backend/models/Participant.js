const { Sequelize } = require('sequelize');
const sequelize = require('../database/config.databases');

const Participant = sequelize.define("participant", {
  id_participant: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  topic: { //Tema que escogio el participante
    type: Sequelize.STRING,
    allowNull: true,
    /*references: {
      model: 'topics',
      key: 'id_topic'
    }*/
  },
  id_exchange: { //ID del intercambio al que pertenece el participante
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'exchanges',
      key: 'id_exchange'
    }
  },
  email: { //Correo del participante
    type: Sequelize.STRING,
    allowNull: true,
  },
  firstname: { //Correo del participante
    type: Sequelize.STRING,
    allowNull: true,
  },
  lastname: { //Correo del participante
    type: Sequelize.STRING,
    allowNull: true,
  },
  /*id_user: { //ID del usuario que participa
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id_user'
    }
  },*/
  status: { //Estado de su participacion
    type: Sequelize.INTEGER,
    defaultValue: 0 // 0 - Pendiente. 1 - Aceptado. 2 - Rechazado
  },
  userToGift: { //correo del usuario al que le va a dar regalo
    type: Sequelize.STRING,
    allowNull: true,
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
});

module.exports = {
  Participant
}