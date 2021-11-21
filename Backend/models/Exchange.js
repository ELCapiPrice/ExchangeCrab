const { Sequelize } = require('sequelize');
const sequelize = require('../database/config.databases');

//Crear modelo temas y vincularlos con el ID del exchange.
//Crear modelo de participantes (codigo de intercambio, id_user, status (invitados, rechazados o confirmados) y el tema que eligieron)

const Exchange = sequelize.define("exchange", {
  id_exchange: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: { //Clave del intercambio
    type: Sequelize.STRING,
    allowNull: false
  },
  maxValue: { //Dinero máximo del intercambio
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  limitDate: { //Fecha límite para registrarse en el intercambio
    type: Sequelize.DATE,
    allowNull: false
  },
  date: { //Fecha de inicio del intercambio
    type: Sequelize.DATE,
    allowNull: false
  },
  comments: { //Comentarios adicionales al intercambio
    type: Sequelize.STRING,
    allowNull: false
  },
  owner: { //Creador del intercambio
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id_user'
    }
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
});


module.export = {
  Exchange
}

