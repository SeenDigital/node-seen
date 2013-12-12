var events = require('events');
var Api = require('./api');


var Entries = function (id, type, params) {
  var self = this;
  var url = 'campaigns/' + id;

  Api.get(url, null, function (campaign) {
    campaignHandler(self, type, campaign, params);
  });

  return this;
};


var campaignHandler = function (self, type, campaign, params) {
  var baseUrl = 'campaigns/' + campaign.id + '/entries';
  var url = filterType(type, baseUrl);

  Api.get(url, params, function (entries) {
    entriesHandler(self, campaign, entries);
  });
};


var filterType = function (type, url) {
  var reqUrl;

  switch(type) {
    case 'accepted':
      reqUrl = url + '/accepted';
      break;
    case 'rejected':
      reqUrl = url + '/rejected';
      break;
    case 'claimed':
      reqUrl = url + '/claimed';
      break;
    case 'unactioned':
      reqUrl = url + '/unactioned';
      break;
    case 'favorited':
      reqUrl = url + '/favorited';
      break;
    default:
      reqUrl = url;
  }

  return reqUrl;
};

var entriesHandler = function (self, campaign, entries) {
  var campaignId = campaign.id;
  var instagramToken = campaign.instagramToken;

  // Caching Object
  var cache = {
    instagram: [],
    twitter: []
  };

  if (typeof entries.data !== 'undefined') {
    // Iterate over entries, filter by platform type
    for ( var i = 0; i < entries.data.length; i++ ) {
      var entry = entries.data[i];

      if ( entry.platform === 'instagram' ) {
        cache.instagram.push(String(entry.identifier));
      } else if ( entry.platform === 'twitter' ) {
        cache.twitter.push(String(entry.activityId));
      }
    }

     var instagram = createPayload('instagram', instagramToken, cache.instagram);
     var twitter = createPayload('twitter', campaignId, cache.twitter);

      fetchMedia(instagram, entries, function (entries) {
        fetchTweets(twitter, entries, function (entries) {
          self.emit('entries', entries);
        });
      });

  }

  return this;
};

var fetchMedia = function (payload, entries, next) {
  Api.post('instagram/media', payload, function (media) {
    var succeeded = media.succeeded;
    var failed = media.failed;

    for( var i = 0; i < entries.data.length; i++ ) {
      var entry = entries.data[i];

      if( succeeded.hasOwnProperty(entry.identifier) && !(failed.hasOwnProperty(entry.identifier)) ) {
           entry.media = media.succeeded[entry.identifier];
      } else if( failed.hasOwnProperty(entry.identifier) ) {
        entries.splice(entries.data.indexOf(entry), 1);
      }
    }

    next(entries);
  });
};

var fetchTweets = function (payload, entries, next) {

  Api.post('activities/bulk', payload, function(tweets) {
    for(var i=0; i < entries.data.length; i++) {
      var entry = entries.data[i];

      if(tweets.hasOwnProperty(entry.activityId)) {
        entry.media = tweets[entry.activityId];
      }

    }

    next(entries);
  });
};

// Create Payload
var createPayload = function (platform, token, ids) {
  if ( platform === 'twitter' ) {
      payload = { campaignId: token, ids: ids }
    } else if ( platform === 'instagram' ){
      payload = { accessToken: token, mediaIds: ids }
    } else {
      var err = new Error('Unkown platform, please specify "instagram" or "twitter"');
      console.error('Error ' + err);
      throw err;
    }

    return payload;
};

// Inherit Event Emitter
Entries.prototype = new events.EventEmitter();


module.exports = Entries;
