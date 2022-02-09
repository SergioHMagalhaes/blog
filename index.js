const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const connetion = require('./data/database')
const port = 8080

const Category = require('./categories/Category')
const categoriesController = require('./categories/CategoriesController')
const Article = require('./articles/Article')
const articlesController = require('./articles/ArticlesController')
const User = require('./user/User')
const UsersController = require('./user/UsersContoller')


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Sessions
app.use(session({
    secret: 'K15fsfwss', cookie: { maxAge: 86400000}

}))

connetion.authenticate()
    .then(() => {
        console.log('✅ Banco de dados conectado')
    }).catch((error) => {
        console.log(`❌ Deu ruim ${error}`)
    })

app.use('/', categoriesController);
app.use('/', articlesController)
app.use('/', UsersController)


app.get('/',(req, res) => {
    
    Article.findAll({
        include: [{model: Category}],
        order: [
            ['id','DESC']
        ],
        limit: 9
    }).then((articles) => {

        Category.findAll().then((categories => {
            res.render('index',{articles: articles, categories: categories})
        }))
        
    })
    
})

app.get('/:slug', (req, res) => {

    let slug = req.params.slug

    Article.findOne({
        where: {
            slug: slug
        }
    }).then((article) => {
        if(article != undefined){
            Category.findAll().then((categories => {
                res.render('article',{article: article, categories: categories})
            }))
            
        }
        else{
            res.redirect('/')
        }
    }).catch((error) => {
        res.redirect('/')
    })
})


app.get('/category/:slug', (req, res) => {

    let slug = req.params.slug

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {

        if(category != undefined){

            Category.findAll().then(categories => {
                res.render('category',{categories: categories, articles: category.articles, title: category.title})
            })

        }
        else{
            res.redirect('/')
        }

    }).catch(error => {
        res.redirect('/')
    })
})


app.listen(port,'0.0.0.0',() => {
    console.log(`✅ Servidor está rodando na porta ${port}`)
})