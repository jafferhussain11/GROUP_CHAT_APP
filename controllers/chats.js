const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Chat = require('../models/chats');
const { Op } = require('sequelize');

const bcrypt = require('bcrypt');
const path = require('path');



exports.getChats = async (req, res, next) => {


    try{
            let chats = [];
            let gid = req.params.gid;
            let lastMessageId = req.query.lastMessageID;
            if(lastMessageId == undefined) {
                lastMessageId = 0;
            }
            Chat.findAll({ //join chats and users table
                where: {
                    GroupId: gid,
                    id: {
                        [Op.gt]: lastMessageId
                    }
                },
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'email']
                }],
                order: [
                    ['id', 'ASC']
                ]
                
                
            }).then(result => {

                chats = result;
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
            const groupid= req.params.gid;
            if (groupid==undefined) {
                res.status(400).json({ message: 'Please join a group first to chat' });
            }
            else{
                const chat = await Chat.create({
                    message: message,
                    UserId: userId,
                    GroupId: groupid
                });
                res.status(201).json({ message: 'Message sent' });

            }
            
        
    }
    catch(err) {
        res.status(500).json({ message: err.message });
    }
}