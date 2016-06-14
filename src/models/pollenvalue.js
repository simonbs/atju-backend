'use strict';
module.exports = function(sequelize, DataTypes) {
  var PollenValue = sequelize.define('PollenValue', {
    value: DataTypes.INTEGER,
    published_at: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        PollenValue.belongsTo(models.PollenType);
        PollenValue.belongsTo(models.City);
      }
    }
  });
  return PollenValue;
};
