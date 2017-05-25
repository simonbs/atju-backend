var express = require('express');
var app = express();
var models = require('./models');
var dmi = require('./routes/dmi');
var Jobs = require('./lib/jobs');

app.get('/', (function(req, res) {
    res.send('atju-backend is running.');
}));

app.use('/dmi', dmi);

// Page not found.
app.use(function(req, res, next) {
  res.status(404).json({
    error: 'Resource not found.'
  });
});

models.sequelize.sync().then(function() {
  var port = process.env.PORT || 8080;
  app.listen(port);
  console.log('Listening on port ' + port + '...');
  var jobs = new Jobs();
  jobs.start();
});

