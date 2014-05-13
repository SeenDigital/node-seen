var events = require('events');
var Api = require('./api');
var moment = require('moment');

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
    case 'feed':
      reqUrl = url + '/feed';
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

      fetchMediaFormatted(instagram, entries, function (media) {
        fetchTweetsFormatted(twitter, entries, function (tweets) {
          var data = {
            pagination: getPagination(entries),
            entries: media.concat(tweets)
          }

          self.emit('entries', data);
        });
      });

  }

  return this;
};


var getPagination = function (entries) {
  var pagination = entries.pagination;

  var totalResults = parseInt(entries.totalCount);
  var resultSize = parseInt(entries.resultSize);
  var maxPages = Math.ceil(totalResults/resultSize);

  return {
    maxPages: maxPages,
    totalResults: totalResults,
    resultSize: resultSize
  }
};

var parseEntry = function (entry, media) {
  var tmp = {};

  tmp.id = entry.id;
  tmp.link = entry.link;
  tmp.location = entry.location;
  tmp.platform = entry.platform;
  tmp.thumbnailUrl = entry.thumbnailUrl;
  tmp.type = entry.type;
  tmp.location = entry.location;
  tmp.timestamp = entry.timestamp;
  tmp.fuzzyDate = moment(entry.timestamp).fromNow();
  tmp.username = entry.username;

  if ( entry.platform === 'instagram' ) {
      tmp.commentCount = parseInt(media.comments.count, 10);
      tmp.likeCount = parseInt(media.likes.count, 10);

    if ( entry.type === 'photo' ) {
      tmp.mediaUrl = media.images.standard_resolution.url;
    } else if ( entry.type === 'video' ) {
      tmp.mediaUrl = media.videos.standard_resolution.url;
    }

    if ( media.caption ) tmp.caption = media.caption.text;

    tmp.avatar = media.user.profile_picture;
    tmp.fullname = media.user.full_name;

  } else if ( entry.platform === 'twitter' ) {
    tmp.fullname = media.actor.displayName;
    tmp.avatar = media.actor.image;
    tmp.caption = media.body;
    tmp.commentCount = 0;
    tmp.likeCount = 0;

    if ( media.twitter_entities.media ) {
      tmp.mediaUrl = media.twitter_entities.media[0].media_url;
    }
  }

  return tmp;
};

var fetchMediaFormatted = function (payload, entries, next) {
  Api.post('instagram/media', payload, function (media) {
    var data = [];

    var succeeded = media.succeeded;
    var failed = media.failed;

    if (succeeded !== null) {
      for( var i = 0; i < entries.data.length; i++ ) {
        var entry = entries.data[i];

        if( succeeded.hasOwnProperty(entry.identifier) && !(failed.hasOwnProperty(entry.identifier)) ) {
          var parsedEntry = parseEntry(entry, succeeded[entry.identifier]);
          data.push(parsedEntry);
        }
      }
    }

    next(data);
  });
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

var fetchTweetsFormatted = function (payload, entries, next) {
  Api.post('activities/bulk', payload, function(tweets) {
    var media = [];

    for(var i=0; i < entries.data.length; i++) {
      var entry = entries.data[i];
      if(tweets.hasOwnProperty(entry.activityId)) {
        var parsedEntry = parseEntry(entry, tweets[entry.activityId]);
        media.push(parsedEntry);
      }
    }

    next(media);
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
