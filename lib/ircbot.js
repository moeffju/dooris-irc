var irc = require('irc');
var fs = require('fs');
var config = require('../config.js');
var doorstatus = require('./doorstatus.js');
var calendar = require('./calendar.js');

var currentTopic = "";

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
    return;
  }

  /*if (message.slice(0, 6) == "!topic") {
    var newtopic = doorstatus.print(false) + " | " + message.slice(7, message.length);
    if (newtopic != currentTopic) {
      topic = message.slice(7, message.length);
      currentTopic = newtopic;
      config.irc.channels.forEach(function(chan) {
        client.send("TOPIC", chan, currentTopic);
      });
    }
    return;
  }*/

  if (message.slice(0, 6) == "!event") {
    console.log(message.slice(7));
    if (message.slice(7) == "list") {
      if (to.slice(0, 1) == "#") {
        client.say(to, calendar.print(true));
      } else {
        client.say(from, calendar.print(true));
      }
      return;
    }

    if (to.slice(0, 1) == "#") {
      client.say(to, calendar.print(false));
    } else {
      client.say(from, calendar.print(false));
    }
    return;
  }
});

client.addListener('topic', function(channel, changedTopic, from) {
  currentTopic = changedTopic || "";
  if (from != client.nick) {
    exports.updateTopic(channel, changedTopic);
  }
});

client.addListener('error', function(message) {
  client.say("gnomus", "========= IRC ERROR ========");
  client.say("gnomus", message.commandType);
  message.args.forEach(function(arg) {
    client.say("gnomus", arg);
  });
  client.say("gnomus", "============================");
});

// This is diry!
// Application may enter undefined State.
process.on('uncaughtException', function(err) {
  client.say("gnomus", "======== NODE ERROR ========");
  client.say("gnomus", err);
  client.say("gnomus", "============================");
});

exports.updateTopic = function(channel, changedTopic) {

  if (!changedTopic) {
    changedTopic = currentTopic;
  }

  var regex = /HUM: (open|closed|unknown) \| (.*)/;
  var match = changedTopic.match(regex);
  var newTopic = "";
  if (match !== null) {
    newTopic = doorstatus.print(false) + " | " + match[2];
  } else {
    newTopic = doorstatus.print(false) + " | " + changedTopic;
  }

  if (newTopic != currentTopic) {
    client.send("TOPIC", channel, newTopic);
  }
};

exports.wikiEdit = function(item) {
  config.irc.channels.forEach(function(chan) {
    client.say(chan, "Wiki Edit: " + item.title + " | " + item.author + " | " + item.link);
  });
};