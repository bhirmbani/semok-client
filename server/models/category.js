

module.exports = function (sequelize, DataTypes) {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING,
  });
  Category.associate = function (models) {
    Category.belongsTo(models.Item);
  };
  return Category;
};
