const User = require('../models/user');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const bcrypt = require('bcrypt');

const path = require('path');




exports.postSignup = async (req, res, next) => {

    try{

        const name = req.body.name;
                const password = req.body.password;
                const email = req.body.email;
                const phone = req.body.phone;

                if(!name || !password || !email || !phone) {
                
                    throw new Error('All fields are required');
                }
                User.findAll({where : {
                    [Op.or]: [
                        {email: email},
                        {phone: phone}
                    ]
                }}).then(user => {
                    
                    if(user.length > 0) {

                        res.status(422).json({ message: 'User already exists' });
                    }
                    else {

                        bcrypt.hash(password, 12).then(hashedPassword => {
                
                          
                        
                            User.create({
                                name: name,
                                password: hashedPassword,
                                email: email,
                                phone: phone,
                                isLoggedIn: false
                            }).then(user => {
                                
                                res.status(201).json({ message: 'User created' });

                            }).catch(err => {

                                throw new Error(err);
                            });


                        
                        })
                        .catch(err => {

                            throw new Error(err);
                        });
                    }
                }).catch(err => {
                        
                        throw new Error(err);
                    });

            
                
                


    }
    catch(err) {

        res.status(500).json({ message: err.message });
    }
    

}