const express = require('express')
const Category = require('../categories/Category')
const Articles = require('./Article')
const slugify = require('slugify')
const router = express.Router()
const adminAuth = require('../middlewares/adminAuth')


router.get('/admin/articles', adminAuth, (req, res) => {
    Articles.findAll({
        include: [{model: Category}]
    }).then((articles) => {
        res.render('admin/articles/index',{articles: articles})
    })

})

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then((categories) =>{
        res.render('admin/articles/new',{categories: categories})
    })
    
})

router.post('/articles/save', adminAuth, (req, res) => {
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
    }).catch(error => {
        res.redirect('/')
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


router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id

    Articles.findByPk(id).then(articles => {
        if(articles != undefined){
            Category.findAll().then(categories => {
                res.render('admin/articles/edit',{articles: articles, categories: categories})
            })

        }
        else{
            res.redirect('/')
        }
    }).catch(erro => {
        res.redirect('/')
    })
})


router.post('/articles/update', (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Articles.update({title: title, body: body, categoryId: category, slug: slugify(title)},{
        where: {
        id: id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    })
    
})


router.get('/articles/page/:num', (req, res) => {
    let page = req.params.num
    let offset =0

    if(isNaN(page) || page == 1){
        offset = 0
    }
    else{
        offset = parseInt(page -1) * 4
    }

    Articles.findAndCountAll({
        limit: 9,
        offset: offset,
        include: [{model: Category}],
        order: [
            ['id','DESC']
        ]
    }).then(articles => {
        let next

        if(offset * 9 >= articles.count){
            next = false
        }
        else{
            next = true
        }

        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page',{result: result, categories: categories})
        })
        

    })
})

module.exports = router