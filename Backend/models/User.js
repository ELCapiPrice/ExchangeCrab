const { Sequelize } = require('sequelize');
const sequelize = require('../database/config.databases');



const User = sequelize.define("user", {
    id_user: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_unique: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    firstname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    list_exchange_room: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    last_connected: {
        type: Sequelize.DATE,
        allowNull: true
    },
    is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },


});




module.exports = {
    User
};