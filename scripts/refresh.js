var models = require('../src/models');
var Refresher = require('../src/lib/refresher');

models.sequelize.sync().then(function() {
  var refresher = new Refresher();
  refresher.refresh(function(err) {
    if (err) { return console.log('Failed refresh: ' + err); }
    console.log('Did refresh');
  });
});
