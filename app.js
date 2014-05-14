var config = require('./config.js');
var cronjobs = require('./lib/cronjobs.js');
var ircbot = require('./lib/ircbot.js');
var express = require('express');

//Start all cronjobs
cronjobs.forEach(function(cron) {
  cron.start();
});

var webapp = express();

webapp.get('/dooropen', function(req, res) {
  ircbot.dooropen();
  res.send("");
});

webapp.listen(3000);