module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }

    });
    User.associate = function(models) {
        // Associating User with username/pass
        // When a User is deleted, also delete any associated info
        User.hasMany(models.Interests, {
          onDelete: "cascade"
        });
        User.hasMany(models.History, {
            onDelete: "cascade"
          });
      };
    return User;
};