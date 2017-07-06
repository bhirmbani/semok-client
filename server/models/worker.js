

module.exports = function (sequelize, DataTypes) {
  const Worker = sequelize.define('Worker', {
    name: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('staff', 'admin', 'manager', 'asmen'),
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  });
  Worker.associate = function (models) {
    Worker.belongsToMany(models.Item, { through: 'WorkerItem', foreignKey: 'workerId' });
    Worker.hasMany(models.Bobot);
    Worker.hasMany(models.Info);
    Worker.hasMany(models.Status);
  };
  return Worker;
};
