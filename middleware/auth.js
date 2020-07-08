const secretKey = process.env.JWT_KEY = 'secret';
var jwt = require('jsonwebtoken');

//------------------------Verify Token-------------------------------------  
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        return res.send({
            message: "Something went wrong",
            status: 400,
            data: {}
        })
    }
}

//-----------------------------------------------------
function verify_token(req, res, next) {
    try {
        var bearerToken = req.body.access_token;
        var access_token = bearerToken.split(' ')[1];
        var decode = jwt.verify(access_token, secretKey);
        req.body.userData = decode;
        next();
    } catch (error) {
        return res.send({
            message: 'Invalid token or token expired',
            status: 400,
            data: {}
        });
    }
}

module.exports = { verifyToken, verify_token }