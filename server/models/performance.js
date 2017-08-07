

module.exports = function (sequelize, DataTypes) {
  let Performance = sequelize.define('Performance', {
    period: DataTypes.STRING,
    value: DataTypes.FLOAT,
  });
  Performance.associate = function (models) {
    Performance.belongsToMany(models.Item, { through: 'PerformanceItem', foreignKey: 'performanceId' });
  };
  return Performance;
};
