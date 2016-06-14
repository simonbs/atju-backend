var express = require('express');
var app = express();
var models = require('./models');
var dmi = require('./routes/dmi');
var Jobs = require('./lib/jobs');

app.use('/dmi', dmi);

models.sequelize.sync().then(function() {
  var port = process.env.PORT || 8080;
  app.listen(port);
  console.log('Listening on port ' + port + '...');

  if (process.env.NODE_ENV && process.env.NODE_ENV != 'development') {
    var jobs = new Jobs();
    jobs.start();
  } else {
    console.log('Not starting jobs in development environment.');
  }
});

