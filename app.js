var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
app.use('/api/users', UserController);

var authController = require('./auth/AuthController');
app.use('/api/auth', authController);

module.exports = app;