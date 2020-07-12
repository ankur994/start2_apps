var con = require('../../config');
var Promise = require('bluebird');
var _ = require ('underscore');

//-----------------Register email----------------------
function registerUser (options){
    return new Promise ((resolve,reject) => {
        con.query('INSERT into tb_vendors Set ?',options,(error,result) => {
            console.log ('INSERT into tb_vendors Set ?',options);
            if(error){
                reject (error)
            }
            resolve(result)
        })
    })
};

//---------------Check user details already exist or not---------------
function checkDetails (options){
    return new Promise ((resolve, reject) => {
        let sql = 'Select * from tb_vendors where 1 ';
        let params = [];

        if(options.vendor_id){
            sql += ' AND vendor_id = ?';
            params.push(options.vendor_id)
        }

        if(options.email){
            sql += ' AND email = ?';
            params.push(options.email)
        }

        if(options.phone_number){
            sql+= ' AND phone_number = ?';
            params.push(options.phone_number)
        }
        
        if(options.access_token){
            sql+= ' AND access_token = ?';
            params.push(options.access_token)
        }

        con.query (sql, params, function (error, result){
            if (error){
                reject (error)
            }
            resolve (result)
        })
    })
}

//-----------------------Delete email-----------------------------------
function deleteEmail (options){
    return new Promise ((resolve, reject) => {
        con.query ('Delete from tb_vendors where email = ?', options.email, function (error, result){
            console.log ('Delete from tb_vendors where email = ?', options.email);

            if (error){
                reject (error)
            }
            resolve (result)
        })
    })
}

//-------------------Update user details (Method1)-------------------------------------
function updateUser (options){
    return new Promise ((resolve, reject) => {
        con.query('Update tb_vendors Set ? where email = ?', [options,options.email], (error, result) => {
            console.log ('Update tb_vendors Set ? where email = ?', options,options.email)
            if (error){
                reject (error)
            }
            resolve (result)
        })
    })
}

//-------------------Update user details (Method2)---------------------------
function updateVendor (options){
    return new Promise ((resolve, reject) => {
        let sql = 'Update tb_vendors Set ? where 1';
        let params = [options.updateObj];
        let whereCondition = options.whereCondition;

        if(whereCondition.vendor_id){
            sql += ' AND vendor_id =?',
            params.push(whereCondition.vendor_id)
        }
        if(whereCondition.email){
            sql += ' AND email =?',
            params.push(whereCondition.email)
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


module.exports = { registerUser, checkDetails, deleteEmail, updateUser, updateVendor }