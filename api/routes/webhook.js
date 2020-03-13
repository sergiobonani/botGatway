const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const HistoricoConversa = require('../models/historicoConversa');
const tipoUsuario = require('../enums/tipoUsuario');

const WebhookController = require('../controllers/webhook');

router.get('/', WebhookController.get_all);

router.post('/', WebhookController.post);

module.exports = router;