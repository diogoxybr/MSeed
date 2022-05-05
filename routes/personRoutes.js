const router = require('express').Router()

const res = require('express/lib/response')
const Person = require('../models/Person')

//Create - criação de dados
router.post('/', async (req, res) => {

    //req.body
    //(nome:"Diogo", email:"diogo@diogo.com")
    const { nome, email } = req.body

    if (!nome) {
        res.status(422).json({ error: 'O nome é obrigatório!' })
    }

    const person = {
        nome,
        email,
    }

    try {
        //criando dados
        await Person.create(person)
        res.status(201).json({ message: 'Operação realizada com sucesso!' })
        return
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Read - leitura de dados
router.get('/', async (req, res) => {
    try {
        const people = await Person.find()

        res.status(200).json(people)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.get('/:id', async (req, res) => {
    //extrair o dado da requisição. pela url = req.params
    const id = req.params.id

    try {
        const person = await Person.findOne({ _id: id })

        if (!person) {
            res.status(422).json({ message: 'O usuário não foi encontrado' })
            return
        }
        res.status(200).json(person)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Update - atualização de dados (PUT, PATCH)
router.patch('/:id', async (req, res) => {
    //extrair o dado da requisição. pela url = req.params
    const id = req.params.id
    const { nome, email } = req.body
    const person = {
        nome,
        email,
    }

    try {

        const updatePerson = await Person.updateOne({ _id: id }, person)

        if (updatePerson.matchedCount === 0) {
            res.status(422).json({ message: 'O usuário não foi encontrado' })
            return
        }

        res.status(200).json(person)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id

    const person = await Person.findOne({ _id: id })

    if (!person) {
        res.status(422).json({ message: 'O usuário não foi encontrado!' })
        return
    }

    try {

        await Person.deleteOne({ _id: id })

        res.status(200).json({ message: 'Usuário removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = router