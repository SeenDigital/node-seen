var Api = require('./api');


var Entry = function (campaignId, id, params, next) {
  var self = this;
  var url = 'campaigns/' + id;

  Api.get(url, null, function (campaign) {
    campaignHandler(self, type, campaign, params, next);
  });

  return this;
};

var campaignHandler = function (self, campaign, params, next) {
  var baseUrl = 'campaigns/' + campaign.id + '/entries/entry';
    params.descending = true;
  Api.get(url, params, function (entries) {
    entryHandler(self, campaign, entry, next);
  });
};

var EntryHandler = function(self, campaign, entry, next) {
  var campaignId = campaign.id;
  var instagramToken = campaign.instagramToken;

  var payload;
  if( entry.platform === 'instagram' ) {
    var cache = [];
    cache.push(entry);

    payload = createPayload('instagram', instagramToken, cache);
    fetchMedia(payload, entry, function (entry) {
      next(entry);
    });
  } else if (entry.platform === 'twitter' ) {
    var cache = [];
    cache.push(entry);

    payload = createPayload('twitter', campaignId, cache);
    fetchTwitter(payload, entry, function (entry) {
      next(entry);
    });
  }

  return this;
};

var fetchMedia = function (payload, entry, next) {
  console.log(payload);

  Api.post('instagram/media', payload, function (media) {
    var succeeded = media.succeeded;
    var failed = media.failed;

    if( succeeded.hasOwnProperty(entry.identifier) && !(failed.hasOwnProperty(entry.identifier)) ) {
         entry.media = media.succeeded[entry.identifier];
    } else if( failed.hasOwnProperty(entry.identifier) ) {
      entries.splice(entries.data.indexOf(entry), 1);
    }

    next(entry);
  });
};


var fetchTweet = function (payload, entry, next) {

  Api.post('activities/bulk', payload, function(tweet) {

    if( tweet.hasOwnProperty(entry.activityId) ) {
      entry.media = tweet[entry.activityId];
    }

    next(entry);
  });
};

// Create Payload
var createPayload = function (platform, token, ids) {
  var payload;

  if ( platform === 'twitter' ) {
      payload = { campaignId: token, tweetIds: ids };
    } else if ( platform === 'instagram' ){
      payload = { accessToken: token, mediaIds: ids };
    } else {
      var err = new Error('Unkown platform, please specify "instagram" or "twitter"');
      console.error('Error ' + err);
      throw err;
    }

    return JSON.stringify(payload);
};


module.exports = Entry;

