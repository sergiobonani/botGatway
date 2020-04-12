const fetch = require('node-fetch')
const { findValueElement } = require('../utils/ObjectParser')

async function logarSistema(parameters) {
    const { parametrosRequest, action } = parameters

    let { senha, cpf } = parametrosRequest

    cpf = cpf.split(".").join("");
    cpf = cpf.replace('-', '');

    const requestResult = await doRequest(action, { senha, cpf })
    const response = {}

    if(requestResult.ok) {
        const retornoAPI = res.body

        if (retornoAPI && !retornoAPI.success) {
            if (retornoAPI.details.search('CPF/CNPJ') >= 0) {
                response.mensagem = 'O CPF informado está inválido. Digite INFORMAR CPF, para informar novamente.'
            }
            else if (retornoAPI.details.search('Senha') >= 0) {
                response.mensagem = 'Senha informada é inválida, digite INFORMAR SENHA, para informar novamente. Ou digite ESQUECI MINHA SENHA.'
            }
            else {
                response.mensagem = 'Ops, aconteceu algum erro que não podemos ajudar. Tente novamente mais tarde ou digite ATENDENTE para falar com uma pessoa.'
            }

            response.isSuccess = false;
        }

        response.idUsuario = findValueElement(retornoAPI.data[0], "IdUsuario");
        response.isSuccess = true;
    } else {
        response.mensagem = 'Ops, aconteceu algum erro que não podemos ajudar. Tente novamente mais tarde ou digite ATENDENTE para falar com uma pessoa.'
        response.isSuccess = false;
    }

    return response
}

async function doRequest(action, parameters) {
    const res = await fetch(`${process.env.API_CONSORCIO_URL}/${action.endpoint}`, {
        method: 'POST',
        headers: buildHeaders(),
        body: buildBody(parameters, action.parametros)
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

    parametersName.forEach(p => body[p] = parameters[p])

    return body
}

module.exports = { doRequest, logarSistema }