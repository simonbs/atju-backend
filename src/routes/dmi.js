var express = require('express');
var app = express();
var PollenStore = require('../lib/pollenstore');

app.get('/pollen', function(req, res) {
  var pollenStore = new PollenStore();
  pollenStore.load(function(err, data) {
    if (err) { return res.status(500).send({ error: err.message }); }
    res.send(data);
  });
});

app.get('/pollen/history', function(req, res) {
  var pollenStore = new PollenStore();
  pollenStore.loadHistory(req.query.date, req.query.pollen_type, req.query.city, function(err, data) {
    if (err) { return res.status(500).send({ error: err.message }); }
    res.send(data);
  });
});

module.exports = app;
