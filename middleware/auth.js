const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.isAuth = (req,res,next) => {
    
    const token = req.get('Authorization');
    let decodedToken;
    try{
        
        decodedToken = jwt.verify(token,'secret');
        if(!decodedToken){
            const error = new Error('Not authenticated OR Please login again if already Signed up !');
            error.statusCode = 401;
            throw error;
        }

        User.findByPk(decodedToken.userId).then(row => {

            req.user = row;
            next();
        }).catch(err => {

            throw new Error(err);
        });
    }
    catch(err){

        res.status(401).json({ message: 'Not authorized !' });

        
    }

}