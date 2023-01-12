const router = require('express').Router();

const path = require('path');
const auth = require('../middleware/auth');

const jsonparser = require('body-parser').json();



const chatsController = require('../controllers/chats');


router.get('/chats', auth.isAuth ,chatsController.getChats);
router.post('/chats', auth.isAuth ,jsonparser,chatsController.postChats);


module.exports = router;