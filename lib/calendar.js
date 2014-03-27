var ical = require('ical');
var moment = require('moment');
var _ = require('underscore');

var events = [];

exports.update = function(data) {
  var calendar = ical.parseICS(data);
  var now = new Date();
  events = [];
  for (var e in calendar) {
    var ev = calendar[e];
    if ((ev.start && ev.start > now) || (ev.start && ev.end && ev.start < now && ev.end > now)) {
      events.push(ev);
    }
  }
  events.reverse();
};

exports.print = function(verbose) {
  if (events.length === 0) {
    return "No Upcoming events.";
  }
  var now = new Date();
  var string = "";
  if (verbose) {
    string += "Upcoming events:\n";
    events.forEach(function(event) {
      var start = moment(event.start);
      if (event.start && event.start < now) {
        string += "NOW | " + event.description + " | " + event.url + "\n";
      } else {
        string += start.format("YYYY-MM-DD HH:mm") + " | " + event.description + " | " + event.url + "\n";
      }
    });
  } else {
    var event = _.min(events, function(i) {
      return i.start;
    });
    var start = moment(event.start);
    if (event.start && event.start < now) {
      string += "NOW | " + event.description + " | " + event.url;
    } else {
      string += start.format("YYYY-MM-DD HH:mm") + " | " + event.description + " | " + event.url;
    }
  }
  return string;
};