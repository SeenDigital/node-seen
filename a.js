var Entries = require('./lib/entries');

var entries = new Entries('16447811', 'accepted', null);
entries.on('entries', function (d) {
  console.log(d);
});
