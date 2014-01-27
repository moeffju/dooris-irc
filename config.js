module.exports = {
  irc: {
    server: "irc.hackint.org",
    port: 9999,
    sslCert: "hackint.pem",
    channels: ["#ccchh"],
    nick: "nodedooris"
  },
  doorstatus: {
    url: "http://hamburg.ccc.de/dooris/dooris.json",
    cronString: "0 */2 * * * *",
    staticLeases: 2
  },
  wiki: {
    url: "http://wiki.hamburg.ccc.de/index.php?title=Special:RecentChanges&feed=atom",
    cronString: "30 */2 * * * *"
  },
  calendar: {
    url: "http://wiki.hamburg.ccc.de/calendar.ics",
    cronString: "15 */2 * * * *"
  }
};
