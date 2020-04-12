require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const routes = require('./routes')
const dbConfig = require('./config/database')
const app = express()

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

app.use(routes)
app.use(cors())

app.listen(process.env.SERVER_PORT)
