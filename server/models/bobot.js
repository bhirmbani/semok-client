

module.exports = function (sequelize, DataTypes) {
  let Bobot = sequelize.define('Bobot', {
    point: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ItemId: DataTypes.INTEGER,
    WorkerId: DataTypes.INTEGER,
  });
  Bobot.associate = function (models) {
    Bobot.belongsTo(models.Item);
    Bobot.belongsTo(models.Worker);
  };
  return Bobot;
};
