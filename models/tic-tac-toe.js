module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tic-tac-toe',{
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        score: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    })
}