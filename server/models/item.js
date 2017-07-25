

module.exports = function (sequelize, DataTypes) {
  const Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    freq: {
      type: DataTypes.ENUM(1, 3, 12),
    },
  });
  Item.associate = function (models) {
    Item.belongsToMany(models.Worker, { through: 'WorkerItem', foreignKey: 'itemId' });
    Item.belongsToMany(models.Performance, { through: 'PerformanceItem', foreignKey: 'itemId' });
    Item.belongsToMany(models.Progress, { through: 'ProgressItem', foreignKey: 'itemId' });
    Item.belongsToMany(models.Target, { through: 'TargetItem', foreignKey: 'itemId' });
    Item.belongsToMany(models.Status, { through: 'StatusItem', foreignKey: 'itemId' });
    Item.belongsTo(models.Category);
    Item.hasMany(models.Bobot);
    Item.hasMany(models.Info);
    Item.hasMany(models.Unit);
  };
  return Item;
};
