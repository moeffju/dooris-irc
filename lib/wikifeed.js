var request = require('request');
var config = require('../config.js');
var feedParser = require('feedparser');

var lastUpdate = null;
var newLastUpdate = null;


exports.update = function(callback) {
	request(config.wiki.url)
		.pipe(new feedParser())
		.on('error', function(error) {
			console.log("Wiki Error: ", error);
		})
		.on('meta', function(meta) {
			newLastUpdate = meta.date;
		})
		.on('readable', function(readable) {
			var stream = this;
			var item;
			while ((item = stream.read())) {
				if (lastUpdate && item.date > lastUpdate) {
					callback(item);
				}
				lastUpdate = newLastUpdate;
			}
		});
};