const Sequelize = require('sequelize')
const connetion = require('../data/database')

const User = connetion.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//User.sync({force: true})

module.exports = User