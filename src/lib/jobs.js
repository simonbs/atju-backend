var PollenStore = require('./pollenstore');
var CronJob = require('cron').CronJob;

function Jobs() {}

Jobs.prototype.start = function() {
  new CronJob('* */15 * * * *', function() {    
    var pollenStore = new PollenStore();
    pollenStore.refresh();
  }, null, true);
}

module.exports = Jobs;
