const fs = require('fs')

const HistoricoService = require('../services/HistoricoService')
const ParametroRequestService = require('../services/ParametroRequestService')
const WebhookService = require('../services/WebhookService')

const rawData = fs.readFileSync('src/resources/actions.json');
const ACTIONS = JSON.parse(rawData)

async function handle(req, res) {
    const historico = await HistoricoService.criaHistorico(req.body)
    const parametrosRequest = await ParametroRequestService.criaHistorico(req.body.queryResult)

    const action = ACTIONS.find(ac => ac.code === historico.tipoAcao)
    let response = ''
    
    if(action.hookFunction) {
        response = await WebhookService[action.hookFunction]({parametrosRequest, action})
    } else {
        response = await WebhookService.doRequest(action, parametrosRequest)
        historico.mensagemBot = response.fulfillmentText
        await HistoricoService.atualizaHistorico(historico)
    }

    res.json(response)
}

async function getAll(req, res) {
    const resultHistorico = await HistoricoService.recuperaTodos()
    res.json(resultHistorico)
}

module.exports = { handle, getAll }