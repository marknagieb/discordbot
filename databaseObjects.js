const Sequelize = require('sequelize');

const sequelize = new Sequelize('discordbot', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',

});

const TicTacToe = require('./models/tic-tac-toe')(sequelize, Sequelize.DataTypes);

module.exports = {
    TicTacToe
};