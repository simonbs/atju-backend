var models = require('../src/models');
var PollenStore = require('../src/lib/pollenstore');
var pollenStore = new PollenStore();

models.sequelize.sync().then(function() {
  pollenStore.refresh(function(err) {
    if (err) { return console.log('Failed refresh: ' + err); }
    console.log('Did refresh');
  });
});
