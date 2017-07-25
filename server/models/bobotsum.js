

module.exports = function (sequelize, DataTypes) {
  let BobotSum = sequelize.define('BobotSum', {
    value: DataTypes.INTEGER,
    workerId: DataTypes.INTEGER,
    topCategoryId: DataTypes.INTEGER,
  });
  BobotSum.associate = function (models) {
    BobotSum.belongsTo(models.TopCategory, { foreignKey: 'topCategoryId' });
    BobotSum.belongsTo(models.Worker, { foreignKey: 'workerId' });
  };
  return BobotSum;
};
