var Refresher = require('./refresher');
var CronJob = require('cron').CronJob;

function Jobs() {}

Jobs.prototype.start = function() {
  new CronJob('* */15 * * * *', function() {    
    var refresher = new Refresher();
    refresher.refresh(function(err) {});
  }, null, true);
}

module.exports = Jobs;
