const router = require('express').Router();

const path = require('path');


const jsonparser = require('body-parser').json();



const signupcontroller = require('../controllers/signup');

router.get('/signup', (req, res, next) => {

    res.sendFile(path.join(__dirname, '../', 'views', 'signup.html'));

});

router.post('/signup',jsonparser,signupcontroller.postSignup);

module.exports = router;