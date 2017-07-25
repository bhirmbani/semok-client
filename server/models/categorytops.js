

module.exports = function (sequelize, DataTypes) {
  let CategoryTop = sequelize.define('CategoryTop', {
    categoryId: DataTypes.INTEGER,
    topCategoryId: DataTypes.INTEGER,
  });
  CategoryTop.associate = function (models) {
    CategoryTop.belongsTo(models.Category, { foreignKey: 'categoryId' });
    CategoryTop.belongsTo(models.TopCategory, { foreignKey: 'topCategoryId' });
  };
  return CategoryTop;
};
