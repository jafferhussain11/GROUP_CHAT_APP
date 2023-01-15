const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Chat = require('../models/chats');
const { Op } = require('sequelize');

const bcrypt = require('bcrypt');
const path = require('path');



exports.getChats = async (req, res, next) => {


    try{
            let chats = [];
            let lastMessageId = req.query.lastMessageID;
            if(lastMessageId == undefined) {
                lastMessageId = 0;
            }
            Chat.findAll({

                attributes : ['message','createdAt','UserId','User.name','id'],
                include: [{ model: User, attributes: ['name'] }],
                where: { id: { [Op.gt]: lastMessageId } },
                order: [['createdAt', 'ASC']]
            


            }).then(joinres => {

                chats = joinres;
                res.status(200).json({chats : chats});

            }).catch(err => {

                throw new Error(err);
            });
        }
    catch(err) {
        res.status(500).json({ message: err.message });
    }
}

exports.postChats = async (req, res, next) => {


    try{
            
            //console.log(req.user.dataValues);
            const userId = req.user.dataValues.id;
            const message = req.body.message;
            const chat = await Chat.create({
                message: message,
                UserId: userId
            });
            res.status(201).json({ message: 'Message sent' });
        
    }
    catch(err) {
        res.status(500).json({ message: err.message });
    }
}