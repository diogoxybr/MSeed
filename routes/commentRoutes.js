const router = require('express').Router()

const res = require('express/lib/response')
const Comment = require('../models/Comment')

//Create - criação de dados
router.post('/', async (req, res) => {

    //req.body
    //(pessoa:"Diogo", planta:"alface", assunto:"saboroso", dataComment:"04/05/22", conteudo:"gostei")
    const { pessoa, planta, assunto, dataComment, conteudo } = req.body

    if (!conteudo) {
        res.status(422).json({ error: 'O conteúdo é obrigatório!' })
    }

    const comment = {
        pessoa, planta, assunto, dataComment, conteudo
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
    const { pessoa, planta, assunto, dataComment, conteudo } = req.body
    const comment = {
        pessoa, planta, assunto, dataComment, conteudo
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
        res.status(422).json({ message: 'O comentário não foi encontrado!' })
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