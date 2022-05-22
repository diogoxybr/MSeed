const mongoose = require('mongoose')

const Monitoring = mongoose.model('Monitoring', {
    titulo: String,
    descricao: String,
    planta: String,
    dataPlantio: String,
    colheitas: Number,
})
module.exports = Monitoring