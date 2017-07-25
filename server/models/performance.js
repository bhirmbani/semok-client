

module.exports = function (sequelize, DataTypes) {
  let Performance = sequelize.define('Performance', {
    period: DataTypes.ENUM(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12),
    value: DataTypes.FLOAT,
  });
  Performance.associate = function (models) {
    Performance.belongsToMany(models.Item, { through: 'PerformanceItem', foreignKey: 'performanceId' });
  };
  return Performance;
};
