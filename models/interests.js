module.exports = function (sequelize, DataTypes) {
    var Interests = sequelize.define("Interests", {
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },

        views: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        }
    });
    return Interests;
};