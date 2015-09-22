


//getTVContourByCallsign
//router.get('/getTVContourByCallsign/:callsign', function(req, res, next)
function getTVContourByCallsign {
var callsign = req.params.callsign;
var callsign_lower = callsign.toLowerCase();
var callsign_upper = callsign.toUpperCase();
var typeName = "contour:tv_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=callsign='" + callsign_upper + "'"; 
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
                                           
function callback(data) {
res.send(data);
}
});

//getTVContourByFileNumber
router.get('/getTVContourByFileNumber/:filenumber', function(req, res, next) {
var filenumber = req.params.filenumber
var filenumber_lower = filenumber.toLowerCase();
var filenumber_upper = filenumber.toUpperCase();
var typeName = "contour:tv_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=filenumber='" + filenumber_upper +"'";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               callback(data);
                                   });
                                     }).on("error", function() {
                                         callback(null);
                                           });

function callback(data) {
res.send(data);
}
});

//getTVContourByApplicationId
router.get('/getTVContourByApplicationId/:application_id', function(req, res, next) {
var application_id = req.params.application_id
var typeName = "contour:tv_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=application_id=" + application_id;
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               callback(data);
                                   });
                                     }).on("error", function() {
                                         callback(null);
                                           });

function callback(data) {
res.send(data);
}
});

//getFMContourByCallsign
router.get('/getFMContourByCallsign/:callsign', function(req, res, next) {
var callsign = req.params.callsign;
var callsign_lower = callsign.toLowerCase();
var callsign_upper = callsign.toUpperCase();
var typeName = "contour:fm_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=callsign='" + callsign_upper + "'";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               callback(data);
                                   });
                                     }).on("error", function() {
                                         callback(null);
                                           });

function callback(data) {
res.send(data);
}
});

//getFMContourByFileNumber
router.get('/getFMContourByFileNumber/:filenumber', function(req, res, next) {
var filenumber = req.params.filenumber
var filenumber_lower = filenumber.toLowerCase();
var filenumber_upper = filenumber.toUpperCase();
var typeName = "contour:fm_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=filenumber='" + filenumber_upper +"'";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               callback(data);
                                   });
                                     }).on("error", function() {
                                         callback(null);
                                           });

function callback(data) {
res.send(data);
}
});

//getFMContourByApplicationId
router.get('/getFMContourByApplicationId/:application_id', function(req, res, next) {
var application_id = req.params.application_id
var typeName = "contour:fm_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=application_id=" + application_id;
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               callback(data);
                                   });
                                     }).on("error", function() {
                                         callback(null);
                                           });

function callback(data) {
res.send(data);
}
});

//getAMContourByCallsign
router.get('/getAMContourByCallsign/:callsign', function(req, res, next) {
var callsign = req.params.callsign;
var callsign_lower = callsign.toLowerCase();
var callsign_upper = callsign.toUpperCase();
var level = 0.250;
var typeName = "contour:am_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=callsign='" + callsign_upper + "' AND contour_level=" + level;
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               callback(data);
                                   });
                                     }).on("error", function() {
                                         callback(null);
                                           });

function callback(data) {
res.send(data);
}
});


//getAMContourByAntennaId
router.get('/getAMContourByAntennaId/:antid', function(req, res, next) {
var antid = req.params.antid;
var level = 0.250;
var typeName = "contour:am_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=1&outputFormat=application/json&cql_filter=antid=" + antid + " AND contour_level=" + level;
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               callback(data);
                                   });
                                     }).on("error", function() {
                                         callback(null);
                                           });

function callback(data) {
res.send(data);
}
});


router.get('/getAllTVCallsign', function(req, res, next) {
var typeName = "contour:tv_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=100000&outputFormat=application/json&propertyName=callsign";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               callback(data);
                                   });
                                     }).on("error", function() {
                                         callback(null);
                                           });

function callback(data) {
res.send(data);
}
});


router.get('/getAllFMCallsign', function(req, res, next) {
var typeName = "contour:fm_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=100000&outputFormat=application/json&propertyName=callsign";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               callback(data);
                                   });
                                     }).on("error", function() {
                                         callback(null);
                                           });

function callback(data) {
res.send(data);
}
});


router.get('/getAllAMCallsign', function(req, res, next) {
var typeName = "contour:am_contours";

var http = require("http");

url = "http://contour-geoserver.elasticbeanstalk.com/contour/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typeName + "&maxFeatures=100000&outputFormat=application/json&propertyName=callsign";
   http.get(url, function(res1) {
       var data = "";
           res1.on('data', function (chunk) {
                 data += chunk;
                     });
                         res1.on("end", function() {
                               callback(data);
                                   });
                                     }).on("error", function() {
                                         callback(null);
                                           });

function callback(data) {
res.send(data);
}
});





module.exports = router;
module.exports = getTVContourByCallsign;