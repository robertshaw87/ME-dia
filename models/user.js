module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      Name: DataTypes.STRING,
      Password: DataTypes.STRING
    });
    return User;
  };