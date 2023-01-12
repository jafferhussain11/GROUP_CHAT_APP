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

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const chatRoutes  = require('./routes/chats');
const { on } = require('events');




//middlewares

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],

}));


app.use(signupRoutes);
app.use(loginRoutes);
app.use(chatRoutes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));


//relations

User.hasMany(Chat , { constraints: true, onDelete: 'CASCADE' });
Chat.belongsTo(User);


//{force : true}

sequelize.sync().then(result => {

app.listen(3000);

}).catch(err => {

console.log(err);

});