const { Sequelize } = require('sequelize');
const sequelize = require('../database/config.databases');
const {User} = require('../models/User');

const Friendship = sequelize.define("friendship", {

    id_friendship: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email_ori: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email_des: {
        type: Sequelize.STRING,
        allowNull: false
    },
    are_friends: {
        type: Sequelize.BOOLEAN,
        default: true
    },
    id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            // Modelo de referencia
            model: User,
            // Nombre de la columna de referencia
            key: 'id_user',
        }
    }

});



module.exports = {
    Friendship
};