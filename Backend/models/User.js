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
    user_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_name: {
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
    hobbie: {
        type: Sequelize.STRING,
        allowNull: true
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