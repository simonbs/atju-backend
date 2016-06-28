var async = require('async');
var DMI = require('./dmi');
var models = require('./../models');
var moment = require('moment');
var _ = require('underscore');

function PollenStore() {}

PollenStore.prototype.loadHistory = function(date, pollenType, city, done) {
  var query = 'select value, "Cities".name, "PollenTypes".name, published_at\
    from "PollenValues"\
    inner join "Cities" on (\
       "PollenValues".city_id = "Cities".id\
     )\
     inner join "PollenTypes" on (\
       "PollenValues".pollen_type_id = "PollenTypes".id\
     )\
    where published_at >= ? and "PollenTypes".name = ? and "Cities".name = ?\
    order by "PollenValues".published_at desc;';
  models.sequelize.query(query, {
    replacements: [ date, pollenType, city ]
  }).spread(function(results, metadata) {
    done(null, results);
  }).catch(function(err) {
    done(err, null)
  });
}

PollenStore.prototype.load = function(done) {
  var query = 'select "Cities".name as city,\
      "PollenTypes".name as pollen_type,\
      value,\
      "PollenValues".published_at,\
       "Prognoses".text as prognose\
    from "PollenValues"\
    inner join "Cities" on (\
      "PollenValues".city_id = "Cities".id\
    )\
    inner join "PollenTypes" on (\
      "PollenValues".pollen_type_id = "PollenTypes".id\
    )\
    left outer join "Prognoses" on (\
      "PollenValues".city_id = "Prognoses".city_id and\
      "PollenValues".published_at = "Prognoses".published_at)\
    where date("PollenValues".published_at) in (\
      select distinct on ("PollenValues".published_at) date("PollenValues".published_at) as published_at\
      from "PollenValues"\
      order by "PollenValues".published_at desc\
      limit 2\
    )\
    order by "PollenValues".published_at desc, city asc;';
  models.sequelize.query(query).spread(function(results, metadata) {
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
        group['prognose'] = result.prognose;
        var cities = group['cities'] || [];
        var cityIdx = _.findIndex(cities, function(city) {
          return city.name == result.city
        });
        var city = cityIdx != -1 ? cities[cityIdx] : {};
        city['name'] = result.city;
        var readings = city['readings'] || [];
        readings.push({
          name: result.pollen_type,
          value: result.value
        });
        city['readings'] = readings;
        if (cityIdx != -1) {
          cities[cityIdx] = city;
        } else {
          cities.push(city);
        }
        group['cities'] = cities;
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
  hasStoredValuesToday(function(err, hadStoredValues) {
    if (err) { return done(err, false); }
    dmi.getPollen(function(err, pollenEntries) {
      if (err) { return done(err, false); }
      storePollenData(pollenEntries, function(err) {
        if (err) { return done(err, false); }
        hasStoredValuesToday(function(err, hasStoredValues) {
          if (err) { return done(err, false); }
          var didStoreValues = hadStoredValues == false && hasStoredValues == true;
          done(null, didStoreValues);
        });
      });
    });
  });
}

function storePollenData(pollenEntries, done) {
  async.forEach(pollenEntries, function(pollenEntry, callback) {
    models.City
          .findOrCreate({ where: { name: pollenEntry.city } })
          .spread(function(city, cityCreated) {
            storePrognoses(pollenEntry, city, function(err) {
              if (err) { return callback(err); }
              storeTypes(pollenEntry, city, callback);
            });
          }).catch(function(err) {
            callback(err);
          });
  }, done);  
}

function storePrognoses(pollenEntry, city, done) {
  models.Prognose
        .findOrCreate({
          where: {
            published_at: pollenEntry.date,
            city_id: city.id
          }
        })
        .spread(function(prognose, prognoseCreated) {
          prognose.update({ text: pollenEntry.prognose })
                    .then(function() { done() })
                    .catch(done);
        }).catch(done);
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

function hasStoredValuesToday(done) {
  var date = moment().format('YYYY-MM-DD');
  var query = 'select count(id) from "PollenValues" where to_char(created_at, \'YYYY-MM-DD\') = ?;';
  models.sequelize.query(query, {
    replacements: [ date ]
  }).spread(function(results, metadata) {
    done(null, results[0]['count'] > 0);
  }).catch(function(err) {
    done(err, null)
  });
}

module.exports = PollenStore;
