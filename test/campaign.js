var assert = require('assert');

var Campaign = require('../lib/campaign');

var campaign = new Campaign('24401831');

campaign.init();

describe('retrieve Campaign', function () {
  it('should retrieve a campaign and populate with data', function () {
    assert(true, typeof(campaign.data) !== 'undefined');
  });
});

describe('retrieve Entries', function () {
  it('should retrieve entries for a campaign', function () {
    campaign.entries('accepted', null, function(data) {
      assert(true, data.length > 0, data.length);
      assert(true, data[1].id !== 'undefined');
    });
  });
});
