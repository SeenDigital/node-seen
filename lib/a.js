var util = require('util');
var request = require('request');
var events = require('events');
var eventEmitter = new events.EventEmitter();

// API Wrapper
var SeenApi = function(config) {
  var instagramToken;
  var twitterToken;

  var baseUrl = 'https://platform-api.seencorp.net/';


  // Prototypes
  this.user = function(id, next) {
    var path = 'users/' + id;

    get(path, null, next);
  };

  // GET Campaign Method
  this.campaign = function(id, next) {
    var path;
    if(id === null) {
      path = 'campaigns';
    } else {
      path = 'campaigns/' + id;
    }

    get(path, null, next);
    eventEmitter.emit('end');
  };

  // GET View method, shim
  this.view = function(id, query, next) {
    var params;

    if(id === null) {
      path = 'view';
    } else {
      path = 'view' + id;
    }

    if(query === null) {
      params = null;
    } else {
      params = serialize(query);
    }

    get(path, params, next);
  };

  this.entries = function(id, query, next) {
    var path = 'campaigns/' + id + '/entries';

    var params;
    if(query === null) {
      params = null;
    } else {
      params = serialize(query);
    }

    get(path, params, next);
  };


  this.entry = function(entryId, campaignId, next) {
    var path = '/campaigns/' + campaignId + '/entries/' + entryId;

    get(path, null, next);

  };

  var getMedia = function(path, params, next) {
    var form = JSON.stringify({
      'accessToken': instagramToken,
      'mediaIds': mediaIds
    });
  };

  // Private Method
  var get = function(path, params, next) {
    var baseUrl;
    if(path === 'view') {
      baseUrl = 'http://skiutahphotos.vscampaign.com/.json';
    } else {
      baseUrl = 'https://platform-api.seencorp.net/';
    }

    var reqUrl = baseUrl + path;
    if(params !== null) reqUrl +=  '?' + params;

    console.log(reqUrl);
    var req = request({ 
      uri: reqUrl, 
      strictSSL: false
    }, function(err, res, body) {

      if(!err && res.statusCode === 200) {
        if(next && typeof next === 'function') {
          next(body);
        }
      } else if(err) {
        util.error('\x1B[1;31m[node-seen] error: \x1B[0m' + err);
        throw err;
      } else if(res.statusCode !== 200) {
        var error = JSON.parse(body).meta.error.message;
        util.error('\x1B[1;31m[node-seen] http status code: \x1B[0m' + res.statusCode);
        util.error('\x1B[1;31m[node-seen] error: \x1B[0m' + error);
      }
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
};


module.exports = SeenApi;
