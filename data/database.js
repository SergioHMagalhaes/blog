const Sequelize = require("sequelize");

const connetion = new Sequelize('blog','sergio','12345678',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connetion