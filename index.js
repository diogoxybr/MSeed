//Caso seja e primeira vez rode: npm install express nodemon mongoose
//Para rodar use: npm ini -y & npm

//config inicial
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const { add } = require('nodemon/lib/rules')
const app = express()

//forma de ler JSON / middlewares
app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

// rotas da API
const personRoutes = require('./routes/personRoutes')
app.use('/person', personRoutes)

const commentRoutes = require('./routes/commentRoutes')
app.use('/comment', commentRoutes)

const monitoringRoutes = require('./routes/monitoringRoutes')
app.use('/monitoring', monitoringRoutes)

const plantRoutes = require('./routes/plantRoutes.js')
app.use('/plant', plantRoutes)

//rota inicial / endpoint
app.get('/', (req, res) => {
    // mostrar req
    res.json({ message: 'Oi Express!' })
})

const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

mongoose
    .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@msapicluster.d4wed.mongodb.net/BancoDaAPI?retryWrites=true&w=majority`
    )
    .then(() => {
        console.log('Conectamos ao MongoDB !')
        app.listen(3000)
    })
    .catch((err) => console.log(err))