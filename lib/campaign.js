var Api = require('./api');

var Campaign = function (id) {
  var self = this;
  var url = 'campaigns/' + id;

  Api.get(url, null, function (campaign) {
    next(campaign);
  });

  return this;
};

module.exports = Campaign;
