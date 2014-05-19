var config = require('./config.js');
var cronjobs = require('./lib/cronjobs.js');
var ircbot = require('./lib/ircbot.js');
var express = require('express');
var doorstatus = require('./lib/doorstatus.js');


//Start all cronjobs
cronjobs.forEach(function(cron) {
  cron.start();
});

var webapp = express();

webapp.get('/dooropen', function(req, res) {
  ircbot.dooropen();
  res.send("");
});

webapp.get('/unlock', function(req, res) {
  doorstatus.update(0);
  config.irc.channels.forEach(function(chan) {
    ircbot.updateTopic(chan, null);
  });
  res.send("");
});

webapp.get('/lock', function(req, res) {
  doorstatus.update(1);
  config.irc.channels.forEach(function(chan) {
    ircbot.updateTopic(chan, null);
  });
  res.send("");
});





webapp.listen(3000);
