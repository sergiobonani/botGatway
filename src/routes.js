const express = require('express');
const router = express.Router();

const WebhookController = require('./controllers/WebhookController')

router.get('/ping', (req, res) => res.json({ message: 'Online' }));
router.get('/', WebhookController.getAll)
router.post('/', WebhookController.handle)

module.exports = router;