const router = require('express').Router()

const res = require('express/lib/response')
const Plant = require('../models/Plant')

//Create - criação de dados
router.post('/', async (req, res) => {

    //req.body
    const { planta, tipo, mesIdeal, diasFloresc, diasColhe, foto, tutorial } = req.body

    if (!planta) {
        res.status(422).json({ error: 'A planta é obrigatória!' })
    }

    const plant = {
        planta, tipo, mesIdeal, diasFloresc, diasColhe, foto, tutorial
    }

    try {
        //criando dados
        await Plant.create(plant)
        res.status(201).json({ message: 'Planta criada com sucesso!' })
        return
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Read - leitura de dados
router.get('/', async (req, res) => {
    try {
        const plants = await Plant.find()

        res.status(200).json(plants)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.get('/:id', async (req, res) => {
    //extrair o dado da requisição. pela url = req.params
    const id = req.params.id

    try {
        const plant = await Plant.findOne({ _id: id })

        if (!plant) {
            res.status(422).json({ message: 'A planta não foi encontrado' })
            return
        }
        res.status(200).json(plant)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Update - atualização de dados (PUT, PATCH)
router.patch('/:id', async (req, res) => {
    //extrair o dado da requisição. pela url = req.params
    const id = req.params.id
    const { planta, tipo, mesIdeal, diasFloresc, diasColhe, foto, tutorial } = req.body
    const plant = {
        planta, tipo, mesIdeal, diasFloresc, diasColhe, foto, tutorial
    }

    try {

        const updatePlant = await Plant.updateOne({ _id: id }, plant)

        if (updatePlant.matchedCount === 0) {
            res.status(422).json({ message: 'A planta não foi encontrado' })
            return
        }

        res.status(200).json(plant)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id

    const plant = await Plant.findOne({ _id: id })

    if (!plant) {
        res.status(422).json({ message: 'A planta não foi encontrado!' })
        return
    }

    try {

        await Plant.deleteOne({ _id: id })

        res.status(200).json({ message: 'A planta removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = router