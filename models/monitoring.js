const mongoose = require('mongoose')

const Monitoring = mongoose.model('Monitoring', {
    planta: String,
    dataPlantio: String,
    colheitas: Number,
})
module.exports = Monitoring