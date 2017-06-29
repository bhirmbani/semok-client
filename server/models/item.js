

module.exports = function (sequelize, DataTypes) {
  const Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    base: DataTypes.INTEGER,
    stretch: DataTypes.INTEGER,
    description: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
  });
  Item.associate = function (models) {
    Item.belongsToMany(models.Worker, { through: 'WorkerItem', foreignKey: 'itemId' });
    Item.belongsTo(models.Category, { foreignKey: 'categoryId' });
  };
  return Item;
};
