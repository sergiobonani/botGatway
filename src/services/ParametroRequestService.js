const fs = require('fs')
const ParametroRequest = require('../models/ParametroRequest')
const { findValueElement } = require('../utils/ObjectParser')

let rawdata = fs.readFileSync('../resources/deParaParameters.json');

ParametroRequest.init()

async function criaHistorico(body) {
    const { outputContexts } = body
    const parametrosRequest = new ParametroRequest()

    outputContexts.forEach(element => {
        const { parameters } = element
        const dePara = JSON.parse(rawdata)

        if (parameters) {
            Object.keys(dePara).forEach(key => {
                if(!parametrosRequest[key]) {
                    parametrosRequest[dePara[key]] = findValueElement(parameters, key) || parametrosRequest[dePara[key]]
                }
            })
        }
    })

    return ParametroRequest.create(parametrosRequest)
}

function recuperaTodos() {
    return ParametroRequest.find().exec()
}

module.exports = { criaHistorico, recuperaTodos }