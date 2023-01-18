const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Chat = require('../models/chats');
const Group = require('../models/group');
const Notification = require('../models/notifications');
const Usersingroups = require('../models/usersingroups');
const { Op } = require('sequelize');


const bcrypt = require('bcrypt');
const path = require('path');



exports.getGroups = async (req, res, next) => {

    try{
            let groups = [];
            let uid = req.user.id;
            req.user.getGroups().then(result => {

                groups = result;
                res.status(200).json({groups : groups});

            }).catch(err => {

                throw new Error(err);
            });


        }
    catch(err) {
        res.status(500).json({ message: err.message });
    }
}
    
exports.postGroups = async (req, res, next) => {//every user can create a group and he will be the admin of that group

    try{
            const name = req.body.name;
            const uid = req.user.id;
            const group = await Group.create({
                name: name,
                admin: uid
            }).then(group => {


                req.user.addGroup(group).then(result => {

                    Usersingroups.update({
                        isAdmin : true
                    }, {
                        where: {
                            groupId: group.id,
                            userId: uid
                        }
                    }).then(result => {
                            res.status(201).json({message: 'Group created successfully'});
                        
                    }).catch(err => {

                        throw new Error(err);
                    })
                })
                .catch(err => {

                    throw new Error(err);
                })
            .catch(err => {

                throw new Error(err);
                });
            });
    }
    catch(err) {
        res.status(500).json({ message: err.message });
    }
}

exports.adminInvite = async (req, res, next) => {

    //create a notification for the user to accept or decline the invitation

    try{

            const adminId = req.user.id;
            const gid = req.body.gid;
            const email = req.body.email;
            const group = await Group.findByPk(gid).then(group => {

                if(group) {

                     return group;
                }
                else {

                    res.status(200).json({message: 'Group does not exist'});
                }
            }).catch(err => {

                throw new Error(err);
            });
            await Usersingroups.findOne({ where: { groupId: gid, userId: adminId } }).then(result => {

                if(result.isAdmin) {
                    User.findOne({ where: { email: email } }).then(user => {

                        if(user) {
                            Usersingroups.findOne({ where: { groupId: gid, userId: user.id } }).then(result => {

                                if(result) {
                                    res.status(200).json({message: 'User is already in the group'});
                                }
                                else {
                                    Notification.create({
                                        UserId: user.id,
                                        message: `You have been invited to join group ${group.name}`,
                                        invitedGID: gid,
                                    }).then(result => {

                                        res.status(200).json({message: 'Invitation sent successfully'});
                                    }).catch(err => {

                                        throw new Error(err);
                                    })
                                }
                            }).catch(err => {

                                throw new Error(err);
                            })
                        }
                        else {
                            res.status(200).json({message: 'User does not exist'});
                        }
                    }).catch(err => {

                        throw new Error(err);
                    })
                }
                else {
                    res.status(200).json({message: 'You are not the admin of this group'});
                }
            }).catch(err => {

                throw new Error(err);
            })
    }
    catch(err) {

        res.status(500).json({ message: err.message });
    }
}


exports.inviteResponse = async (req, res, next) => {

    try{

            const gid = req.body.gid;
            const invitedId = req.user.id;
            const response = req.body.response;
            const nid = req.body.nid;
            await Notification.findOne({ where: { id : nid} }).then(result => {

                if(result) {
                    if(response=='accept') {

                        const group = Group.findByPk(gid)
                        .then(group => {

                        req.user.addGroup(group).then(result => {

                            Usersingroups.update({
                                isAdmin: false
                            }, {
                                where: {
                                    groupId: gid,
                                    userId: invitedId
                                }
                            }).then(result => {

                            Notification.destroy({ where: { id: nid } }).then(result => {

                                res.status(200).json({message: 'Invitation accepted'});
                            }).catch(err => {

                                throw new Error(err);
                            })
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

                    else {
                        Notification.destroy({ where: {id: nid } }).then(result => {

                            res.status(200).json({message: 'Invitation declined'});
                        }).catch(err => {

                            throw new Error(err);
                        })
                    }
                }
                else {
                    res.status(200).json({message: 'Invitation does not exist'});
                }
            }).catch(err => {

                throw new Error(err);
            })
    }
    catch(err) {

        res.status(500).json({ message: err.message });
    }
}

            




                    

                