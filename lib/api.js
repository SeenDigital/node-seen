var request = require('request');

var Api = function () {
  this._baseUrl = 'https://platform-api.seencorp.net/';

  return this;
};

Api.prototype.post = function (path, payload, next) {
  var reqUrl = this._baseUrl + path;

  request.post({
    headers: { 'content-type': 'application/json' },
    url: reqUrl,
    strictSSL: false,
    body: payload
  }, function (err, res, body) {
    if(!err) {
      var data = JSON.parse(body);

      next(data);
    }
  });
};

Api.prototype.get = function (path, params, next) {
  var reqUrl = this._baseUrl + path;

  if(params !== null) reqUrl = reqUrl + '?' + params;

  request({
    url: reqUrl,
    strictSSL: false
  }, function (err, res, body) {

    if(!err && res.statusCode === 200) {
      var data = JSON.parse(body);

      next(data);
    }
  });
};

module.exports = Api;
