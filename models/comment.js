const mongoose = require('mongoose')

const Comment = mongoose.model('Comment', {
    titulo: String,
    planta: String,
    comentario: String,
})
module.exports = Comment