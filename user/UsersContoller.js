const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')


router.get('/admin/users', (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index',{users: users})
    })

    
})

router.get('/admin/users/register', (req, res) => {
    res.render('admin/users/register')
})

router.post('/user/save', (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(password, salt)

    User.findOne({where: {email: email}}).then( user => {
        if (user == undefined){
            User.create({email: email,password: hash}).then(() => {
                res.redirect('/admin/articles')
            }).catch(error => {
                res.redirect('/')
            })
        
        }
        else{
            res.redirect('/admin/users/register')
        }
    })

})

router.post('/user/delete', (req, res) => {
    let id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){
            User.destroy({where: {
                id: id
            }}).then(() => {
                res.redirect('/admin/users')
            })
        }
        else{
            res.redirect('/admin/users')
        }
    }
    else{
        res.redirect('/admin/users')
    }
})


module.exports = router