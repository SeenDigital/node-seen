var assert = require('assert');

var Api = require('../lib/api');

var api = new Api();

var payload = JSON.stringify({
  accessToken: '51731906.1f2b326.74f2cc4773594a108d48e647a37c7a8c',
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



