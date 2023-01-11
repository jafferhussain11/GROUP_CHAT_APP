const User = require('../models/user');

const bcrypt = require('bcrypt');

const path = require('path');

const jwt = require('jsonwebtoken');


exports.postSignup = async (req, res, next) => {

    try{

        const name = req.body.name;
                const password = req.body.password;
                const email = req.body.email;
                const phone = req.body.phone;

                if(!name || !password || !email || !phone) {
                
                    throw new Error('All fields are required');
                }
                await User.findOne({ email: email , phone : phone }).then(userDoc => {

                    if(userDoc) {

                        res.status(422).json({  message: 'User already exists' });
                    }
                });

                
                bcrypt.hash(password, 12).then(hashedPassword => {
                
                    const user = new User({
                    
                        name: name,
                        password: hashedPassword,
                        email: email,
                        phone: phone,
                        isPremium: false
                    
                    });
                
                    return user.save();
                
                }).then(result => {
                
                    res.status(201).json({
                    
                        message: 'User created!',
                    
                        userId: result._id
                    
                    });

                    }).catch(err => {
                    
                        if (!err.statusCode) {

                            err.statusCode = 500;

                        }
                                        
                    });


    }
    catch(err) {

        res.status(500).json({ message: err.message });
    }
    

}