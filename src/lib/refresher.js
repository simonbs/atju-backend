var PollenStore = require('./pollenstore');
var Notifier = require('./notifier');

function Refresher() {}

Refresher.prototype.refresh = function(done) {
  var pollenStore = new PollenStore();
  pollenStore.refresh(function(err, didAddNewValues) {
    if (err) { return done(err); }
    if (didAddNewValues) {
      var notifier = new Notifier();      
      notifier.sendNewReadingsNotification(done);
    } else {
      done(err);
    }
  });
}

module.exports = Refresher;
