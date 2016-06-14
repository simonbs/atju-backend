var express = require('express');
var app = express();
var DMI = require('../lib/dmi');
var PollenStore = require('../lib/pollenstore');

app.get('/pollen', function(req, res) {
  var dmi = new DMI();  
  dmi.getPollen(function(err, pollenData) {
    if (err) { return res.status(500).send(err); }
    res.send(pollenData);
  });
});

module.exports = app;
