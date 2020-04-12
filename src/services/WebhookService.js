const fs = require('fs')
const fetch = require('node-fetch')
const { findValueElement } = require('../utils/ObjectParser')

const rawData = fs.readFileSync('src/resources/deParaRequest.json');
const DE_PARA = JSON.parse(rawData)

async function logarSistema(parameters) {
    const { parametrosRequest, action } = parameters

    let { senha, cpf } = parametrosRequest

    cpf = cpf.split(".").join("");
    cpf = cpf.replace('-', '');

    const retornoAPI = await doRequest(action, { senha, cpf })
    const response = {}

    if (retornoAPI && !retornoAPI.success) {
        if (retornoAPI.details['CpfCnpj'].length >= 0) {
            response.mensagem = 'O CPF informado está inválido. Digite INFORMAR CPF, para informar novamente.'
        }
        else if (retornoAPI.details['Senha'].length >= 0) {
            response.mensagem = 'Senha informada é inválida, digite INFORMAR SENHA, para informar novamente. Ou digite ESQUECI MINHA SENHA.'
        }
        else {
            response.mensagem = 'Ops, aconteceu algum erro que não podemos ajudar. Tente novamente mais tarde ou digite ATENDENTE para falar com uma pessoa.'
        }

        response.isSuccess = false;
    } else {
        response.idUsuario = findValueElement(retornoAPI.data[0], "IdUsuario");
        response.isSuccess = true;
    }

    return response
}

async function doRequest(action, parameters) {
    const res = await fetch(`${process.env.API_CONSORCIO_URL}/${action.endpoint}`, {
        method: 'POST',
        headers: buildHeaders(),
        formData: buildBody(parameters, action.parametros)
    })

    return await res.json()
}

function buildHeaders() {
    return {
        secret: process.env.API_SECRET,
        token: process.env.API_TOKEN
    }
}

function buildBody(parameters, parametersName) {
    const body = {}

    parametersName.forEach(p => {
        body[DE_PARA[p]] = parameters[p]
    })

    return body
}

module.exports = { doRequest, logarSistema }