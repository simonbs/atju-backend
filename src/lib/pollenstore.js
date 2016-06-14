var async = require('async');
var DMI = require('./dmi');
var models = require('./../models');
var moment = require('moment');

function PollenStore() {}

PollenStore.prototype.load = function(done) {
  done(new Error('Not implemented yet.'), null);
}

PollenStore.prototype.refresh = function(done) {
  var dmi = new DMI();
  dmi.getPollen(function(err, pollenEntries) {
    if (err) { return done(err); }
    storePollenData(pollenEntries, done);
  });
}

function storePollenData(pollenEntries, done) {
  async.forEach(pollenEntries, function(pollenEntry, callback) {
    models.City
          .findOrCreate({ where: { name: pollenEntry.city } })
          .spread(function(city, cityCreated) {
            storeTypes(pollenEntry, city, callback);
          }).catch(function(err) {
            callback(err);
          });
  }, done);  
}

function storeTypes(pollenEntry, city, done) {
  async.forEach(pollenEntry.types, function(rawPollenType, callback) {
    models.PollenType
          .findOrCreate({ where: { name: rawPollenType.name } })
          .spread(function(pollenType, pollenTypeCreated) {
            storeValue(pollenEntry, rawPollenType, city, pollenType, callback);
          }).catch(function(err) {
            callback(err);
          });
  }, done);
}

function storeValue(pollenEntry, rawPollenType, city, pollenType, done) {
  var date = moment(pollenEntry.date).toDate();
  models.PollenValue
        .findOrCreate({
          where: {
            published_at: date,
            city_id: city.id,
            pollen_type_id: pollenType.id
          }
        }).spread(function(pollenValue, pollenValueCreated) {
          pollenValue.update({ value: rawPollenType.value })
                     .then(function() { done() })
                     .catch(done);
        }).catch(done);
}

module.exports = PollenStore;
