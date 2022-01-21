const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connetion = require('./data/database')
const port = 8080

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

connetion.authenticate()
    .then(() => {
        console.log('✅ Banco de dados conectado')
    }).catch((error) => {
        console.log(`❌ Deu ruim ${error}`)
    })

app.get('/',(req, res) => {
    res.render('index')
})

app.listen(port,() => {
    console.log(`✅ Servidor está rodando na porta ${port}`)
})