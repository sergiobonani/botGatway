const HistoricoConversa = require('../models/HistoricoConversa')

HistoricoConversa.init()

async function criaHistorico(body) {
    const { session, responseId, queryResult } = body
    const { queryText, fulfillmentText, action } = queryResult

    const historicoConversa = new HistoricoConversa()
    historicoConversa.session = session || ''
    historicoConversa.responseId = responseId || ''
    historicoConversa.mensagemUsuario = queryText || ''
    historicoConversa.mensagemBot = fulfillmentText || ''
    historicoConversa.tipoAcao = action || ''

    return HistoricoConversa.create(historicoConversa)
}

function recuperaTodos() {
    return HistoricoConversa.find().exec()
}

module.exports = { criaHistorico, recuperaTodos }