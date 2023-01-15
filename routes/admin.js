const router = require('express').Router();

const path = require('path');
const auth = require('../middleware/auth');
const isadmin = require('../middleware/isadmin');

const jsonparser = require('body-parser').json();



const adminController = require('../controllers/admin');



router.post('/admin/removeuser', auth.isAuth,jsonparser, isadmin.checkGroupAdmin ,adminController.removeUserFromGroup);
router.post('/admin/adduser', auth.isAuth,jsonparser, isadmin.checkGroupAdmin ,adminController.addUserToGroup);
router.get('/admin/getusers/:gid', auth.isAuth, adminController.getGroupUsers);
router.post('/admin/makeadmin', auth.isAuth,jsonparser, isadmin.checkGroupAdmin ,adminController.makeAdmin);


module.exports = router;