const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')


router.get('/login', (req, res) => {
    res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({where:{email: email}}).then(user => {
        if(user != undefined){
            let correct = bcrypt.compareSync(password, user.password)

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles')
            }
            else{
                res.redirect("/login")
            }
        }
        else{
            res.redirect("/login")
        }
    })
})

router.get('/admin/users', (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index',{users: users})
    })
})

router.get('/register', (req, res) => {
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
            res.redirect('/register')
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


router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router