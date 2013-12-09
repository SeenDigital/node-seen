var assert = require('assert');

var Api = require('../lib/api');

var api = new Api();

var payload = JSON.stringify({
  accessToken: 'aaaa',
  mediaIds: ["24636230"]
});

describe('post', function () {
  it('should return an array greater than 0 items', function () {
    api.post('instagram/media', payload, function(data) {
      assert(true, data.length > 0, data.length);
      assert(true, typeof(data) === 'object');
    });
  });
});



