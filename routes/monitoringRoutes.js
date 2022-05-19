const router = require('express').Router()

const res = require('express/lib/response')
const Monitoring = require('../models/monitoring')

//Create - criação de dados
router.post('/', async (req, res) => {

    //req.body
    //("planta: "String",    planta: String,    dataPlantio: String,    colheitas: Number,)
    const { planta, dataPlantio, colheitas } = req.body

    if (!dataPlantio) {
        res.status(422).json({ error: 'A data do plantio é obrigatória!' })
    }

    const monitoring = {
        planta, dataPlantio, colheitas
    }

    try {
        //criando dados
        await Monitoring.create(monitoring)
        res.status(201).json({ message: 'Monitoramento feito com sucesso!' })
        return
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Read - leitura de dados
router.get('/', async (req, res) => {
    try {
        const monitorings = await Monitoring.find()

        res.status(200).json(monitorings)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.get('/:id', async (req, res) => {
    //extrair o dado da requisição. pela url = req.params
    const id = req.params.id

    try {
        const monitoring = await Monitoring.findOne({ _id: id })

        if (!monitoring) {
            res.status(422).json({ message: 'O monitoramento não foi encontrado' })
            return
        }
        res.status(200).json(monitoring)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Update - atualização de dados (PUT, PATCH)
router.patch('/:id', async (req, res) => {
    //extrair o dado da requisição. pela url = req.params
    const id = req.params.id
    const { planta, dataPlantio, colheitas } = req.body
    const monitoring = {
        planta, dataPlantio, colheitas
    }

    try {

        const updateMonitoring = await Monitoring.updateOne({ _id: id }, monitoring)

        if (updateMonitoring.matchedCount === 0) {
            res.status(422).json({ message: 'O monitoramento não foi encontrado' })
            return
        }

        res.status(200).json(monitoring)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id

    const monitoring = await Monitoring.findOne({ _id: id })

    if (!monitoring) {
        res.status(422).json({ message: 'O monitoramento não foi encontrado!' })
        return
    }

    try {

        await Monitoring.deleteOne({ _id: id })

        res.status(200).json({ message: 'monitoramento removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = router