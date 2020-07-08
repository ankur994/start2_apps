var mysql = require ('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ankur12345',
    database: 'start'
});

con.connect((error) => {
    if(error){
        console.log('Error, Database not connected')
    }
    else{
        console.log('Database connected successfully')
    }
});

module.exports = con;