

module.exports = function (sequelize, DataTypes) {
  let TopCategory = sequelize.define('TopCategory', {
    name: DataTypes.STRING,
  });
  TopCategory.associate = function (models) {
    TopCategory.belongsToMany(models.Category, { through: 'CategoryTop', foreignKey: 'topCategoryId' });
    TopCategory.belongsToMany(models.Worker, { through: 'BobotSum', foreignKey: 'topCategoryId' });
  };
  return TopCategory;
};
