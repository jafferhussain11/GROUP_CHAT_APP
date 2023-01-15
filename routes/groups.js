const router = require('express').Router();

const path = require('path');
const auth = require('../middleware/auth');

const jsonparser = require('body-parser').json();



const groupController = require('../controllers/groups');


router.get('/groups', auth.isAuth ,groupController.getGroups);
router.post('/creategroup', auth.isAuth ,jsonparser,groupController.postGroups);
router.post('/invitemember', auth.isAuth ,jsonparser,groupController.adminInvite);
router.post('/inviteresp', auth.isAuth ,jsonparser,groupController.inviteResponse);



module.exports = router;