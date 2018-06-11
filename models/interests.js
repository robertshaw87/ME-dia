module.exports = function (sequelize, DataTypes) {
    var Interests = sequelize.define("Interests", {
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },

        counts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
    
    });

    Interests.associate = function(models) {
        // We're saying that a Interest should belong to a User
        // An Interesr can't be created without a user due to the foreign key constraint
        Interests.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      };
    return Interests;
};