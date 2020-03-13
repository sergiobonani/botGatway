const mongoose = require('mongoose');

const usuarioLogin = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: String,
    email: String
});

module.exports = mongoose.model('usuarioLogin', usuarioLogin);