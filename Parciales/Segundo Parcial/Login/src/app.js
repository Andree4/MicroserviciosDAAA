// src/app.js
const express = require('express');
const app = express();

require('./config/db');

const UserController = require('./routes/UserController');
const LoginController = require('./routes/LoginController');

app.use('/api/v1/users', UserController);
app.use('/register', UserController);
app.use('/api/v1/login', LoginController);


module.exports = app;
