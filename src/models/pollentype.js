'use strict';
module.exports = function(sequelize, Sequelize) {
  var PollenType = sequelize.define('PollenType', {
    name: {
      type: Sequelize.STRING,
      unique: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        PollenType.hasMany(models.PollenValue);
      }
    }
  });
  return PollenType;
};
