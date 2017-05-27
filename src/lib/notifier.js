var config = require('config');
var UA = require("urban-airship");

function Notifier() {}

Notifier.prototype.sendPrognose = function(prognose, tag, done) {
  this.send(prognose, { "tag": tag }, true, done)
}

Notifier.prototype.sendPrognosesUnavailable = function(done) {
  this.send(config.notifications.prognoses_unavailable, "all", false, done)
}

Notifier.prototype.sendNewReadings = function(done) {
  this.send(config.notifications.new_available, "all", true, done)
}

Notifier.prototype.send = function(msg, audience, isContentAvailable, done) {
  if (!msg || msg.length == 0) {
    return done();
  }
  
  var payload = {
    "audience": audience,
    "notification": {
      "alert": msg,
      "ios": {
        "sound": "default",
        "content-available": isContentAvailable ? 1 : 0
      }
    },
    "device_types" : "all"
  };
  this.sendNotification(payload, done);
}

Notifier.prototype.sendNotification = function(payload, done) {
  var apiKey = process.env.URBAN_AIRSHIP_APP_KEY;
  var apiSecret = process.env.URBAN_AIRSHIP_APP_SECRET;
  var apiMasterKey = process.env.URBAN_AIRSHIP_MASTER_SECRET;  
  if (!apiKey || apiKey.length == 0 || !apiSecret || apiSecret.length == 0 || !apiMasterKey || apiMasterKey.length == 0) {
    // Don't do anything if not configured to send notifications.
    console.log("Notifications are not configured")
    return done();
  }

  var ua = new UA(apiKey, apiSecret, apiMasterKey);
  ua.pushNotification("/api/push/", payload, function(err) {
    if (err) {
      console.log("Unable to send push notification: " + err);
    }
    if (done != null) {
      console.log("Sent notification:")
      console.log(payload)
      done(err);
    }
  });
}

module.exports = Notifier;
