var jwt = require('jsonwebtoken')
var config = require('../config')

/**
 * Function to check if request has correct token.
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(404).send({
        auth: false,
        message: 'No token was provider.'
    });
    jwt.verify(token, config.secret, function(err, data) {
        if (err) return res.status(500).send({
            auth: false, 
            message: 'failed to authenticate token.'
        });

        /**if everything is fine then save data to another request.*/
        req.userId = data.id;
        next();
    });
}

//Export function to cross cutting concern.
module.exports = verifyToken;