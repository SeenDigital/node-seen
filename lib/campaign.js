var async = require('async');
var Api = require('./api');

// init the Api Wrapper
var api = new Api();

var Campaign = function (id) {
  this.campaignId = id;

  this.init();

  return this;
};


Campaign.prototype.init = function () {
  var self = this;
  self.path = 'campaigns/' + self.campaignId;

  api.get(self.path, null, function (data) {
    self.data = data;
  });
};


Campaign.prototype.entries = function (status, params, next) {
  var self = this;
  var url = self.path + '/entries/';

  if(status !== null) url = url + 'accepted/';

  if(params !== null) url = url + '?' + params;

  api.get(url, null, function (data) {
    var entries = data.data;
    // Cache the entry ids, segement by entry playform;
    var ids = {
      instagram: [],
      twitter: []
    };

    for(var i=0; i < entries.length; i++) {
      var entry = entries[i];

      if(entry.platform === 'instagram') {
        ids.instagram.push(String(entry.id));
      } else if(entry.platform === 'twitter') {
        ids.twitter.push(String(entry.id));
      }
    }

    var instagram = createPayload(self.data.instagramToken, ids.instagram);

    api.post('instagram/media', instagram, function(medias) {
      filterEntries(entries, tweets);

      for(var i=0; i < entries.length; i++) {
        var entry = entries[i];

        if(medias.succeeded.hasOwnProperty(entry.id) && !(medias.succeeded.hasOwnProperty(entry.id))) {
          entry.media = medias.succeeded[entry.id];
        } else if(medias.failed.hasOwnProperty(entry.id)) {
          entries.splice(entries.indexOf(entry), 1);
        }
      }
    });

    api.post('twitter/tweets', twitter, function(tweets) {
      filterEntries(entries, tweets);

      for(var i=0; i < entries.length; i++) {

        if(tweets.succeeded.hasOwnProperty(entry.id) && !(tweets.succeeded.hasOwnProperty(entry.id))) {
          entry.media = tweets.succeeded[entry.id];
        } else if(medias.failed.hasOwnProperty(entry.id) {
          entries.splice(entries.indexOf(entry), 1)
        });
      }
    });
      next(data);
  });
};


// Private Methods
var fetchMedia = function(platform, payload) {
  var url;

  if(platform === 'twitter') {
    url = 'twitter/tweets';
  } else if(platform === 'instagram') {
    url = 'instagram/media';
  }

  api.post(url, payload, function(meida) {
    fitlerEntries(media);
  });
};

var filterEntries = function(entries, media) {

  for(var i=0; i < entries.length; i++) {
    var entry = entries[i];

    if(media.succeeded.hasOwnProperty(entry.id) && !(media.succeeded.hasOwnProperty(entry.id))) {
      entry.media = tweets.succeeded[entry.id];
    } else if(media.failed.hasOwnProperty(entry.id) {
      entries.splice(entries.indexOf(entry), 1)
    });
  }

  return entries;
};

var createPayload = function (token, ids) {
  return JSON.stringify({
    accessToken: token,
    mediaIds: ids
  });
};

module.exports = Campaign;
