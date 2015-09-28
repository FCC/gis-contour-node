
function getTVContourByFilenumber(req, res) {

var filenumber = req.params.filenumber;
var filenumber_lower = filenumber.toLowerCase();
var filenumber_upper = filenumber.toUpperCase();
var typeName = "contour:tv_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=filenumber='" + filenumber_upper + "'"; 
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

if (station_class_upper == "A") {
contour_level = 0.1;
}
if (station_class_upper == "B") {
contour_level = 0.5;
}
if (station_class_upper == "C") {
contour_level = 0.5;
}
if (station_class_upper == "D") {
contour_level = 0.5;
}

var typeName = "contour:am_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=antid=" + antid_upper + "+AND+contour_level=" + contour_level; 
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

module.exports.getTVContourByFilenumber = getTVContourByFilenumber;
module.exports.getAMContourByAntennaId = getAMContourByAntennaId;



