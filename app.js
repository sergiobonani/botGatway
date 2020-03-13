const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const webhookRoutes = require('./api/routes/webhook');

// mongoose.connect(
//     'mongodb+srv://admin:'+ 
//     process.env.MONGO_ATLAS_PW +
//     '@botgateway-dsjn4.mongodb.net/test?retryWrites=true&w=majority',
//     {
//         useNewUrlParser: true
//     }
// );

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, resp, next)=>{
    //TODO:  * substituir pelo site do bot
    resp.header('Access-Control-Allow-Origin', '*');
    resp.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');
    
    if(req.method === 'OPTIONS'){
        //TODO: alterar e deixar somente POST
        resp.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return resp.status(200).json({});
    }

    next();
});

//Rotas
app.use('/webhook', webhookRoutes);

app.use((req, resp, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, resp, next) =>{
    resp.status(error.status || 500);
    resp.json({
        error:{
            message: error.message
        }
    });
})

module.exports = app;


