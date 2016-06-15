'use strict';
module.exports = function(sequelize, DataTypes) {
  var Prognose = sequelize.define('Prognose', {
    text: DataTypes.TEXT,
    published_at: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Prognose.belongsTo(models.City);
      }
    }
  });
  return Prognose;
};
