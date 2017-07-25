

module.exports = function (sequelize, DataTypes) {
  let ProgressItem = sequelize.define('ProgressItem', {
    progressId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
  });
  ProgressItem.associate = function (models) {
    ProgressItem.belongsTo(models.Progress, { foreignKey: 'progressId' });
    ProgressItem.belongsTo(models.Item, { foreignKey: 'itemId' });
  };
  return ProgressItem;
};
