const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Usersingroups = sequelize.define('Usersingroups', {

    id: {  

        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    isAdmin : {

        type: Sequelize.BOOLEAN,
        
    }

   
});

module.exports = Usersingroups;

