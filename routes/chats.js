const router = require('express').Router();

const path = require('path');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer();

const jsonparser = require('body-parser').json();



const chatsController = require('../controllers/chats');


router.get('/chats/getnotifications', auth.isAuth ,chatsController.getNotifications);
router.get('/chats/:gid', auth.isAuth ,chatsController.getChats);
router.post('/chats/:gid', auth.isAuth ,jsonparser,chatsController.postChats);
router.post('/chats/upload/:gid', auth.isAuth ,upload.single('file'),chatsController.createAndStoreUrl);



module.exports = router;