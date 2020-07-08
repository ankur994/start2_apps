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


module.exports = { bcryptHash, bcryptHashCompare };