const router = require('express').Router();

const path = require('path');


const jsonparser = require('body-parser').json();



const loginController = require('../controllers/login');


router.get('/login', loginController.getLogin);

router.post('/login',jsonparser,loginController.postLogin);

module.exports = router;