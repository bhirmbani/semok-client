

module.exports = function (sequelize, DataTypes) {
  let StatusItem = sequelize.define('StatusItem', {
    statusId: DataTypes.INTEGER,
    itemId: DataTypes.INTEGER,
  });
  StatusItem.associate = function (models) {
    StatusItem.belongsTo(models.Status, { foreignKey: 'statusId' });
    StatusItem.belongsTo(models.Item, { foreignKey: 'itemId' });
  };
  return StatusItem;
};
