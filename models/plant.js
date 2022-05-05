const mongoose = require('mongoose')

const Plants = mongoose.model('Plants', {
    planta: String,
    tipo: String,
    mesIdeal: String,
    diasFloresc: Number,
    diasColhe: Number,
    foto: String,
    tutorial: String
})
module.exports = Plants