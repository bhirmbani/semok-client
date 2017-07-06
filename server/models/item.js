

module.exports = function (sequelize, DataTypes) {
  const Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    base: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
    stretch: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
    description: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    currentVal: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('red', 'green', 'star'),
      defaultValue: 'red',
    },
  });
  Item.associate = function (models) {
    Item.belongsToMany(models.Worker, { through: 'WorkerItem', foreignKey: 'itemId' });
    Item.belongsTo(models.Category);
    Item.hasMany(models.Bobot);
    Item.hasMany(models.Status);
    Item.hasMany(models.Info);
    Item.hasMany(models.Unit);
  };
  return Item;
};
