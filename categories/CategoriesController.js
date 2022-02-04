const express = require('express')
const Category = require('./Category')
const slugify = require('slugify')
const router = express.Router()


router.get('/admin/categories', (req, res) => {
    Category.findAll().then((categories) => {
        res.render('admin/categories/index', {
            categories: categories
        })
    })
    
})

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new')
})

router.post('/categories/save', (req, res) => {
    let title = req.body.title
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/')
        })
    }
    else{
        res.redirect('admin/categories/new')
    }

})

router.post('/categories/uptade', (req, res) => {
    let title = req.body.title
    let id = req.body.id

    Category.update({title: title, slug: slugify(title)},{
        where: {
        id: id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })
})

router.post('/categories/delete', (req, res) => {
    let id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/categories')
            })
        }
        else{
            res.redirect('/')
        }
    }
    else{
        res.redirect('/')
    }
})

module.exports = router