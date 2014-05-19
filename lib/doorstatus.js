var moment = require('moment');
var config = require('../config.js');


var doorstatus;

exports.update = function(status) {
  if(!doorstatus)
    doorstatus = {};
  doorstatus.status = status;
  doorstatus.since = new moment();
  //doorstatus.router.dhcp = doorstatus.router.dhcp - config.doorstatus.staticLeases;
};

exports.print = function(verbose) {
  if (!doorstatus) {
    return "Z9: unknown";
  } else {
    if (verbose) {
      if (parseInt(doorstatus.status) === 0) {
        return "Z9: open since " + doorstatus.since.format("YYYY-MM-DD HH:mm");// + " (" +  doorstatus.router.dhcp + " DHCP Leases)";
      } else {
        if (true) {
          return "Z9: closed since " + doorstatus.since.format("YYYY-MM-DD HH:mm");// + " (" + doorstatus.router.dhcp + " DHCP Leases)";
        } else {
          return "Z9: closed since " + doorstatus.since.format("YYYY-MM-DD HH:mm");
        }
      }
    } else {
      if (parseInt(doorstatus.status) === 0) {
        return "Z9: open";
      } else {
        return "Z9: closed";
      }
    }
  }
};
