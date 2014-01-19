var moment = require('moment');
var config = require('../config.js');


var doorstatus;

exports.update = function(status) {
  doorstatus = status;
  doorstatus.router.dhcp = doorstatus.router.dhcp - config.doorstatus.staticLeases;
};

exports.print = function(verbose) {
  if (!doorstatus) {
    return "Sorry, got no Data ;( Try again later";
  } else {
    if (verbose) {
      var since = moment(doorstatus.door.last_change * 1000);
      if (parseInt(doorstatus.door.status) === 0) {
        return "HUM: open since " + since.format("YYYY-MM-DD HH:mm") + " (" + doorstatus.router.dhcp + " DHCP Leases)";
      } else {
        if (parseInt(doorstatus.router.dhcp) > 0) {
          return "HUM: closed since " + since.format("YYYY-MM-DD HH:mm") + " (" + doorstatus.router.dhcp + " DHCP Leases)";
        } else {
          return "HUM: closed since " + since.format("YYYY-MM-DD HH:mm");
        }
      }
    } else {
      if (parseInt(doorstatus.door.status) === 0) {
        return "HUM: open";
      } else {
        return "HUM: closed";
      }
    }
  }
};