//Caso seja e primeira vez rode: npm install express nodemon mongoose
//Para rodar use: npm init -y & npm run start

//config inicial
// imports
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { add } = require('nodemon/lib/rules')
const app = express()


//forma de ler JSON / middlewares
app.use(
    express.urlencoded({
        extended: true,
    }),
)

//Config JSON response
app.use(express.json())

// Models
const User = require('./models/User')

// rotas da API
const commentRoutes = require('./routes/commentRoutes')
app.use('/comment', commentRoutes)

const monitoringRoutes = require('./routes/monitoringRoutes')
app.use('/monitoring', monitoringRoutes)

const plantRoutes = require('./routes/plantRoutes.js')
app.use('/plant', plantRoutes)

//Rota inicial - Endpoint
//Open Route - Public Route
app.get('/', (req, res) => {
    // mostrar req
    res.status(200).json({ message: 'Bem vindo à API do Magic Seed' })
})

// Private Route
app.get("/user/:id", checkToken, async (req, res) => {

    const id = req.params.id

    // check if user exists
    // Verifica se o usuário já existe
    const user = await User.findById(id, '-password')

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' })
    }

    res.status(200).json({ user })
})

function checkToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado!' })
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()

    } catch (error) {

        res.status(400).json({ msg: "Token inválido!" })

    }
}

//Registrar usuário
app.post('/auth/register', async (req, res) => {

    const { name, email, password, confirmpassword } = req.body

    //validações
    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatorio!' })
    }

    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatorio!' })
    }

    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatoria!' })
    }

    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas não conferem!' })
    }

    // check if user exists
    // Verifica se o usuário já existe
    const userExists = await User.findOne({ email: email })

    if (userExists) {
        return res.status(422).json({ msg: 'Por favor, utilize outro e-mail!' })
    }

    // create password
    // criar senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create user
    //criar usuário
    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try {
        await user.save()

        res.status(201).json({ msg: 'Usuário criado com sucesso!' })
    } catch (error) {
        console.log(error)

        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente mais tarde' })
    }
})

// Login User
// Authenticação de usuário
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body

    //validations
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatorio!' })
    }

    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatoria!' })
    }

    // check if user exists
    // Verifica se o usuário já existe
    const user = await User.findOne({ email: email })

    if (!user) {
        return res.status(422).json({ msg: 'Usuário não encontrado!' })
    }

    // check if password match
    // verifica se a senha está correta
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida!' })
    }

    try {

        const secret = process.env.secret

        const token = jwt.sign(
            {
                id: user._id
            },
            secret,
        )
        res.status(200).json({ msg: "Autenticação realizada com sucesso", token })

    } catch (error) {
        console.log(error)

        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente mais tarde' })
    }

})

//Credenciais
const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

mongoose
    .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@msapicluster.d4wed.mongodb.net/BancoDaAPI?retryWrites=true&w=majority`
    )
    .then(() => {
        console.log('Conectamos ao MongoDB !')
        app.listen(process.env.PORT || 3000);
    })
    .catch((err) => console.log(err))