var con = require('../../config');
var Promise = require('bluebird');
var _ = require ('underscore');

//-----------------Register product----------------------------------
function registerProduct (options){
    return new Promise ((resolve,reject) => {
        con.query('INSERT into tb_products Set ?',options, (error,result) => {
            console.log ('INSERT into tb_products Set ?',options);
            if(error){
                reject (error)
            }
            resolve(result)
        })
    })
};

//---------------Check product details already exist or not---------------
function checkProduct(options) {
    return new Promise((resolve, reject) => {
        let sql = 'Select * from tb_products where 1 ';
        let params = [];

        if(options.product_id){
            sql += 'AND product_id = ?';
            params.push(options.product_id)
        }
        if(options.is_blocked){
            sql += 'AND is_blocked = ?';
            params.push(options.is_blocked)
        }
        if(options.is_available){
            sql += 'AND is_available = ?';
            params.push(options.is_available)
        }

        con.query(sql,params, (error, result) =>{
            console.log('46783468', sql, params)
            if (error) {
                reject(error)
            }
            resolve(result)
        })
    })
}

//-------------------Update product details (Method2)---------------------------
function updateProduct (options){
    return new Promise ((resolve, reject) => {
        let sql = 'Update tb_products Set ? where 1';
        let params = [options.updateObj];
        let whereCondition = options.whereCondition;

        if(whereCondition.product_id){
            sql += ' AND product_id =?',
            params.push(whereCondition.product_id)
        }

        con.query(sql, params, (error, result) => {
        console.log(sql,params)
            if (error){
                reject (error)
            }
            resolve (result)
        })
    })
}

module.exports = { registerProduct, checkProduct, updateProduct }