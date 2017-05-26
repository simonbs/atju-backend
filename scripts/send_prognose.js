require('dotenv').config()
var models = require('../src/models');
var PrognoseReporter = require('../src/lib/prognosereporter');

models.sequelize.sync().then(function() {
  var prognoseReporter = new PrognoseReporter();
  prognoseReporter.report(function(err) {
    if (err) { return console.log('Failed sending reports: ' + err); }
    console.log('Did send reports');
  });
});
