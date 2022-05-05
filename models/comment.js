const mongoose = require('mongoose')

const Comment = mongoose.model('Comment', {
    pessoa: String,
    planta: String,
    assunto: String,
    dataComment: String,
    conteudo: String,
})
module.exports = Comment