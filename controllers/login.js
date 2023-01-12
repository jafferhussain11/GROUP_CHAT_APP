const jwt = require('jsonwebtoken');
const User = require('../models/user');

const bcrypt = require('bcrypt');
const path = require('path');


exports.getLogin = async (req, res, next) => {

    res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));

};
exports.postLogin = async (req, res, next) => {

    try{
        const emailorphone = req.body.emailphone;
        const password = req.body.password;

        const what = emailorphone.includes('@') ? 'email' : 'phone';
       

        if(!what || !password) {

            throw new Error('All fields are required');
        }
        
        User.findOne({where : { [what] : emailorphone }}).then(user => {

            if(!user) {

                res.status(404).json({ message: 'User does not exist' });
            }
            else {

                bcrypt.compare(password, user.password).then(doMatch => {

                    if(doMatch) {

                        const token = jwt.sign({ userId: user.id, email: user.email },
                            process.env.JWT_KEY,
                            { expiresIn: '1h' });
                        
                        user.update({isLoggedIn: true}).then(user => {

                              
                                    res.status(200).json({token : token , message : 'Logged in successfully'});
                        
                        }).catch(err => {

                            throw new Error(err);
                        });
                    }
                    else {

                        res.status(401).json({ message: 'Invalid password' });
                    }
                }).catch(err => {

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