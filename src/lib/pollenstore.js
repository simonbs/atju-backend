var async = require('async');
var DMI = require('./dmi');
var models = require('./../models');
var moment = require('moment');

function PollenStore() {}

PollenStore.prototype.load = function(done) {
  models.sequelize.query('select "Cities".name as city, "PollenTypes".name as pollen_type, value, published_at\
    from "PollenValues"\
    inner join "Cities" on ("PollenValues".city_id = "Cities".id)\
    inner join "PollenTypes" on ("PollenValues".pollen_Type_id = "PollenTypes".id)\
    where date(published_at) in (\
      select distinct on (published_at) date(published_at) as published_at\
      from "PollenValues"\
      order by published_at\
      limit 2\
    )\
    order by published_at desc, city asc;').spread(function(results, metadata) {
      var latest = {};
      var previous = {};
      var latest_date = null;
      results.forEach(function(result) {
        // Please note that the grouping of entries are dependent on the
        // order used in the query.
        if (latest_date == null) {
          latest_date = result.published_at;
        }

        var group = result.published_at.toString() == latest_date.toString() ? latest : previous;       
        group['date'] = result.published_at;
        var city_group = group[result.city] || [];
        city_group.push({
          pollen_type: result.pollen_type,
          value: result.value
        });
        group[result.city] = city_group;
      });      
      done(null, {
        "latest": latest,
        "previous": previous
      });
    }).catch(function(err) {
      done(err, null)
    });
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
