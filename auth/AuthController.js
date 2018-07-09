var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())
var user = require('../user/User')

var verifyToken = require('./VerifyToken')

/**
 * Import jwt dependencies
 */
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')
var config = require('../config')

var authTtl = 120;

/**
 * Api to create new user
 */
router.post('/register', function(req, res) {
    var hashPwd = bcrypt.hashSync(req.body.password);

    user.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPwd
    }, function(err, user) {
        if (err) return res.status(500).send("There was a problem creating new user");
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: authTtl
        });
        res.status(200).send({ auth: true, token: token});
    });
});

/**
 * Api to get payload from JWT
 */
router.get('/me', verifyToken, function(req, res, next) {
    user.findById(req.userId, {password: 0}, function(err, user) {
        if (err) return res.status(500).send({
            message: "There was a problem with server."
        });
        if (!user) return res.status(404).send({
            message: "User was not found."
        });
        res.status(200).send(user);
    })
});

/**
 * Middleware function
 */
router.use(function (data, req, res, next) {
    res.status(200).send(data);
});

/**
 * Api to authenticate certain user.
 */
router.post('/login', function(req, res) {
    user.findOne({
        email: req.body.email
    }, function(err, data) {
        if (err) return res.status(500).send({
            message: 'There was problem using this Api.'
        });
        if (!data) return res.status(404).send({
            message: 'Not user found.'
        });
        var isValidPwd = bcrypt.compareSync(req.body.password, data.password);
        if (!isValidPwd) return res.status(401).send({
            message: 'Password entered is wrong.'
        });
        var token = jwt.sign({ id: data._id }, config.secret, {
            expiresIn: authTtl
        });
        
        res.status(200).send({ auth: true, token: token});
    })
});

/**
 * Export api into our main App.
 */
module.exports = router;