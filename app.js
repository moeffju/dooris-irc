var config = require('./config.js');
var cronjobs = require('./lib/cronjobs.js');
//var ircbot = require('./lib/ircbot.js');


//Start all cronjobs
cronjobs.forEach(function(cron) {
  cron.start();
});