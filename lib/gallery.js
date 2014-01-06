var Api = require('./api');
var events = require('events');

var Gallery = function (id) {
  var self = this;
  var url = 'galleries/' + id;

  Api.get(url, null, function (gallery) {
    self.emit('gallery', gallery);
  });

  return this;
};

// Inherit the Event Emitter
Gallery.prototype = new events.EventEmitter();

module.exports = Gallery;
