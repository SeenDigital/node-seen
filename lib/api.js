var request = require('request');
var events = require('events');
var util = require('util');


// Api Object
var Api = {};

// Base URL
var _baseUrl = 'https://platform-api.seencorp.net/';


// Post Handler
Api.post = function (path, payload, next) {
  var self = this;
  var reqUrl = _baseUrl + path;

  var req = request({
    url: reqUrl,
    method: 'POST',
    strictSSL: false,
    json: true,
    body: payload
  }, function(err, res, body) {
    console.log(payload);
    if ( !err ) {
      next(body);

    } else if ( err ) {
      console.error('Error: ' + err);
      throw err;
    }
  });

};


Api.get = function (path, params, next) {
  var self = this;
  var reqUrl = _baseUrl + path;

  // Serialize params and append them to the request url if not null
  if( params !== null ) { 
    reqUrl = reqUrl + '?' + serialize(params);
  }

  // GET Request
  var req = request({
    url: reqUrl,
    strictSSL: false,
    json: true
  }, function (err, res, body) {
    next(body);
  });

  req.on('err', function(err) {
    console.error('Error: ' + err);
    throw err;
  });

};


var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
  return str.join("&");
};


module.exports = Api;
