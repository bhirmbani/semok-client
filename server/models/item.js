

module.exports = function (sequelize, DataTypes) {
  const Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    base: DataTypes.INTEGER,
    stretch: DataTypes.INTEGER,
    description: DataTypes.STRING,
  });
  Item.associate = function (models) {
    Item.belongsToMany(models.Worker, { through: 'WorkerItem', foreignKey: 'itemId' });
    Item.hasMany(models.Category);
  };
  return Item;
};
