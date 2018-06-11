module.exports = function (sequelize, DataTypes) {
    var History = sequelize.define("History", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },

        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });

    History.associate = function(models) {
        // We're saying that History should belong to a user
        // A History can't be created without a user due to the foreign key constraint
        History.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      };
    return History;
};