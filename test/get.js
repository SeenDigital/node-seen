var Api = require('../lib/api');

var api = new Api();

api.get('campaigns/24401831', null, function(data) {
  console.log(data);
});
