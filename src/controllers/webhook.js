const fs = require('fs')
const fetch = require('node-fetch')

const HistoricoService = require('../services/HistoricoService')
const ParametroRequestService = require('../services/ParametroRequestService')

const rawData = fs.readFileSync('src/resources/actions.json');
const ACTIONS = JSON.parse(rawData)

async function handle(req, res) {
    const historico = await HistoricoService.criaHistorico(req.body)
    // const parametros = await ParametroRequestService.criaHistorico(req.body.queryResult)
    
    const actionCode = Object.keys(ACTIONS).find(action => action.code === historico.action)

    fetch(ACTIONS[actionCode].endpoint, {
        method: 'POST',
        headers: {
            secret: process.env.API_SECRET,
            token: process.env.API_TOKEN
        },
        body: bodyBuilder(historico, ACTIONS[actionCode].parameters)
    }).then(msg => {
        res.status(200).json({
            fulfillmentText: msg,
            displayText: process.env.DISPLAY_TEXT
        })
    }).catch(err => {
        res.status(500).json(err)
    })    
}

async function getAll(req, res) {
    const resultHistorico = await HistoricoService.recuperaTodos()
    const resultParametros = await ParametroRequestService.recuperaTodos()
    res.json({...resultHistorico, ...resultParametros})
}

function bodyBuilder(historico, parameters) {
    const body = {}

    parameters.forEach(p => body[p] = historico[p])

    return body
}

module.exports = { handle, getAll }