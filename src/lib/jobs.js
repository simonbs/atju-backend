var Refresher = require('./refresher');
var PrognoseReporter = require('./prognosereporter');
var CronJob = require('cron').CronJob;

function Jobs() {}

Jobs.prototype.start = function() {
  new CronJob('* */15 * * * *', function() {    
    var refresher = new Refresher();
    refresher.refresh(function(err) {});
  }, null, true);

  new CronJob('00 00 07 * * *', function() {    
    var prognoseReporter = new PrognoseReporter();
    prognoseReporter.report(function(err) {});
  }, null, true, 'Europe/Copenhagen');
}

module.exports = Jobs;
