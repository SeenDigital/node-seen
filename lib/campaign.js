var Api = require('./api');
var events = require('events');

var Campaign = function (id) {
  var self = this;
  var url = 'campaigns/' + id;

  Api.get(url, null, function (campaign) {
    self.emit('campaign', campaign);
  });

  return this;
};

// Inherit the Event Emitter
Campaign.prototpye = new events.EventEmitter();
