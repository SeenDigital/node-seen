var assert = require('assert');
var Gallery = require('../lib/gallery');


describe('Retrieve Gallery from hostname', function () {
  it('should retrieve a json object with the correct id', function () {
    var gallery = new Gallery('hostname', 'demo.vscampaign.com');

    gallery.on('campaign', function (campaign) {
      assert(true, typeof(gallery) === 'Object');
      assert(true, gallery.id === '24962110');
    });
  });
});


describe('Retrieve Gallery from id', function () {
  it('should retrieve a json object with the correct id', function () {
    var gallery = new Gallery('id', '24962110');

    gallery.on('campaign', function (campaign) {
      assert(true, typeof(gallery) === 'Object');
      assert(true, gallery.id === '24962110');
    });
  });
});

