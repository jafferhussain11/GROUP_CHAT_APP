const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Notification = sequelize.define('Notification', {

    id: {  

        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    message : {

        type : Sequelize.STRING

    }


    

   
});

module.exports = Notification;

