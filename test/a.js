var Gallery = require('../lib/gallery');


var gallery = new Gallery('hostname', 'demo.vscampaign.com');

gallery.on('gallery', function (gallery) {
  console.log(gallery);
});
