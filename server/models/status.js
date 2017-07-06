

module.exports = function (sequelize, DataTypes) {
  let Status = sequelize.define('Status', {
    content: DataTypes.ENUM('red', 'green', 'star'),
    ItemId: DataTypes.INTEGER,
    WorkerId: DataTypes.INTEGER,
  });
  Status.associate = function (models) {
    Status.belongsTo(models.Item);
    Status.belongsTo(models.Worker);
  };
  return Status;
};
