const express = require('express');
const router = express.Router();

const { startConversation, getAllConversations } = require('../handlers/conversation');
const { loginRequired } = require('../middleware/auth');

router.post('/', loginRequired, startConversation);
router.get('/', loginRequired, getAllConversations);

module.exports = router;