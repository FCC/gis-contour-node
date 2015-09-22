/*
   ____  _____ _____ ______   ______      ______ 
  / __ \|  __ \_   _|  ____| |  ____|__  |  ____|
 | |  | | |__) || | | |__    | |__ ( _ ) | |__   
 | |  | |  ___/ | | |  __|   |  __|/ _ \/\  __|  
 | |__| | |    _| |_| |      | |  | (_>  < |     
  \____/|_|   |_____|_|      |_|   \___/\/_|     

*/

// **********************************************************
// require 

var express = require('express');

var http = require('http');
var https = require('https');
var cors = require('cors');
var url = require('url');
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fsr = require('file-stream-rotator');
var fs = require('fs');
var morgan = require('morgan');
var js2xmlparser = require('js2xmlparser');

var package_json = require ('./package.json');

var routes = require('./routes.js');

var configEnv = require('./config/env.json');
var pg = require('pg');

// **********************************************************
// config

var NODE_ENV = process.env.NODE_ENV;
console.log('NODE_ENV : '+ NODE_ENV );

var NODE_PORT =  process.env.PORT || configEnv[NODE_ENV].NODE_PORT;
console.log('NODE_PORT : '+ NODE_PORT );

var PG_DB = configEnv[NODE_ENV].PG_DB;

// **********************************************************
// console

console.log('package_json.name : '+ package_json.name );
console.log('package_json.version : '+ package_json.version );
console.log('package_json.description : '+ package_json.description );

// **********************************************************
// app

var app = express();
app.use(cors());

// **********************************************************
// log

var logDirectory = __dirname + '/log';

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var accessLogStream = fsr.getStream({
    filename: logDirectory + '/opif-ff-%DATE%.log',
    frequency: 'daily',
    verbose: false
});

app.use(morgan('combined', {stream: accessLogStream}));

// **********************************************************
// parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// **********************************************************
// client

app.use('/', express.static(__dirname + '/public'));
app.use('/api-docs', express.static(__dirname + '/public/api-docs.html'));

// **********************************************************
//database

var dbConfig = {
  client: "pg", 
  connection: PG_DB
};

var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

app.set('bookshelf', bookshelf);

// **********************************************************
// routes

app.use("/",routes);

// **********************************************************
// error

app.use(function(req, res) {

    var err_res = {};
    
    err_res.responseStatus = {
        'status': 404,
        'type': 'Not Found',
        'err': req.url +' Not Found'        
    };

    res.status(404);
    res.send(err_res);    
});

app.use(function(err, req, res, next) {
    
    //console.log('\n app.use error: ' + err );
    console.error(err.stack);
	
	var err_desc;
	if (NODE_ENV !== 'PROD') {
		err_desc = err.name +': '+ err.message;
	}
    
    var err_res = {};       
    err_res.responseStatus = {
        'status': 500,
        'type': 'Internal Server Error',
        'err': err_desc      
    };  
    
    res.status(500);
    res.send(err_res);
});

process.on('uncaughtException', function (err) {
    //console.log('\n uncaughtException: '+ err);
    console.error(err.stack);
});

// **********************************************************
// server

var server = app.listen(NODE_PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('\n  listening at http://%s:%s', host, port);

});

// **********************************************************
// exports

module.exports = app;