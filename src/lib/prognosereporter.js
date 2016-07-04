var models = require('../models');
var config = require('config');
var async = require('async');
var moment = require('moment');
var Notifier = require('./notifier');

function PrognoseReporter() { }

PrognoseReporter.prototype.report = function(done) {
  var notifier = new Notifier();
  getPrognosesFromYesterday(function(err, results) {
    if (!results || results.count == 0) {
      // No prognoses available.
      notifier.sendPrognosesUnavailableNotification(done);
    } else {
      // Prognoses are available.
      async.forEach(results, function(result, callback) {
        notifier.sendNotificationWithMessageToTag(result['text'], result['city'], callback);
      }, done);
    }
  });
}

function getPrognosesFromYesterday(done) {
  var date = moment().subtract(1, 'day').format('YYYY-MM-DD'); // Yesterday
  var query = 'select text, published_at, "Cities".name as city from "Prognoses"\
    inner join "Cities" on ("Prognoses".city_id = "Cities".id)\
    where to_char(published_at, \'YYYY-MM-DD\') = ?;';
  models.sequelize.query(query, {
    replacements: [ date ]
  }).spread(function(results, metadata) {
    done(null, results);
  }).catch(function(err) {
    done(err, null)
  });
}

module.exports = PrognoseReporter;
