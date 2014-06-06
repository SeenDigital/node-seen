var Api = require('./api');

var Gallery = function (selectorType, selector, next) {
  var self = this;
  var url = 'galleries/';
  var query;

  if ( selectorType === 'hostname' ) {
    query = { 'hostname': selector };
  } else if ( selectorType === 'id' ){
    url = url + selector;
    query = null;
  } else {
    var error = new Error('Invalid selector type. please enter a valid selector type, "hostname" or "id"');

    throw new Error(error);
  }

  console.log(url);
  Api.get(url, query, function (gallery) {
    next(gallery);
  });

  return this;
};


module.exports = Gallery;
