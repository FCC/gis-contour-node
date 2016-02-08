
var geo_host = "http://contour-geoserver.elasticbeanstalk.com/";
var geo_space = "contour";

var host = "localhost:6479";

var http = require("http");
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var xml = require('xml');
var fs = require('fs');

function contour(req, res) {
var serviceType = req.params.serviceType;
var serviceType_lower = serviceType.toLowerCase();
var serviceType_upper = serviceType.toUpperCase();
var idType = req.params.idType;
var idType_lower = idType.toLowerCase();
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

var typeName = "contour:" + serviceType_lower + "_contours";



if (idType_lower == 'applicationid') {
var filter = "application_id=" + id_upper;
}
else if (idType_lower == 'filenumber') {
var filter = "filenumber='" + id_upper + "'";
}
else if (idType_lower == 'callsign') {
var filter = "callsign='" + id_upper + "'";
}
else if (idType_lower == 'antennaid') {
var filter = "antid=" + id_upper;
}
else if (idType_lower == 'facilityid') {
var filter = "facility_id=" + id_upper;
}

if (serviceType_upper == 'AM') {
filter += "+AND+contour_level=" + contour_level + "+AND+time_period='" + timePeriod_lower + "'";
}


var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=" + outputFormat + "&cql_filter=" + filter; 

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

function download(req, res) {
var serviceType = req.params.serviceType;
var serviceType_lower = serviceType.toLowerCase();
var serviceType_upper = serviceType.toUpperCase();
var idType = req.params.idType;
var idType_lower = idType.toLowerCase();
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

var typeName = "contour:" + serviceType_lower + "_contours";

if (idType_lower == 'applicationid') {
var filter = "application_id=" + id_upper;
}
else if (idType_lower == 'filenumber') {
var filter = "filenumber='" + id_upper + "'";
}
else if (idType_lower == 'callsign') {
var filter = "callsign='" + id_upper + "'";
}
else if (idType_lower == 'antennaid') {
var filter = "antid=" + id_upper;
}
else if (idType_lower == 'facilityid') {
var filter = "facility_id=" + id_upper;
}

if (serviceType_upper == 'AM') {
filter += "+AND+contour_level=" + contour_level + "+AND+time_period='" + timePeriod_lower + "'";
}


var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=" + outputFormat + "&cql_filter=" + filter; 

console.log(url);

   http.get(url, function(res1) {
       var data = "";
			res1.setEncoding('binary');
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
								var d = new Date();
								format1 = format;
								if (format1 == "shapefile") {
									format1 = "zip";
								}
								
								var filename = "contour_" + idType_lower + "-" + id + "_format-" + format + "_time-" +  d.getUTCFullYear() + "-" + d.getUTCMonth() + "-" + d.getUTCDate() + "-" + d.getUTCHours() + "-" + d.getUTCMinutes() + "-" + d.getUTCMilliseconds() + "." + format1;
								var filepath = "public/downloads/" + filename;
								var link = host + "/downloads/" + filename;
								console.log(link);
								fs.writeFile(filepath, data, 'binary', function(err) {
									if(err) {
										return console.log(err);
									}
									console.log("write download file " + filepath);
								});
								var link = "<!DOCTYPE html><html><body><a href=\"" + link + "\" download>" + filename + "</a><br>(right-click on the above link, select Open Link in New Window, then open or save the file. Please use Firefox browser.)</body></html>";
								res.header("content-type", "text/html");
                               res.send(link);
                                   });
                                     }).on("error", function() {
										
                                         //callback(null);
                                           });

}



function id(req, res) {

var serviceType = req.params.serviceType;
var serviceType_lower = serviceType.toLowerCase();
var serviceType_upper = serviceType.toUpperCase();
var idType_format = req.params.idType_format;
var idType = idType_format.split('.')[0];
var idType_lower = idType.toLowerCase();
var idType_upper = idType.toUpperCase();
var format = idType_format.split('.')[1];
var format_lower = format.toLowerCase();
var format_upper = format.toUpperCase();

var outputFormat = 'application/json';

var contour_level = 0.025;

if (idType_lower == 'applicationid') {
var propertyName = 'application_id';
}
else if (idType_lower == 'filenumber') {
var propertyName = 'filenumber';
}
else if (idType_lower == 'callsign') {
var propertyName = 'callsign';
}
else if (idType_lower == 'antennaid') {
var propertyName = 'antid';
}

var filter = '';
if (serviceType_upper == 'AM') {
filter = "&cql_filter=contour_level=" + contour_level + "+AND+time_period='daytime'"
}

var typeName = "contour:" + serviceType_lower + "_contours";



var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=" + outputFormat + "&propertyName=" + propertyName + "&sortBy=" + propertyName + filter;
 
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
										
                                         //callback(null);
                                           });
}



function getTVContourByFilenumber(req, res) {

var filenumber = req.params.filenumber;
var filenumber_lower = filenumber.toLowerCase();
var filenumber_upper = filenumber.toUpperCase();
var typeName = "contour:tv_contours";

var http = require("http");

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=filenumber='" + filenumber_upper + "'"; 
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

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=application_id=" + application_id_upper; 
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

function getTVContourByCallsign(req, res) {

var callsign = req.params.callsign;
var callsign_lower = callsign.toLowerCase();
var callsign_upper = callsign.toUpperCase();
var typeName = "contour:tv_contours";

var http = require("http");

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=callsign='" + callsign_upper + "'"; 
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


function getFMContourByFilenumber(req, res) {

var filenumber = req.params.filenumber;
var filenumber_lower = filenumber.toLowerCase();
var filenumber_upper = filenumber.toUpperCase();
var typeName = "contour:fm_contours";

var http = require("http");

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=filenumber='" + filenumber_upper + "'"; 
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

function getFMContourByApplicationId(req, res) {

var application_id = req.params.application_id;
var application_id_lower = application_id.toLowerCase();
var application_id_upper = application_id.toUpperCase();
var typeName = "contour:fm_contours";

var http = require("http");

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=application_id=" + application_id_upper; 
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

function getFMContourByCallsign(req, res) {

var callsign = req.params.callsign;
var callsign_lower = callsign.toLowerCase();
var callsign_upper = callsign.toUpperCase();
var typeName = "contour:fm_contours";

var http = require("http");

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=callsign='" + callsign_upper + "'"; 
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

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=antid=" + antid_upper + "+AND+contour_level=" + contour_level + "+AND+time_period='" + time_period_lower + "'"; 
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

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=callsign='" + callsign_upper + "'+AND+contour_level=" + contour_level + "+AND+time_period='" + time_period_lower + "'"; 
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


function getAllTVFileNumber(req, res) {

var typeName = "contour:tv_contours";

var http = require("http");

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=100&outputFormat=application/json&propertyName=filenumber&sortBy=filenumber";


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

function getAllTVCallsign(req, res) {

var typeName = "contour:tv_contours";

var http = require("http");

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=callsign&sortBy=callsign";
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

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=application_id&sortBy=application_id";
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

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=filenumber&sortBy=filenumber";
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

function getAllFMCallsign(req, res) {

var typeName = "contour:fm_contours";

var http = require("http");

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=callsign&sortBy=callsign";
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

function getAllFMApplicationId(req, res) {

var typeName = "contour:fm_contours";

var http = require("http");

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=application_id&sortBy=application_id";
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

function getAllAMAntennaId(req, res) {

var typeName = "contour:am_contours";

var http = require("http");

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=antid&sortBy=antid&cql_filter=contour_level=0.25";
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

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=20&outputFormat=application/json&propertyName=callsign&sortBy=callsign&cql_filter=contour_level=0.25";
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


module.exports.contour = contour;
module.exports.download = download;
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