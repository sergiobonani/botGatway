require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const routes = require('./routes')
const app = express()

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

app.use(routes)
app.use(cors())

app.listen(process.env.SERVER_PORT)
