var request = require('request');
var FeedParser = require('feedparser');
var _ = require('underscore');
var moment = require('moment');
moment.locale('da');

function DMI() { }

DMI.prototype = {
  get cities() {
    return [ 'København', 'Viborg' ]
  }
}

DMI.prototype.getPollen = function(done) {
  var dmi = this;
  var req = request('http://www.dmi.dk/vejr/services/pollen-rss/');
  var feedparser = new FeedParser();
  req.on('error', function(err) {
    done(err, null);
  });
  req.on('response', function(res) {
    var stream = this;
    if (res.statusCode != 200) {
      return done(new Error('Unable to obtain pollen data.'), null);
    }
    stream.pipe(feedparser);
  });

  var regions = [];
  feedparser.on('error', function(err) {
    done(err, null);
  });
  feedparser.on('readable', function() {
    var stream = this;
    var meta = this.meta;
    var item = null;
    while (item = stream.read()) {
      // We use the title to determine the correct action to be
      // taken for the item. If the tite is null, we cannot
      // determine the action.
      if (item.title == null) { continue; }
      if (dmi.cities.indexOf(item.title) != -1) {
        var date = moment(item['rss:pubdate']['#'], 'ddd [den] DD. MMM YYYY HH:mm:ss Z');
        regions = updateRegions(regions, item.title, {
          city: item.title,
          types: extractPollenTypes(item.description),
          date: date.toJSON()
        });
      } else if (item.title.indexOf('Prognose') != -1) {
        for (var i = 0; i < dmi.cities.length; i++) {
          var city = dmi.cities[i];
          if (item.title.indexOf(city) != -1) {
            regions = updateRegions(regions, city, {
              city: city,
              prognose: item.description
            });
            break;
          }
        }
      }
    }
  });
  feedparser.on('end', function(err) {
    if (err) { return done(err, null); }
    done(null, regions);
  });
}

function extractPollenTypes(rawTypes) {
  return rawTypes
     .split('\r\n')
     .map(function(val) {
       return val.trim();
     }).filter(function(val) {
       return val != null && val.length > 0;
     }).map(function(val) {
       var comps = val.split(': ');
       var name = comps[0];
       var value = comps[1].substring(0, comps[1].length - 1);
       value = value == "-" ? 0 : parseInt(value);
       return {
         name: comps[0],
         value: value
       }
     });
}

function updateRegions(regions, city, update) {
  var idx = _.findIndex(regions, function(region) {
    return region.city == city;
  });

  var region = idx != -1 ? regions[idx] : {};
  _.extend(region, update);
  if (idx != -1) {
    regions[idx] = region;
  } else {
    regions.push(region);
  }

  return regions;
}

module.exports = DMI;
