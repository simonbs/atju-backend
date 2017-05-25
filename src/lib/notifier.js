var config = require('config');
var UA = require("urban-airship");

function Notifier() {}

Notifier.prototype.sendPrognosesUnavailableNotification = function(done) {
  this.sendNotificationWithMessage(config.notifications.prognoses_unavailable, done);
}

Notifier.prototype.sendNewReadingsNotification = function(done) {
  this.sendNotificationWithMessage(config.notifications.new_available, done);
}

Notifier.prototype.sendNotificationWithMessage = function(msg, done) {
  this.sendNotificationWithMessageToAudience(msg, "all", done);
}

Notifier.prototype.sendNotificationWithMessageToTag = function(msg, tag, done) {
  this.sendNotificationWithMessageToAudience(msg, { "tag": tag }, done);
}

Notifier.prototype.sendNotificationWithMessageToAudience = function(msg, audience, done) {
  if (!msg || msg.length == 0) {
    return done();
  }
  
  var payload = {
    "audience": audience,
    "notification": {
      "alert": msg,
      "ios": {
        "sound": "default"
      }
    },
    "device_types" : "all"
  };
  this.sendNotification(payload, done);
}

Notifier.prototype.sendNotification = function(payload, done) {
  var apiKey = process.env.URBAN_AIRSHIP_API_KEY;
  var apiSecret = process.env.URBAN_AIRSHIP_API_SECRET;
  var apiMasterKey = process.env.URBAN_AIRSHIP_MASTER_SECRET;  
  if (!apiKey || apiKey.length == 0 || !apiSecret || apiSecret.length == 0 || !apiMasterKey || apiMasterKey.length == 0) {
    // Don't do anything if not configured to send notifications.
    return done();
  }

  var ua = new UA(apiKey, apiSecret, apiMasterKey);
  ua.pushNotification("/api/push/", payload, function(err) {
    if (err) {
      console.log('Unable to send push notification: ' + err);
    }
    if (done != null) {
      done(err);
    }
  });
}

module.exports = Notifier;
