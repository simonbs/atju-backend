var config = require('config');
var UA = require("urban-airship");

function Notifier() {}

Notifier.prototype.sendNotification = function(done) {
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

  var ua = new UA(
    config.notifications.urban_airship.api_key,
    config.notifications.urban_airship.api_secret,
    config.notifications.urban_airship.api_master_key);
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
