var assert = require('assert');
var Campaign = require('../lib/campaign');


describe('Retrieve Campaign', function () {
  it('should retrieve a json object', function () {
    var campaign = new Campaign('16447811');

    campaign.on('campaign', function (campaign) {
      assert(true, typeof(campaign) === 'Object');
    });
  });
});

describe('Campaign Data is Valid', function () {
  it('should Retrieve a campaign with valid data', function () {
    var campaign = new Campaign('16447811');

    campaign.on('campaign', function (campaign) {
      assert(true, campaign.id === '16447811');
    });
  });
});

