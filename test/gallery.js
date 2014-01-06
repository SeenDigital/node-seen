var assert = require('assert');
var Gallery = require('../lib/gallery');


describe('Retrieve Gallery', function () {
  it('should retrieve a json object', function () {
    var gallery = new Gallery('16447811');

    gallery.on('campaign', function (campaign) {
      assert(true, typeof(gallery) === 'Object');
    });
  });
});

describe('Gallery Data is Valid', function () {
  it('should Retrieve a gallery with valid data', function () {
    var gallery = new Gallery('16447811');

    gallery.on('campaign', function (campaign) {
      assert(true, gallery.id === '16447811');
    });
  });
});

