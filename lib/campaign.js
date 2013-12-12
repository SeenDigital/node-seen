var Api = require('./api');
var events = require('events');

var Campaign = function (id,next) {
  var self = this;
  var url = 'campaigns/' + id;

  Api.get(url, null, function (campaign) {
    next(campaign);
    // self.emit('campaign', campaign);
  });

  return this;
};

// Inherit the Event Emitter
// Campaign.prototype = new events.EventEmitter();

module.exports = Campaign;
