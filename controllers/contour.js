
// **********************************************************

'use strict';

// **********************************************************

var configEnv = require('../config/env.json');
var NODE_ENV = process.env.NODE_ENV;
var NODE_PORT =  process.env.PORT || configEnv[NODE_ENV].NODE_PORT;
var host =  configEnv[NODE_ENV].HOST;
var geo_host =  configEnv[NODE_ENV].GEO_HOST;
var geo_space = configEnv[NODE_ENV].GEO_SPACE;

// **********************************************************

console.log('contour ' + host);


var http = require('http');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var fs = require('fs');
var request = require('request');

// **********************************************************



function getContour(req, res) {
	
	var serviceType = req.params.serviceType.toLowerCase();
	var idType = req.params.idType.toLowerCase();
	var idValue = req.params.id.toLowerCase();
	var format = req.params.ext;
	
	if (!format) {
		format = 'json';
	}
	else {
		format.toLowerCase();
	}	
	
	console.log('serviceType ' + serviceType);
	console.log('idType ' + idType);
	console.log('idValue ' + idValue);
	console.log('format ' + format);

	var outputFormat = 'application/json';
	
	if (format == 'json') {
		outputFormat = 'application/json';
	}
	else if (format == 'jsonp') {
		outputFormat = 'text/javascript';
	}
	else if (format == 'gml') {
		outputFormat = 'GML3';
	}
	else if (format == 'csv') {
		outputFormat = 'csv';
	}
	else if (format == 'shp') {
		outputFormat = 'shape-zip';
	}
	else if (format == 'kml') {
		outputFormat = 'kml';
	}
	
	console.log('outputFormat ' + outputFormat);

	// **********************************************************

	var stationClass = 'b'; //default
	var timePeriod = 'daytime'; //default
	var contour_level = 0.5;

	if (serviceType == 'am') {
	
		if (req.params.stationClass) {
			stationClass = req.params.stationClass.toLowerCase();
		}
		if (req.params.timePeriod) {
			timePeriod = req.params.timePeriod + 'time'.toLowerCase();
		}		
		if (stationClass == 'a') {
			contour_level = 0.025;
		}
		// b, c, d = 0.5

	}

	console.log('stationClass ' + stationClass);
	console.log('timePeriod ' + timePeriod);
	console.log('contour_level ' + contour_level);
	
	
	// **********************************************************
	
	var typeName = 'contour:' + serviceType + '_contours';
	var filter;
	
	if (idType == 'applicationid') {
		filter = 'application_id=' + idValue;
	}
	else if (idType == 'filenumber') {
		filter = 'filenumber=\'' + idValue + '\'';
	}
	else if (idType == 'callsign') {
		filter = 'callsign=\'' + idValue + '\'';
	}
	else if (idType == 'antennaid') {
		filter = 'antid=' + idValue;
	}
	else if (idType == 'facilityid') {
		filter = 'facility_id=' + idValue;
	}

	if (serviceType == 'am') {
		filter += '+AND+contour_level=' + contour_level + '+AND+time_period=\'' + timePeriod + '\'';
	}
	
	console.log('filter ' + filter);

	var getUrl = geo_host + '/' + geo_space + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typeName + '&maxFeatures=1&outputFormat=' + outputFormat + '&cql_filter=' + filter; 

	console.log('getUrl ' + getUrl);	
	
	
	
	
	

	// **********************************************************
	/*
	http.get(url, function(getRes) {
	
		var getdata = '';
	   
		getRes.on('data', function (chunk) {
			getdata += chunk;
		});
		
		getRes.on('end', function() {
			res.send(getdata);
		});
		
	}).on('error', function(getErr) {
		
		console.error('getErr.stack : ' + getErr.stack);
		console.error('getErr.name : ' + getErr.name);
		console.error('getErr.message : ' + getErr.message);
    
		var err_res = {};       
		err_res.responseStatus = {
			'status': 500,
			'type': 'Internal Server Error',
			'err': getErr.name +': '+ getErr.message      
		};  
			
		res.status(500);
		res.send(err_res);		
		
	});
	*/
	
	// **********************************************************
		
	request({url: getUrl, encoding: null}, function (err, response, body) {
		
		if (err) {
				
			console.error('err.stack : ' + err.stack);
			console.error('err.name : ' + err.name);
			console.error('err.message : ' + err.message);
		
			var err_res = {};       
			err_res.responseStatus = {
				'status': 500,
				'type': 'Internal Server Error',
				'err': err.name +': '+ err.message      
			};  
				
			res.status(500);
			res.send(err_res);				
			
		}
		else {
		
			console.log('response.statusCode : ' + response.statusCode);			
			console.log('response.headers[content-type] : ' + response.headers['content-type']);
			console.log('response.headers : ' + JSON.stringify(response.headers) );		
			
			var content_type = response.headers['content-type'];
			
			if ((!response.statusCode == 200))  {			
			
				console.error('response.statusCode : ' + response.statusCode);
			
				var err_res = {};       
				err_res.responseStatus = {
					'status': 500,
					'type': 'Internal Server Error',
					'err': 'Response: '+ response.statusCode      
				};  
					
				res.status(500);
				res.send(err_res);	
			
			}
			else if (content_type == 'text/xml;charset=UTF-8')  {			
			
				console.error('content_type : ' + content_type);
			
				var err_res = {};       
				err_res.responseStatus = {
					'status': 500,
					'type': 'Internal Server Error',
					'err': 'Content: '+ content_type      
				};  
					
				res.status(500);
				res.send(err_res);	
			
			}
			else {
				
				var content_ext = format;
				
				if (format == 'shp') {

					content_ext = 'zip';
				}							
				
				var filename_attach = 'contour-' + idType + '-' + idValue + '.' + content_ext;
				
				console.log('content_type ' + content_type);	
				console.log('content_ext ' + content_ext);
				console.log('filename_attach ' + filename_attach);
				
				res.set({
					//'Content-Disposition': 'attachment; filename=\''+filename_attach+'\'',
					'Content-Type': content_type,
					'Content-Length': body.length
				});
		
				res.send(body);
			
			}
		}		
	});	
}


/*
function contour(req, res) {
	
	var serviceType = req.params.serviceType;
	var serviceType = serviceType.toLowerCase();
	var serviceType_upper = serviceType.toUpperCase();
	var idType = req.params.idType;
	var idType = idType.toLowerCase();
	var idType_upper = idType.toUpperCase();
	var id_format = req.params.id_format;
	var id = id_format.split('.')[0];
	var id_lower = id.toLowerCase();
	var id_upper = id.toUpperCase();
	var format = id_format.split('.')[1];
	var format_lower = format.toLowerCase();
	var format_upper = format.toUpperCase();

	var outputFormat = 'application/json';
	if (format_lower == 'json') {
		outputFormat = 'application/json';
	}
	else if (format_lower == 'gml2') {
		outputFormat = 'GML2';
	}
	else if (format_lower == 'gml3') {
		outputFormat = 'GML3';
	}
	else if (format_lower == 'csv') {
	  outputFormat = 'csv';
	}
	else if (format_lower == 'shapefile') {
	  outputFormat = 'shape-zip';
	}
	else if (format_lower == 'kml') {
	  outputFormat = 'kml';
	}

	// **********************************************************


	var stationClass = 'B'; //default
	var timePeriod = 'daytime'; //default

	if (serviceType_upper == 'AM') {
		if (req.params.stationClass) {
			stationClass = req.params.stationClass;
		}
		if (req.params.timePeriod) {
			timePeriod = req.params.timePeriod + 'time';
		}

		var stationClass_lower = stationClass.toLowerCase();
		var stationClass_upper = stationClass.toUpperCase();
		var timePeriod_lower = timePeriod.toLowerCase();
		var timePeriod_upper = timePeriod.toUpperCase();

		var contour_level = 0;
		if (stationClass_upper == "A") {
			var contour_level = 0.025;
		}
		if (stationClass_upper == "B") {
			var contour_level = 0.5;
		}
		if (stationClass_upper == "C") {
			var contour_level = 0.5;
		}
		if (stationClass_upper == "D") {
			var contour_level = 0.5;
		}

	}

	var typeName = "contour:" + serviceType + "_contours";

	// **********************************************************

	if (idType == 'applicationid') {
		var filter = "application_id=" + id_upper;
	}
	else if (idType == 'filenumber') {
		var filter = "filenumber='" + id_upper + "'";
	}
	else if (idType == 'callsign') {
		var filter = "callsign='" + id_upper + "'";
	}
	else if (idType == 'antennaid') {
		var filter = "antid=" + id_upper;
	}
	else if (idType == 'facilityid') {
		var filter = "facility_id=" + id_upper;
	}

	if (serviceType_upper == 'AM') {
		filter += "+AND+contour_level=" + contour_level + "+AND+time_period='" + timePeriod_lower + "'";
	}


	var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=" + outputFormat + "&cql_filter=" + filter; 

	console.log(url);

		http.get(url, function(res1) {
			var data = "";
		   
			res1.on('data', function (chunk) {
				data += chunk;
			});
			res1.on("end", function() {
				res.send(data);
			});
		}).on("error", function() {
											
		//callback(null);
		});

}
*/
	
// **********************************************************
/*
function download(req, res) {
	
	var serviceType = req.params.serviceType;
	var serviceType = serviceType.toLowerCase();
	var serviceType_upper = serviceType.toUpperCase();
	var idType = req.params.idType;
	var idType = idType.toLowerCase();
	var idType_upper = idType.toUpperCase();
	var id_format = req.params.id_format;
	var id = id_format.split('.')[0];
	var id_lower = id.toLowerCase();
	var id_upper = id.toUpperCase();
	var format = id_format.split('.')[1];
	var format_lower = format.toLowerCase();
	var format_upper = format.toUpperCase();

	var formatList = ["json", "gml2", "gml3", "csv", "kml", "zip"];
	var formatOK = false;
	for (var i = 0; i < formatList.length; i++) {
		if (format_lower == formatList[i]) {
			formatOK = true;
		}	
	}

	if (!formatOK) {
		res.send("Wrong format:<br> formats must be json, gml2, gml3, csv, kml, or zip");
		return;
	}


	var outputFormat = 'application/json';
	if (format_lower == 'json') {
		outputFormat = 'application/json';
	}
	else if (format_lower == 'gml2') {
		outputFormat = 'GML2';
	}
	else if (format_lower == 'gml3') {
		outputFormat = 'GML3';
	}
	else if (format_lower == 'csv') {
	  outputFormat = 'csv';
	}
	else if (format_lower == 'zip') {
	  outputFormat = 'shape-zip';
	}
	else if (format_lower == 'kml') {
	  outputFormat = 'kml';
	}


	var stationClass = 'B'; //default
	var timePeriod = 'daytime'; //default

	if (serviceType_upper == 'AM') {
		if (req.params.stationClass) {
			stationClass = req.params.stationClass;
		}
		if (req.params.timePeriod) {
			timePeriod = req.params.timePeriod + 'time';
		}

		var stationClass_lower = stationClass.toLowerCase();
		var stationClass_upper = stationClass.toUpperCase();
		var timePeriod_lower = timePeriod.toLowerCase();
		var timePeriod_upper = timePeriod.toUpperCase();


		var contour_level = 0.5; // default
		if (stationClass_upper == "A") {
			var contour_level = 0.025;
		}
	}

	var typeName = "contour:" + serviceType + "_contours";

	if (idType == 'applicationid') {
		var filter = "application_id=" + id_upper;
	}
	else if (idType == 'filenumber') {
		var filter = "filenumber='" + id_upper + "'";
	}
	else if (idType == 'callsign') {
		var filter = "callsign='" + id_upper + "'";
	}
	else if (idType == 'antennaid') {
		var filter = "antid=" + id_upper;
	}
	else if (idType == 'facilityid') {
		var filter = "facility_id=" + id_upper;
	}

	if (serviceType_upper == 'AM') {
		filter += "+AND+contour_level=" + contour_level + "+AND+time_period='" + timePeriod_lower + "'";
	}


	var url = geo_host + "/" +  geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=" + outputFormat + "&cql_filter=" + filter; 

	console.log("request GeoServer: " + url + "\n");
	
	// **********************************************************
	
	request({url: url, encoding: null}, function (err, response, body) {

		if (!err && response.statusCode == 200) {
			var format1 = format_lower;
			if (format1 == "zip") {
				var content_type = "application/x-zip";
			}
			else if (format1 == "json") {
					var content_type = "application/json";
			}
			else {
				var content_type = "text/" + format1;
			}
			
			if (format1 == "gml2" || format1 == "gml3") {
				var format1 = "gml";
			}
			
			var filename_attach = "contour_" + idType + "-" + id + "." + format1;

			if (format1 == "zip") {	
				res.set({
					"Content-Disposition": 'attachment; filename="'+filename_attach+'"',
					"Content-Type": content_type,
					"Content-Length": body.length
				});
		
				res.send(body);
			}
			else {
				res.set({
					"Content-Disposition": 'attachment; filename="'+filename_attach+'"',
					"Content-Type": content_type,
					"Content-Length": body.length
				});
				
				res.send(body);
			}
		}
		else {
		console.log(err);
		}
	});



}
*/

// **********************************************************

function id(req, res) {

	var serviceType = req.params.serviceType;
	var serviceType = serviceType.toLowerCase();
	var serviceType_upper = serviceType.toUpperCase();
	var idType_format = req.params.idType_format;
	var idType = idType_format.split('.')[0];
	var idType = idType.toLowerCase();
	var idType_upper = idType.toUpperCase();
	var format = idType_format.split('.')[1];
	var format_lower = format.toLowerCase();
	var format_upper = format.toUpperCase();

	var outputFormat = 'application/json';

	var contour_level = 0.025;

	if (idType == 'applicationid') {
		var propertyName = 'application_id';
	}
	else if (idType == 'filenumber') {
		var propertyName = 'filenumber';
	}
	else if (idType == 'callsign') {
		var propertyName = 'callsign';
	}
	else if (idType == 'antennaid') {
		var propertyName = 'antid';
	}
	else if (idType == 'facilityid') {
		var propertyName = 'facility_id';
	}

	var filter = '';
	if (serviceType_upper == 'AM') {
		filter = "&cql_filter=contour_level=" + contour_level + "+AND+time_period='daytime'"
	}

	var typeName = "contour:" + serviceType + "_contours";



	var url = geo_host + "/" +  geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=" + outputFormat + "&propertyName=" + propertyName + "&sortBy=" + propertyName + filter;
	 
	 console.log(url);
	 
	http.get(url, function(res1) {
		var data = "";
		res1.on('data', function (chunk) {
			data += chunk;
		});
		res1.on("end", function() {
			var data_json = JSON.parse(data);
			var data1 = [];
			for (var i = 0; i < data_json.features.length; i++) {
				data1.push(data_json.features[i].properties[propertyName]);
			}
			res.send({list: data1});
		});
	}).on("error", function() {
		console.log("error");
	});
}

// **********************************************************

function getTVContourByFilenumber(req, res) {

	var filenumber = req.params.filenumber;
	var filenumber_lower = filenumber.toLowerCase();
	var filenumber_upper = filenumber.toUpperCase();
	var typeName = "contour:tv_contours";

	var http = require("http");

	var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=filenumber='" + filenumber_upper + "'"; 
	http.get(url, function(res1) {
		var data = "";
		res1.on('data', function (chunk) {
			data += chunk;
		});
		res1.on("end", function() {
			res.send(data);
		});
	}).on("error", function() {

	//callback(null);
	});
}

function getTVContourByApplicationId(req, res) {

	var application_id = req.params.application_id;
	var application_id_lower = application_id.toLowerCase();
	var application_id_upper = application_id.toUpperCase();
	var typeName = "contour:tv_contours";

	var http = require("http");

	var url = geo_host + "/" +  geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=application_id=" + application_id_upper; 
	http.get(url, function(res1) {
		var data = "";
		res1.on('data', function (chunk) {
			data += chunk;
		});
		res1.on("end", function() {
			res.send(data);
		});
	}).on("error", function() {

	//callback(null);
	});
}

// **********************************************************
function getTVContourByCallsign(req, res) {

	var callsign = req.params.callsign;
	var callsign_lower = callsign.toLowerCase();
	var callsign_upper = callsign.toUpperCase();
	var typeName = "contour:tv_contours";

	var http = require("http");

	var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=callsign='" + callsign_upper + "'"; 
	
	http.get(url, function(res1) {
		var data = "";
		res1.on('data', function (chunk) {
			data += chunk;
		});
		res1.on("end", function() {
			res.send(data);
		});
	}).on("error", function() {
		//callback(null);
	});
}

// **********************************************************

function getFMContourByFilenumber(req, res) {

var filenumber = req.params.filenumber;
var filenumber_lower = filenumber.toLowerCase();
var filenumber_upper = filenumber.toUpperCase();
var typeName = "contour:fm_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=filenumber='" + filenumber_upper + "'"; 
	
	http.get(url, function(res1) {
	var data = "";
	res1.on('data', function (chunk) {
	data += chunk;
	});
	res1.on("end", function() {
	res.send(data);
	});
	}).on("error", function() {

	//callback(null);
	});
}

// **********************************************************

function getFMContourByApplicationId(req, res) {

var application_id = req.params.application_id;
var application_id_lower = application_id.toLowerCase();
var application_id_upper = application_id.toUpperCase();
var typeName = "contour:fm_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=application_id=" + application_id_upper; 
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               res.send(data);
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });
}

// **********************************************************

function getFMContourByCallsign(req, res) {

var callsign = req.params.callsign;
var callsign_lower = callsign.toLowerCase();
var callsign_upper = callsign.toUpperCase();
var typeName = "contour:fm_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=callsign='" + callsign_upper + "'"; 
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               res.send(data);
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });
}
          
// **********************************************************

function getAMContourByAntennaId(req, res) {

var antid = req.params.antid;
var antid_lower = antid.toLowerCase();
var antid_upper = antid.toUpperCase();
var station_class = req.params.station_class;
var station_class_lower = station_class.toLowerCase();
var station_class_upper = station_class.toUpperCase();
var time_period = req.params.time_period;
var time_period_lower = time_period.toLowerCase();
var time_period_upper = time_period.toUpperCase();

var contour_level = 0;
if (station_class_upper == "A") {
var contour_level = 0.1;
}
if (station_class_upper == "B") {
var contour_level = 0.5;
}
if (station_class_upper == "C") {
var contour_level = 0.5;
}
if (station_class_upper == "D") {
var contour_level = 0.5;
}

var typeName = "contour:am_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=antid=" + antid_upper + "+AND+contour_level=" + contour_level + "+AND+time_period='" + time_period_lower + "'"; 
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               res.send(data);
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });
}

// **********************************************************

function getAMContourByCallsign(req, res) {

var callsign = req.params.callsign;
var callsign_lower = callsign.toLowerCase();
var callsign_upper = callsign.toUpperCase();
var station_class = req.params.station_class;
var station_class_lower = station_class.toLowerCase();
var station_class_upper = station_class.toUpperCase();
var time_period = req.params.time_period;
var time_period_lower = time_period.toLowerCase();
var time_period_upper = time_period.toUpperCase();

var contour_level = 0;
if (station_class_upper == "A") {
var contour_level = 0.1;
}
if (station_class_upper == "B") {
var contour_level = 0.5;
}
if (station_class_upper == "C") {
var contour_level = 0.5;
}
if (station_class_upper == "D") {
var contour_level = 0.5;
}

var typeName = "contour:am_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=callsign='" + callsign_upper + "'+AND+contour_level=" + contour_level + "+AND+time_period='" + time_period_lower + "'"; 
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               res.send(data);
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });
}

// **********************************************************

function getAllTVFileNumber(req, res) {

var typeName = "contour:tv_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=100&outputFormat=application/json&propertyName=filenumber&sortBy=filenumber";


   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
						 var data_json = JSON.parse(data);
							var data1 = [];
							for (var i = 0; i < data_json.features.length; i++) {
								data1.push(data_json.features[i].properties.filenumber);
							}
                               res.send({filenumber: data1});
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });
}

// **********************************************************

function getAllTVCallsign(req, res) {

var typeName = "contour:tv_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=callsign&sortBy=callsign";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
						 var data_json = JSON.parse(data);
							var data1 = [];
							for (var i = 0; i < data_json.features.length; i++) {
								data1.push(data_json.features[i].properties.callsign);
							}
                               res.send({callsign: data1});
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });
}

function getAllTVApplicationId(req, res) {

var typeName = "contour:tv_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=application_id&sortBy=application_id";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
						 var data_json = JSON.parse(data);
							var data1 = [];
							for (var i = 0; i < data_json.features.length; i++) {
								data1.push(data_json.features[i].properties.application_id);
							}
                               res.send({application_id: data1});
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });
}


function getAllFMFileNumber(req, res) {

var typeName = "contour:fm_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=filenumber&sortBy=filenumber";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
						 var data_json = JSON.parse(data);
							var data1 = [];
							for (var i = 0; i < data_json.features.length; i++) {
								data1.push(data_json.features[i].properties.filenumber);
							}
                               res.send({filenumber: data1});
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });
}

// **********************************************************

function getAllFMCallsign(req, res) {

var typeName = "contour:fm_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=callsign&sortBy=callsign";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
						 var data_json = JSON.parse(data);
							var data1 = [];
							for (var i = 0; i < data_json.features.length; i++) {
								data1.push(data_json.features[i].properties.callsign);
							}
                               res.send({callsign: data1});
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });
}

// **********************************************************

function getAllFMApplicationId(req, res) {

var typeName = "contour:fm_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=application_id&sortBy=application_id";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
						 var data_json = JSON.parse(data);
							var data1 = [];
							for (var i = 0; i < data_json.features.length; i++) {
								data1.push(data_json.features[i].properties.application_id);
							}
                               res.send({application_id: data1});
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });
}

// **********************************************************

function getAllAMAntennaId(req, res) {

var typeName = "contour:am_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=antid&sortBy=antid&cql_filter=contour_level=0.25";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
						 var data_json = JSON.parse(data);
							var data1 = [];
							for (var i = 0; i < data_json.features.length; i++) {
								data1.push(data_json.features[i].properties.antid);
							}
                               res.send({antenna_id: data1});
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });
}

function getAllAMCallsign(req, res) {

var typeName = "contour:am_contours";

var http = require("http");

var url = geo_host + "/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=callsign&sortBy=callsign&cql_filter=contour_level=0.25";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
						 var data_json = JSON.parse(data);
							var data1 = [];
							for (var i = 0; i < data_json.features.length; i++) {
								data1.push(data_json.features[i].properties.callsign);
							}
                               res.send({callsign: data1});
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });
}

// **********************************************************

module.exports.getContour = getContour;
//module.exports.contour = contour;
//module.exports.download = download;
module.exports.id = id;
module.exports.getTVContourByFilenumber = getTVContourByFilenumber;
module.exports.getTVContourByApplicationId = getTVContourByApplicationId;
module.exports.getTVContourByCallsign = getTVContourByCallsign;
module.exports.getFMContourByFilenumber = getFMContourByFilenumber;
module.exports.getFMContourByApplicationId = getFMContourByApplicationId;
module.exports.getFMContourByCallsign = getFMContourByCallsign;
module.exports.getAMContourByAntennaId = getAMContourByAntennaId;
module.exports.getAMContourByCallsign = getAMContourByCallsign;
module.exports.getAllTVFileNumber = getAllTVFileNumber;
module.exports.getAllTVCallsign = getAllTVCallsign;
module.exports.getAllTVApplicationId = getAllTVApplicationId;
module.exports.getAllFMFileNumber = getAllFMFileNumber;
module.exports.getAllFMCallsign = getAllFMCallsign;
module.exports.getAllFMApplicationId = getAllFMApplicationId;
module.exports.getAllAMAntennaId = getAllAMAntennaId;
module.exports.getAllAMCallsign = getAllAMCallsign;