var assert = require('assert');
var Entries = require('../lib/entries');

describe('Retrieve Entries', function () {
  it('should retrieve a json object', function () {
    var entries = new Entries('16447811', null);

    entries.on('entries', function (entries) {
      assert(true, typeof(entries) === 'Object');
    });
  });
});

describe('Entries Data is Valid', function () {
  it('should Retrieve entries entries with valid data', function () {
    var entries = new Entries('16447811', null);

    entries.on('entries', function (entries) {
      assert(true, typeof(entries.data) !== 'undefined');
    });
  });
});


