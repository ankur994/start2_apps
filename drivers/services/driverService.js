var con = require('../../config');
var Promise = require('bluebird');
var _ = require ('underscore');

//-----------------Register email----------------------
function registerDriver (options){
    return new Promise ((resolve,reject) => {
        con.query('INSERT into tb_drivers Set ?',options,(error,result) => {
            console.log ('INSERT into tb_drivers Set ?',options);
            if(error){
                reject (error)
            }
            resolve(result)
        })
    })
};

//---------------Check driver details already exist or not---------------
function checkDriverDetails (options){
    return new Promise ((resolve, reject) => {
        let sql = 'Select * from tb_drivers where 1 ';
        let params = [];

        if (options.hasOwnProperty('is_deleted')){
            sql += ' AND is_deleted = ?';
            params.push(options.is_deleted)
        }
        
        if(options.driver_id){
            sql += ' AND driver_id = ?';
            params.push(options.driver_id)
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
            console.log('46783468',sql,params)
            if (error){
                reject (error)
            }
            resolve (result)
        })
    })
}

//-------------------Update driver details (Method1)-------------------------------------
function updateUser (options){
    return new Promise ((resolve, reject) => {
        con.query('Update tb_drivers Set ? where email = ?', [options,options.email], (error, result) => {
            console.log ('Update tb_drivers Set ? where email = ?', options,options.email)
            if (error){
                reject (error)
            }
            resolve (result)
        })
    })
}

//-------------------Update user details (Method2)---------------------------
function updateDriver (options){
    return new Promise ((resolve, reject) => {
        let sql = 'Update tb_drivers Set ? where 1';
        let params = [options.updateObj];
        let whereCondition = options.whereCondition;

        if(whereCondition.driver_id){
            sql += ' AND driver_id =?',
            params.push(whereCondition.driver_id)
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


module.exports = { registerDriver, checkDriverDetails, updateUser, updateDriver }