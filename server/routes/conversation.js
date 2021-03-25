const express = require('express');
const router = express.Router();

const { startConversation } = require('../handlers/conversation');
const { loginRequired } = require('../middleware/auth');

router.post('/', loginRequired, startConversation);

module.exports = router;