var config = require('config');
var UA = require("urban-airship");

function Notifier() {}

Notifier.prototype.sendNotification = function(done) {
  var apiKey = config.notifications.urban_airship.api_key;
  var apiSecret = config.notifications.urban_airship.api_secret;
  var apiMasterKey = config.notifications.urban_airship.api_master_key;  
  if (!apiKey || apiKey.length == 0 || !apiSecret || apiSecret.length == 0 || !apiMasterKey || apiMasterKey.length == 0) {
    // Don't do anything if not configured to send notifications.
    return done();
  }
  
  var payload = {
    "audience": "all",
    "notification": {
      "alert": config.notifications.new_available,
      "ios": {
        "sound": "default"
      }
    },
    "device_types" : "all"
  };

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
