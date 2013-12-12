var Entries = require('./lib/entries');

var entries = new Entries('24401831', 'accepted', null);
entries.on('entries', function (entries) {
  console.log('fired');
});

