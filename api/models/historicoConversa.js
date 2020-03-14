const mongoose = require('mongoose');

const historicoConversaSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    tipoUsuario: String,
    tipoAcao: String,
    mensagemUsuario: String,
    mensagemBot: String,
    // mensagemApi: String,
    responseId: String,
    session: String
});

module.exports = mongoose.model('HistoricoConversaSchema', historicoConversaSchema);