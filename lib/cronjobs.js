var cronJob = require('cron').CronJob;
var config = require('../config.js');
var http = require('http');
var doorstatus = require('./doorstatus.js');

module.exports = [

  new cronJob(config.doorstatus.cronString, function() {
    download(config.doorstatus.url, function(data) {
      if (data !== null) {
        doorstatus.update(JSON.parse(data));
      } else {
        console.log("Doorstatus update failed :(");
      }
    });
  }, null, false),

  new cronJob(config.wiki.cronString, function() {
    download(config.wiki.url, function(data) {
      if (data !== null) {
        //console.log("Wiki update successful");
      } else {
        console.log("Wiki update failed :(");
      }
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