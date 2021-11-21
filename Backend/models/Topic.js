const { Sequelize } = require('sequelize');
const sequelize = require('../database/config.databases');


//Temas que existen en los intercambios
const Topic = sequelize.define("topic", {
  id_topic: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  topic: { //Temas correspondientes a un intercambio
    type: Sequelize.STRING,
    allowNull: false
  },
  id_exchange: { //ID del intercambio
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'exchanges',
      key: 'id_exchange'
    }
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
});


module.exports = {
  Topic
}