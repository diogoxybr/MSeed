const router = require('express').Router()

const res = require('express/lib/response')
const Comment = require('../models/comment')

//Create - criação de dados
router.post('/', async (req, res) => {

    //req.body
    const { titulo, planta, comentario } = req.body

    if (!titulo) {
        res.status(422).json({ error: 'O título é obrigatório!' })
    }

    const comment = {
        titulo, planta, comentario
    }

    try {
        //criando dados
        await Comment.create(comment)
        res.status(201).json({ message: 'Comentário feito com sucesso!' })
        return
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Read - leitura de dados
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find()

        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.get('/:id', async (req, res) => {
    //extrair o dado da requisição. pela url = req.params
    const id = req.params.id

    try {
        const comment = await Comment.findOne({ _id: id })

        if (!comment) {
            res.status(422).json({ message: 'O comentário não foi encontrado' })
            return
        }
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//Update - atualização de dados (PUT, PATCH)
router.patch('/:id', async (req, res) => {
    //extrair o dado da requisição. pela url = req.params
    const id = req.params.id
    const { titulo, planta, comentario } = req.body
    const comment = {
        titulo, planta, comentario
    }

    try {

        const updateComment = await Comment.updateOne({ _id: id }, comment)

        if (updateComment.matchedCount === 0) {
            res.status(422).json({ message: 'O comentário não foi encontrado' })
            return
        }

        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id

    const comment = await Comment.findOne({ _id: id })

    if (!comment) {
        res.status(422).json({ message: 'O comentario não foi encontrado!' })
        return
    }

    try {

        await Comment.deleteOne({ _id: id })

        res.status(200).json({ message: 'Comentário removido com sucesso!' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = router