var express = require ('express');
var session = require('express-session');
var bodyParser = require('body-parser');
app = express();
app.use(express.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
require('./index');
var port = process.env.port || 3005;
var moment = require ('moment');
var path = require('path');


//----------Port Listen---------------
app.listen (port, function(){
    var date = moment().format('MMMM Do YYYY, h:mm:ss a');
    console.log ('Server is running successfully on port ' + port +' at', date);
})
