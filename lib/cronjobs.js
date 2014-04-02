var cronJob = require('cron').CronJob;
var config = require('../config.js');
var http = require('http');
var doorstatus = require('./doorstatus.js');
var ircbot = require('./ircbot.js');
var wikifeed = require('./wikifeed.js');
var calendar = require('./calendar.js');
var twitter = require('./twitter.js');

module.exports = [

  new cronJob(config.doorstatus.cronString, function() {
    download(config.doorstatus.url, function(data) {
      if (data !== null) {
        doorstatus.update(JSON.parse(data));
        config.irc.channels.forEach(function(chan) {
          ircbot.updateTopic(chan, null);
        });
      } else {
        console.log("Doorstatus update failed :(");
      }
    });
  }, null, false),

  new cronJob(config.calendar.cronString, function() {
    download(config.calendar.url, function(data) {
      if (data !== null) {
        calendar.update(data);
      } else {
        console.log("Calendar update failed :(");
      }
    });
  }, null, false),

  new cronJob(config.wiki.cronString, function() {
    wikifeed.update(function(item) {
      ircbot.wikiEdit(item);
    });
  }, null, false),

  new cronJob(config.twitter.cronString, function() {
    twitter.update(function(tweet) {
      ircbot.newTweet(tweet);
    });
  }, null, false)

];


function download(url, callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function(err) {
    callback(null);
  });
}