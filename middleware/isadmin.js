const User = require('../models/user');
const Usersingroups = require('../models/usersingroups');

exports.checkGroupAdmin = (req,res,next) => {

    const gid = req.body.gid;
    const uid = req.user.id;
    console.log(uid)
    Usersingroups.findOne({
        where: {
            GroupId: gid,
            UserId: uid,
            isAdmin: true
        }
    }).then(row => {
        if(row) {

            req.user = row;
            next();
        }
        else {
            res.status(401).json({ message: 'Not authorized !' });
            
        }
    }).catch(err => {

        throw new Error(err);
    });
}