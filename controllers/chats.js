const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Chat = require('../models/chats');

const bcrypt = require('bcrypt');
const path = require('path');



exports.getChats = async (req, res, next) => {


    try{
            let chats = [];
            Chat.findAll({

                attributes : ['message','createdAt','UserId','User.name'],
                include: [{ model: User, attributes: ['name'] }],
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