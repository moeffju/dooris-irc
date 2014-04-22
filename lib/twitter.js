var config = require('../config.js');
var twitter = require('twitter');
var moment = require('moment');
var ircbot = require('./ircbot.js');

var appStart = new moment(config.applicationStart);
var query = 'https://api.twitter.com/1.1/search/tweets.json?q=' + config.twitter.search_string + '&result_type=recent';

var t = new twitter({
	consumer_key: config.twitter.consumer_key,
	consumer_secret: config.twitter.consumer_secret,
	access_token_key: config.twitter.access_token_key,
	access_token_secret: config.twitter.access_token_secret
});


t.stream('filter', {
	follow: '868011812',
	track: '#ccchh,CCCHamburg'
}, function(stream) {
	stream.on('data', function(data) {
		ircbot.newTweet(data);
	});
});

exports.update = function(cb) {
	t.get(query, function(data) {
		if (data && data.search_metadata) {
			query = 'https://api.twitter.com/1.1/search/tweets.json' + data.search_metadata.refresh_url;
			data.statuses.forEach(function(item) {
				var created = new moment(item.created_at);
				if (created > appStart) {
					cb(item);
				}
			});
		}
	});
};