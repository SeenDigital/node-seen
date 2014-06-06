var Api = require('./api');

var Register = function (id, payload, next) {
  var self = this;
  var url = 'campaigns/' + id + '/registrations';

  Api.post(url, payload, function (resp) {
    next(resp);
  });

  return this;
};

module.exports = Register;
