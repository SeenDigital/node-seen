var Api = require('./api');
var events = require('events');

var Register = function (id, payload) {
  var self = this;
  var url = 'campaigns/' + id + '/registrations';

  Api.post(url, payload, function (resp) {
    self.emit('register', resp);
  });

  return this;
};

Register.prototype = new events.EventEmitter();

module.exports = Register;
