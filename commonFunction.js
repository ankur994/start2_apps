const bcrypt = require('bcrypt');
const saltRounds = 10;
var Promise = require('bluebird');

function bcryptHash(options) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(options, saltRounds, (error, hash) => {
            if (error) {
                reject(error)
            }
            resolve(hash);
        });
    })
}
//---------------------------------------------------------------
function bcryptHashCompare(options, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(options, hash, (error, hash) => {
            // result == true
            if (error) {
                reject(error)
            }
            resolve(hash)
        });
    })
}

//---------------------------------------------------------
function generateOTP() {
    try {
        var digits = '0123456789'; 
        let OTP = ''; 
        for (let i = 0; i < 4; i++ ) { 
            OTP += digits[Math.floor(Math.random() * 10)]; 
        }
        return OTP; 

    } catch (error) {
        return res.send({
            message: 'Invalid otp',
            status: 400,
            data: {}
        });
    }
}

module.exports = { bcryptHash, bcryptHashCompare, generateOTP };