var con = require('../../config');
var Promise = require('bluebird');
var _ = require ('underscore');

//-----------------Create order----------------------------------
function createOrder (options){
    return new Promise ((resolve,reject) => {
        con.query('INSERT into tb_orders Set ?',options, (error,result) => {
            console.log ('INSERT into tb_orders Set ?',options);
            if(error){
                reject (error)
            }
            resolve(result)
        })
    })
};


module.exports = { createOrder }