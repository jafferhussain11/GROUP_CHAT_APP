const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Chat = require('../models/chats');
const { Op } = require('sequelize');
const AWS = require('aws-sdk');
const Notification = require('../models/notifications');


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

async function uploadToS3(file,fileName){

    const BUCKET_NAME = 'expensetrackerlulu';
    const IAM_USER_KEY = process.env.AWS_ACCESS_KEY_ID;
    const IAM_USER_SECRET = process.env.AWS_SECRET_ACCESS_KEY;

    const s3 = new AWS.S3({

        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    });

    const params = {

        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: file,
        ACL : 'public-read'
    };
    
    return new Promise((resolve,reject) => {
        
        
            s3.upload(params, (err, data) => {
            
                if(err){
                    
                        reject(err);
                
                }
                else{
                
                    resolve(data.Location);
                }
            });
    });

   


}



exports.createAndStoreUrl = async (req,res,next) => {

    try{

        
        //send a file from pc to s3
        const file = req.file;
        const fileName = file.originalname;
        console.log(file);
        console.log(fileName);

        const URL = await uploadToS3(file.buffer, fileName)
            .then(url => {
                console.log(url);
                return url;
            })
            .catch(err => {
                res.status(500).send(err);
            });
    
        console.log(URL);
        // store url in db
        
        Chat.create({
            message: URL,
            UserId: req.user.id,
            GroupId: req.params.gid
        }).then(result => {

            res.status(201).json({ message: 'file UPloaded' });
        }).catch(err => {

            throw new Error(err);
        });


        
    }
    catch(err){

        res.status(403).json({message: err.message});
    }
}

exports.getNotifications = async (req, res, next) => {


    try {

        let notifications = [];
        let uid = req.user.id;
        console.log(uid);

        Notification.findAll({

            where: {

                UserId: uid
            },
            order: [
                ['id', 'DESC']
            ]
        }).then(result => {

            notifications = result;
            console.log(notifications);
            res.status(200).json({ notifications: notifications });

        }).catch(err => {

            throw new Error(err);
        });
    }catch(err) {

        res.status(500).json({ message: err.message });
    }
}