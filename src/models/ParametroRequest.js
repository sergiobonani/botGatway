const mongoose = require('mongoose');

const parametroRequestSchema = mongoose.Schema({
    cpf: String,
    senha: String,
    cota: String,
    grupo: String,
    valorLance: String
});

module.exports = mongoose.model('ParametroRequestSchema', parametroRequestSchema);