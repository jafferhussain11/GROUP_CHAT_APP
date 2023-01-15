const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Chat = require('../models/chats');
const Group = require('../models/group');
const { Op } = require('sequelize');

const bcrypt = require('bcrypt');
const path = require('path');
const Usersingroups = require('../models/usersingroups');


exports.removeUserFromGroup = async (req, res, next) => {


    try{
        
        const emailorphone = req.body.emailphone;
        const what = emailorphone.includes('@') ? 'email' : 'phone';
        console.log(req.user.dataValues.GroupId);
        const groupid = req.user.dataValues.GroupId;

        await Group.findOne({where : {id : groupid}}).then(group => {

            //remove what from group using sequelize method

            if(what == 'email') {

                User.findOne({where : {email : emailorphone}}).then(user => {

                    group.removeUser(user).then(result => {

                        res.status(200).json({message: 'User removed from group successfully'});
                    }).catch(err => {
                        throw new Error(err);
                    })
                }).catch(err => {

                    throw new Error(err);
                })
            }
            else {

                User.findOne({where : {phone : emailorphone}}).then(user => {

                    group.removeUser(user).then(result => {

                        res.status(200).json({message: 'User removed from group successfully'});
                    }).catch(err => {
                        throw new Error(err);
                    })
                }).catch(err => {
                        
                        throw new Error(err);
                })
            } 
            
        }).catch(err => {

            throw new Error(err);
        })
    }
    catch(err) {
        res.status(500).json({ message: err.message });
    }
}

exports.addUserToGroup = async (req, res, next) => {

    try{

        const emailorphone = req.body.emailphone;
        const what = emailorphone.includes('@') ? 'email' : 'phone';
        const groupid = req.user.dataValues.GroupId;

        await Group.findOne({where : {id : groupid}}).then(group => {

            User.findOne({where : {[what] : emailorphone}}).then(user => {

                group.addUser(user).then(result => {

                    res.status(200).json({message: 'User added to group successfully'});
                }).catch(err => {
                    throw new Error(err);
                })
            }).catch(err => {

                throw new Error(err);
            })
        }).catch(err => {

            throw new Error(err);
        })

    }
    catch(err) {

        res.status(500).json({ message: err.message });
    }
}

exports.getGroupUsers = async (req, res, next) => {

    try{

        const groupid = req.params.gid;
        await Group.findOne({where : {id : groupid}}).then(group => {

            group.getUsers().then(users => {

                const Userstosend = users.map(user => {

                    return {name : user.name, email : user.email, phone : user.phone};
                })
                res.status(200).json({users : Userstosend});
            }).catch(err => {

                throw new Error(err);
            })
        }).catch(err => {

            throw new Error(err);
        })
    }
    catch(err) {
            
            res.status(500).json({ message: err.message });
        }
}

exports.makeAdmin = async (req, res, next) => {

    try{

        const emailorphone = req.body.emailphone;
        const what = emailorphone.includes('@') ? 'email' : 'phone';
        const groupid = req.user.dataValues.GroupId;

        await Group.findOne({where : {id : groupid}}).then(group => {

            User.findOne({where : {[what] : emailorphone}}).then(user => {

                Usersingroups.update({
                    isAdmin : true
                }, {
                    where: {
                        groupId: groupid,
                        userId: user.id
                    }
                }).then(result => {

                    res.status(200).json({message: 'User is now admin'});
                }).catch(err => {

                    throw new Error(err);
                })
            }).catch(err => {

                throw new Error(err);
            })
        }).catch(err => {

            throw new Error(err);
        })
    }
    catch(err) {
        res.status(500).json({ message: err.message });
    }
}