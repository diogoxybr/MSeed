const mongoose = require('mongoose')

const Person = mongoose.model('Person', {
    id: String,
    nome: String,
    email: String,
})
module.exports = Person