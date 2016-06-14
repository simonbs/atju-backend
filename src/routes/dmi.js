var express = require('express');
var app = express();
var PollenStore = require('../lib/pollenstore');

app.get('/pollen', function(req, res) {
  var pollenStore = new PollenStore();
  pollenStore.load(function(err, data) {
    console.log(err);
    if (err) { return res.status(500).send({ error: err.message }); }
    res.send(data);
  });
});

module.exports = app;
