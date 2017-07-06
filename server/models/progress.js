

module.exports = function (sequelize, DataTypes) {
  let Progress = sequelize.define('Progress', {
    period: DataTypes.STRING,
    value: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
  });
  return Progress;
};
