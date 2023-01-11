const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const User = require('./models/user');

const signupRoutes = require('./routes/signup');



//middlewares

app.use(signupRoutes);
app.use(bodyParser.urlencoded({ extended: false }));




sequelize.sync().then(result => {

app.listen(3000);

}).catch(err => {

console.log(err);

});