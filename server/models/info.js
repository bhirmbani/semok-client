

module.exports = function (sequelize, DataTypes) {
  let Info = sequelize.define('Info', {
    delegateBy: DataTypes.STRING,
    delegateTo: DataTypes.STRING,
    currentVal: DataTypes.FLOAT,
    ItemId: DataTypes.INTEGER,
    WorkerId: DataTypes.INTEGER,
  });
  Info.associate = function (models) {
    Info.belongsTo(models.Item);
    Info.belongsTo(models.Worker);
  };
  return Info;
};
