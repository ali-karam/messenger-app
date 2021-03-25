const express = require('express');
const router = express.Router();

const { startConversation, getAllConversations, getConversation } = require('../handlers/conversation');
const { loginRequired } = require('../middleware/auth');

router.post('/', loginRequired, startConversation);
router.get('/', loginRequired, getAllConversations);
router.get('/:id', loginRequired, getConversation);

module.exports = router;