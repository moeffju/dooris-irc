var irc = require('irc');
var fs = require('fs');
var config = require('../config.js');
var doorstatus = require('./doorstatus.js');

var topic = "Ohai, long time no see :D";
var currentTopic = "Ohai, long time no see :D";

var client = new irc.Client(config.irc.server, config.irc.nick, {
  port: config.irc.port,
  channels: config.irc.channels,
  secure: {
    ca: [fs.readFileSync(config.irc.sslCert)],
  }
});

client.addListener('message', function(from, to, message) {
  if (message.slice(0, 4) == "!hum") {
    if (to.slice(0, 1) == "#") {
      client.say(to, doorstatus.print(true));
    } else {
      client.say(from, doorstatus.print(true));
    }
  }

  if (message.slice(0, 6) == "!topic") {
    var newtopic = doorstatus.print(false) + " | " + message.slice(7, message.length);
    if (newtopic != currentTopic) {
      topic = message.slice(7, message.length);
      currentTopic = newtopic;
      config.irc.channels.forEach(function(chan) {
        client.send("TOPIC", chan, currentTopic);
      });
    }

  }
});

client.addListener('topic', function(channel, changedTopic, from) {
  if (from != client.nick) {
    client.send("TOPIC", channel, currentTopic);
    if (from.indexOf("@") == -1 && from != client.nick) {
      client.say(from, "You can change the Topic with !topic <newstatus>");
    }
  }
});

client.addListener('error', function(message) {
  console.log('IRC Error: ', message);
});

exports.updateTopic = function() {
  var newtopic = doorstatus.print(false) + " | " + topic;
  if (newtopic != currentTopic) {
    currentTopic = newtopic;
    config.irc.channels.forEach(function(chan) {
      client.send("TOPIC", chan, currentTopic);
    });
  }
};

exports.wikiEdit = function(item) {
  config.irc.channels.forEach(function(chan) {
    client.say(chan, "Wiki Edit: " + item.title + " | " + item.author + " | " + item.link);
  });
}