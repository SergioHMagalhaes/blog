const express = require('express')
const { redirect } = require('express/lib/response')
const { default: slugify } = require('slugify')
const Category = require('../categories/Category')
const Articles = require('./Article')
const router = express.Router()


router.get('/admin/articles', (req, res) => {
    Articles.findAll({
        include: [{model: Category}]
    }).then((articles) => {
        res.render('admin/articles/index',{articles: articles})
    })

})

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then((categories) =>{
        res.render('admin/articles/new',{categories: categories})
    })
    
})

router.post('/articles/save', (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Articles.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles')
    })
})

router.post('/articles/delete', (req, res) => {
    let id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){
            Articles.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles')
            })
        }
        else{
            res.redirect('/admin/articles') 
        }
    }
    else{
        res.redirect('/admin/articles') 
    }
})

module.exports = router