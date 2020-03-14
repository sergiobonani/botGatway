const HistoricoConversa = require('../models/historicoConversa');
const ParametrosRequest = require('../models/parametrosRequest');
const DadosUsuarioLogado = require('../models/dadosUsuarioLogado');
const ResponseApi = require('../models/responseApi');
const acoes = require('../enums/acoes');
const querystring = require('querystring');
const http = require('https');
let fetch = require('node-fetch');
const request = require("request");
const mongoose = require("mongoose");

const apiUrl = 'https://hom-apiconsorciadomysql.caoaconsorcios.com.br/';

const dadosUsuarioLogado = new DadosUsuarioLogado();

exports.post = (req, resp, next) => {
    console.log(req.body);
    console.log(req.body.session);
    console.log(req.body.responseId);

    const corpo = req.body.queryResult;

    const parametrosRequest = new ParametrosRequest();
    HistoricoConversa.init();

    var historicoConversa = new HistoricoConversa();
    
    historicoConversa.session = req.body.session;
    historicoConversa.responseId = req.body.responseId;

    console.log(corpo);
    if (corpo.hasOwnProperty("queryText")) {
        historicoConversa.mensagemUsuario = corpo.queryText;
    }
    if (corpo.hasOwnProperty("fulfillmentText")) {
        historicoConversa.mensagemBot = corpo.fulfillmentText;
    }
    if (corpo.hasOwnProperty("action")) {
        historicoConversa.tipoAcao = corpo.action;
    }

    // if(corpo.hasOwnProperty("fulfillmentMessages")){
    //     console.log('============ fulfillmentMessages ========>');
    //     console.log(corpo.fulfillmentMessages[0]);
    // }
    if (corpo.hasOwnProperty("outputContexts")) {
        corpo.outputContexts.forEach(element => {
            if (element.hasOwnProperty("parameters")) {

                const cpf = findValueElement(element.parameters, "CPF");
                parametrosRequest.cpf = cpf ? cpf : parametrosRequest.cpf;

                const senha = findValueElement(element.parameters, "senha");
                parametrosRequest.senha = senha ? senha : parametrosRequest.senha;

                const cota = findValueElement(element.parameters, "cota");
                parametrosRequest.cota = cota ? cota : parametrosRequest.cota;

                const grupo = findValueElement(element.parameters, "grupo");
                parametrosRequest.grupo = grupo ? grupo : parametrosRequest.grupo;

                const valorLance = findValueElement(element.parameters, "valor_lance");
                parametrosRequest.valorLance = valorLance ? valorLance : parametrosRequest.valorLance;
            }
        });
    }

    if (historicoConversa.tipoAcao == acoes.SENHA_OK || historicoConversa.tipoAcao == acoes.REDIGITA_SENHA_OK) {
        // logarSistema(parametrosRequest.senha, parametrosRequest.cpf).then(function (result) {
        //     if (result.isSuccess == false) {
        //         resp.status(200).json({
        //             fulfillmentText: result.mensagem,
        //             displayText: result.mensagem
        //         });
        //     } else {
        //         dadosUsuarioLogado.idUsuario = result.idUsuario;
        //         buscarCotas(dadosUsuarioLogado).then(function (result) {
        //             resp.status(200).json({
        //                 fulfillmentText: result.mensagem,
        //                 displayText: result.mensagem
        //             });
        //         });
        //     }
        // });
        var msg = "Seus grupos e cotas são: 1774-6000-0. Digite para qual grupo deseja atendimento.";
        historicoConversa.mensagemBot = msg;

        resp.status(200).json({
            fulfillmentText: msg,
            displayText: "teste"
        });
    }
    
    if(historicoConversa.tipoAcao == acoes.GRUPO_COTA_SELECIONADA){
        // verificarGrupoCotaValido(parametrosRequest.cota, parametrosRequest.grupo).then(function(result){
        //     resp.status(200).json({
        //         fulfillmentText: result.mensagem,
        //         displayText: result.mensagem
        //     })
        // });

        var msg = 'O que deseja fazer? INFORMAÇÕES SOBRE A COTA, INFORMAÇÕES SOBRE BOLETO, OFERTAR LANCE, RESULTADO DA ÚLTIMA ASSEMBLEIA ou PRÓXIMA ASSEMBLEIA?';
        historicoConversa.mensagemBot = msg;

        resp.status(200).json({
            fulfillmentText: msg,
            displayText: "teste"
        })
    }

    if(historicoConversa.tipoAcao == acoes.INFO_COTA){
        // obterInformacoesSobreCota(parametrosRequest.cota, parametrosRequest.grupo).then(function(result){
        //     resp.status(200).json({
        //         fulfillmentText: result.mensagem,
        //         displayText: result.mensagem
        //     })
        // });
        var msg = 'Sua cota está com o pagamento em dia. Caso queira mais alguma informação, digite uma opção ou ATENDENTE';
        historicoConversa.mensagemBot = msg;

        resp.status(200).json({
            fulfillmentText: msg,
            displayText: "teste"
        })        
    }

    if(historicoConversa.tipoAcao == acoes.OFERTAR_LANCE){
        // ofertarLance(parametrosRequest.cota, parametrosRequest.grupo, paramentros.valorLance).then(function(result){
        //     resp.status(200).json({
        //         fulfillmentText: result.mensagem,
        //         displayText: result.mensagem
        //     })
        // });

        var msg = 'Lance ofertado com sucesso. Caso queira mais alguma informação, digite uma opção ou ATENDENTE';
        historicoConversa.mensagemBot = msg;

        resp.status(200).json({
            fulfillmentText: msg,
            displayText: "teste"
        })
    }

    if(historicoConversa.tipoAcao == acoes.RESULT_ULT_ASSEMBLEIA){
        // obterResultadoUltimaAssembleia(parametrosRequest.cota, parametrosRequest.grupo, paramentros.valorLance).then(function(result){
        //     resp.status(200).json({
        //         fulfillmentText: result.mensagem,
        //         displayText: result.mensagem
        //     })
        // });

        var msg = 'Foram 8 cotas contempladas. Caso queira mais alguma informação, digite uma opção ou ATENDENTE';
        historicoConversa.mensagemBot = msg;

        resp.status(200).json({
            fulfillmentText: msg,
            displayText: "teste"
        })
    }

    if(historicoConversa.tipoAcao == acoes.PROX_ASSEMBLEIA){
        // obterProximaAssembleia(parametrosRequest.cota, parametrosRequest.grupo, paramentros.valorLance).then(function(result){
        //     resp.status(200).json({
        //         fulfillmentText: result.mensagem,
        //         displayText: result.mensagem
        //     })
        // });

        historicoConversa.mensagemBot = msg;

        resp.status(200).json({
            fulfillmentText: 'A próxima assembleia será no dia 20/05. Caso queira mais alguma informação, digite uma opção ou ATENDENTE',
            displayText: "teste"
        })
    } else{
        resp.status(200).json();
    }

    console.log(mongoose.connection.readyState);

    historicoConversa.save(function(err){
        if(err){
             console.log(err);
             return;
        }
  });
};

function obterInformacoesSobreCota(cota, grupo){
    var url = '';    
    var options = obterOptionsPostRequest(url);
    options.formData = { cota: cota, grupo: grupo };

    return new Promise(function (resolve, reject) {
        response = new ResponseApi();

        request(options, function (error, resp, body) {
            if (error) {
                console.log(error);
                response.mensagem = 'Ops, aconteceu algum erro que não podemos ajudar. Tente novamente mais tarde ou digite ATENDENTE para falar com uma pessoa.'
            }

            const retornoAPI = JSON.parse(body);

            if(!retornoAPI.isSuccess){
                response.mensagem = 'Ops, aconteceu algum erro que não podemos ajudar. Tente novamente mais tarde ou digite ATENDENTE para falar com uma pessoa.'
                response.isSuccess = false;
                return resolve(response);
            }

            response.isSuccess = true;
            response.mensagem = 'O que deseja fazer? INFORMAÇÕES SOBRE A COTA, INFORMAÇÕES SOBRE BOLETO, OFERTAR LANCE, RESULTADO DA ÚLTIMA ASSEMBLEIA ou PRÓXIMA ASSEMBLEIA?'
            resolve(response);
        });        
    });
}

function verificarGrupoCotaValido(cota, grupo){
    var url = '';    
    var options = obterOptionsPostRequest(url);
    options.formData = { cota: cota, grupo: grupo };

    return new Promise(function (resolve, reject) {
        response = new ResponseApi();

        request(options, function (error, resp, body) {
            if (error) {
                console.log(error);
                response.mensagem = 'Ops, aconteceu algum erro que não podemos ajudar. Tente novamente mais tarde ou digite ATENDENTE para falar com uma pessoa.'
            }

            const retornoAPI = JSON.parse(body);

            if(!retornoAPI.isSuccess){
                response.mensagem = 'Ops, aconteceu algum erro que não podemos ajudar. Tente novamente mais tarde ou digite ATENDENTE para falar com uma pessoa.'
                response.isSuccess = false;
                return resolve(response);
            }

            response.isSuccess = true;
            response.mensagem = 'O que deseja fazer? INFORMAÇÕES SOBRE A COTA, INFORMAÇÕES SOBRE BOLETO, OFERTAR LANCE, RESULTADO DA ÚLTIMA ASSEMBLEIA ou PRÓXIMA ASSEMBLEIA?'
            resolve(response);
        });        
    });
}

function obterInformacoesSobreBoleto(cota, grupo){
    var url = '';    
    var options = obterOptionsPostRequest(url);
    options.formData = { cota: cota, grupo: grupo };

    return new Promise(function (resolve, reject) {
        response = new ResponseApi();

        request(options, function (error, resp, body) {
            if (error) {
                console.log(error);
                response.mensagem = 'Ops, aconteceu algum erro que não podemos ajudar. Tente novamente mais tarde ou digite ATENDENTE para falar com uma pessoa.'
            }

            const retornoAPI = JSON.parse(body);

            if(!retornoAPI.isSuccess){
                response.mensagem = 'Ops, aconteceu algum erro que não podemos ajudar. Tente novamente mais tarde ou digite ATENDENTE para falar com uma pessoa.'
                response.isSuccess = false;
                return resolve(response);
            }

            response.isSuccess = true;
            response.mensagem = 'O que deseja fazer? INFORMAÇÕES SOBRE A COTA, INFORMAÇÕES SOBRE BOLETO, OFERTAR LANCE, RESULTADO DA ÚLTIMA ASSEMBLEIA ou PRÓXIMA ASSEMBLEIA?'
            resolve(response);
        });        
    });
}

function ofertarLance(cota, grupo, valorLance){
    var url = '';    
    var options = obterOptionsPostRequest(url);
    options.formData = { cota: cota, grupo: grupo };

    return new Promise(function (resolve, reject) {
        response = new ResponseApi();

        request(options, function (error, resp, body) {
            if (error) {
                console.log(error);
                response.mensagem = 'Ops, aconteceu algum erro que não podemos ajudar. Tente novamente mais tarde ou digite ATENDENTE para falar com uma pessoa.'
            }

            const retornoAPI = JSON.parse(body);

            if(!retornoAPI.isSuccess){
                response.mensagem = 'Ops, aconteceu algum erro que não podemos ajudar. Tente novamente mais tarde ou digite ATENDENTE para falar com uma pessoa.'
                response.isSuccess = false;
                return resolve(response);
            }

            response.isSuccess = true;
            response.mensagem = 'O que deseja fazer? INFORMAÇÕES SOBRE A COTA, INFORMAÇÕES SOBRE BOLETO, OFERTAR LANCE, RESULTADO DA ÚLTIMA ASSEMBLEIA ou PRÓXIMA ASSEMBLEIA?'
            resolve(response);
        });        
    });
}

function findValueElement(object, key) {
    var value;
    Object.keys(object).some(function (k) {
        if (k === key) {
            value = object[k];
            return true;
        }
        if (object[k] && typeof object[k] === 'object') {
            value = findValueElement(object[k], key);
            return value !== undefined;
        }
    });
    return value;
}

function obterOptionsPostRequest(apiUrl){
    const options = {
        method: 'POST',

        //CpfCnpj: '12345678909', Senha: '630143'

        url: apiUrl,
        headers:
        {
            'postman-token': 'ab4ab048-fac2-a45b-341c-0bf2a3ba7cfb',
            'cache-control': 'no-cache',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
            secret: 'basfgt71gy123a7a1d5071a4673d4d810c5125646',
            token: '8n93d76e1241asf2ae7fd0002d672572b49'
        }
    };

    return options;
}

function logarSistema(senha, cpf) {
    //cpf = cpf.replace('.', '');
    cpf = cpf.split(".").join("");
    cpf = cpf.replace('-', '');
    var url = `${apiUrl}user/acessoAppCpfCnpj/1`;

    const options = obterOptionsPostRequest(url);
    options.formData = { CpfCnpj: cpf, Senha: senha };

    return new Promise(function (resolve, reject) {
        response = new ResponseApi();

        request(options, function (error, resp, body) {
            if (error) {
                console.log(error);
                response.mensagem = 'Ops, aconteceu algum erro que não podemos ajudar. Tente novamente mais tarde ou digite ATENDENTE para falar com uma pessoa.'
            }

            const retornoAPI = JSON.parse(body);

            if (!retornoAPI.success) {
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
                return resolve(response);
            }

            response.idUsuario = findValueElement(retornoAPI.data[0], "IdUsuario");
            response.isSuccess = true;

            resolve(response);
        });
    });
}


function buscarCotas(dadosUsuarioLogado) {
    var request = require("request");

    var url = `${apiUrl}cotas/listCotasConsorciado/${dadosUsuarioLogado.idUsuario}`;

    var options = obterOptionsPostRequest(url);
    options.formData = {}

    return new Promise(function (resolve, reject) {
        response = new ResponseApi();

        request(options, function (error, resp, body) {
            if (error) {
                response.mensagem = 'Ops, não achamos nenhuma cota para você. Caso possua, digite ATENDENTE que iremos te direcionar para uma pessoa';
            }

            const cotas = JSON.parse(body).data[0];

            response.mensagem = criarMensagemParaCotas(cotas);
            response.isSuccess = true;

            resolve(response);
        });
    });
}

function criarMensagemParaCotas(cotas) {
    if (!cotas) {
        return 'Ops, não achamos nenhuma cota para você. Caso possua, digite ATENDENTE que iremos te direcionar para uma pessoa';
    }

    var mensagem = '';
    cotas[0].forEach(cota => {
        const Codigo_Cota = cota.Codigo_Cota;
        const Codigo_Grupo = cota.Codigo_Grupo;
        const Versao = cota.Versao;
        mensagem = `${mensagem}  || Cota/Grupo/Versão: ${Codigo_Cota}-${Codigo_Grupo}-${Versao}`;
    });

    return mensagem;
}

exports.get_all = (req, resp, next) => {
    HistoricoConversa.find()
        .exec()
        .then(doc => {
            console.log(doc);
            resp.status(200).json(doc);
        }).catch(err => {
            console.log(err);
            resp.status(500).json(err);
        });
}