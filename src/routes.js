const express = require('express');
const router = express.Router();

const Webhook = require('./controllers/webhook')

router.get('/ping', (req, res) => res.json({ message: 'Online' }));
router.get('/', Webhook.getAll)
router.post('/', Webhook.handle)

module.exports = router;