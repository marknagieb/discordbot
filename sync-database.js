const Sequelize = require('sequelize');

const sequelize = new Sequelize('discordbot', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',

});

require('./models/tic-tac-toe')(sequelize, Sequelize.DataTypes);

sequelize.sync().then(async() =>{
    console.log('Database Synced!');
    sequelize.close();
    
}).catch(console.error);