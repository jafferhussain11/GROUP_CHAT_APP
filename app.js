const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const User = require('./models/user');
const Chat = require('./models/chats');
const Group = require('./models/group');
const Usersingroups = require('./models/usersingroups');
const Notification = require('./models/notifications');

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const chatRoutes  = require('./routes/chats');
const groupRoutes = require('./routes/groups');
const { on } = require('events');




//middlewares

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],

}));


app.use(signupRoutes);
app.use(loginRoutes);
app.use(groupRoutes);
app.use(chatRoutes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));


//relations

User.hasMany(Chat , { constraints: true, onDelete: 'CASCADE' });
Chat.belongsTo(User);

User.belongsToMany(Group, { through: Usersingroups });
Group.belongsToMany(User, { through: Usersingroups });

Group.hasMany(Chat , { constraints: true, onDelete: 'CASCADE' });
Chat.belongsTo(Group);

User.hasMany(Notification , { constraints: true, onDelete: 'CASCADE' });
Notification.belongsTo(User);



//{force : true}

sequelize.sync().then(result => {

app.listen(3000);
console.log(Object.keys(User.prototype))
console.log(Object.keys(Group.prototype))


}).catch(err => {

console.log(err);

});