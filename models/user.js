const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('User', {

    id: {  

        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {

        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phone : {

        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
    isPremium : {
        type: Sequelize.BOOLEAN
    }
});

module.exports = User;

