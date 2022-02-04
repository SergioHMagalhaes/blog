const Sequelize = require('sequelize')
const connetion = require('../data/database')
const Category = require('../categories/Category')

const Article = connetion.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})

//Article.sync({force: true})

Category.hasMany(Article)
Article.belongsTo(Category)

module.exports = Article