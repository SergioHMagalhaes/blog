const Sequelize = require('sequelize')
const connetion = require('../data/database')

const Category = connetion.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Category.sync({force: true})

module.exports = Category