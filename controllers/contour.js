
var geo_host = "http://contour-geoserver.elasticbeanstalk.com/";
var geo_space = "contour";

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


function getAllTVFileNumber(req, res) {

var typeName = "contour:tv_contours";

var http = require("http");

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=100000&outputFormat=application/json&propertyName=filenumber&sortBy=filenumber";

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

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1000&outputFormat=application/json&propertyNam=callsign&sortBy=callsign";
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

function getAllFMFileNumber(req, res) {

var typeName = "contour:fm_contours";

var http = require("http");

var url = geo_host + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=100000&outputFormat=application/json&propertyName=filenumber&sortBy=filenumber";
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


module.exports.getTVContourByFilenumber = getTVContourByFilenumber;
module.exports.getTVContourByApplicationId = getTVContourByApplicationId;
module.exports.getFMContourByFilenumber = getFMContourByFilenumber;
module.exports.getFMContourByApplicationId = getFMContourByApplicationId;
module.exports.getAMContourByAntennaId = getAMContourByAntennaId;
module.exports.getAllTVFileNumber = getAllTVFileNumber;
module.exports.getAllTVCallsign = getAllTVCallsign;
module.exports.getAllFMFileNumber = getAllFMFileNumber;


