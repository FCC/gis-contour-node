
// require 

var http = require("http");
var https = require("https");
var url = require('url');
var express = require('express');
var path = require('path');
var fsr = require('file-stream-rotator');
var fs = require('fs');
var morgan = require('morgan');
var cors = require('cors');

var bodyparser = require('body-parser');
var package_json = require('./package.json');

var contour = require('./controllers/contour.js');

// **********************************************************
// config

var configEnv = require('./config/env.json');

var NODE_ENV = process.env.NODE_ENV;
//console.log('NODE_ENV : '+ NODE_ENV );

var NODE_PORT =  process.env.PORT || configEnv[NODE_ENV].NODE_PORT;

// **********************************************************
// console start

console.log('package_json.name : '+ package_json.name );
console.log('package_json.version : '+ package_json.version );
console.log('package_json.description : '+ package_json.description );

//console.log('NODE_PORT : '+ NODE_PORT );
//console.log('PG_DB : '+ PG_DB );

// **********************************************************
// app

var app = express();

app.use(cors());

// **********************************************************
// log

var logDirectory = __dirname + '/log';

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var accessLogStream = fsr.getStream({
    filename: logDirectory + '/fcc-pdf-%DATE%.log',
    frequency: 'daily',
    verbose: false
});

app.use(morgan('combined', {stream: accessLogStream}))

// **********************************************************
// parser

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// **********************************************************
// route

app.use('/', express.static(__dirname + '/public'));
app.use('/api-docs', express.static(__dirname + '/public/api-docs.html'));

app.param('uuid', function(req, res, next, uuid){
    // check format of uuid
    if(!serverCheck.checkUUID(uuid)){
		return serverSend.sendErr(res, 'json', 'not_found');
    } else {
        next();
    }
})

app.param('ext', function(req, res, next, ext) {
    // check format of id
	var route = req.route.path;
	//console.log('\n  route : ' + route );
	
	if (!route === '/download/:uuid.:ext') {	// skip for downloads
		if(!serverCheck.checkExt(ext)){
			return serverSend.sendErr(res, 'json', 'invalid_ext');
		} else {
			next();
		}
	}
	else {
		next();
	}
});



app.get('/getTVContourByFilenumber/:filenumber', function(req, res){
contour.getTVContourByFilenumber(req, res);
});

app.get('/getFMContourByFilenumber/:filenumber', function(req, res){
contour.getFMContourByFilenumber(req, res);
});

app.get('/getAMContourByAntennaId/:antid/:station_class/:time_period', function(req, res){
contour.getAMContourByAntennaId(req, res);
});


// getStatus
app.get('/status/:uuid.:ext', function(req, res){
	serverCheck.checkKey(req, res, false, function(){
		serverGet.getStatus(req, res);
	});
});
app.get('/status/:uuid', function(req, res){
	serverCheck.checkKey(req, res, false, function(){
		serverGet.getStatus(req, res);
	});
});

// getHistory
app.get('/history/:uuid.:ext', function(req, res){
    serverCheck.checkKey(req, res, false, function(){
		serverGet.getHistory(req, res);
	});
});
app.get('/history/:uuid', function(req, res){
    serverCheck.checkKey(req, res, false, function(){
		serverGet.getHistory(req, res);
	});
});

// getDownload
app.get('/download/:uuid.:ext', function(req, res){
	//console.log('\n  getDownload a' );
    serverCheck.checkKey(req, res, false, function(){
		//console.log('\n  getDownload b' );
		serverGet.getDownload(req, res);
	});
});
app.get('/download/:uuid', function(req, res){
    serverCheck.checkKey(req, res, false, function(){
		serverGet.getDownload(req, res);
	});
});

// postUpload
app.post('/upload', function(req, res){
	server_post.postUpload(req, res);
});
app.post('/upload(.:ext)', function(req, res){
	server_post.postUpload(req, res);
});

// putRestore
app.put('/restore(.:ext)', function(req, res){
    serverCheck.checkKey(req, res, true, function(){
        server_put.putRestore(req, res);
    });
});

/*
app.put('/privacy(.:ext)', function(req, res){
    serverCheck.checkKey(req, res, true, function(){
        server_put.putFile(req, res, 'privacy');
    });
});
*/

// deleteRemove
app.delete('/remove/:uuid.:ext', function(req, res){
    server_delete.deleteRemove(req, res);
});

app.delete('/remove/:uuid', function(req, res){
    server_delete.deleteRemove(req, res);
});

// deletePurge
app.delete('/purge/:uuid.:ext', function(req, res){
    server_delete.deletePurge(req, res);
});

app.delete('/purge/:uuid', function(req, res){
    server_delete.deletePurge(req, res);
});

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
    
    var err_res = {};       
    err_res.responseStatus = {
        'status': 500,
        'type': 'Internal Server Error',
        'err': err.name +': '+ err.message      
    };  
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
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

module.exports = app;