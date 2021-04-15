const express = require('express');
const router = express.Router();

const {
    startConversation,
    getAllConversations,
    getConversation,
} = require('../handlers/conversations');

router.route('/')
    .post(startConversation)
    .get(getAllConversations);
router.get('/:id', getConversation);

module.exports = router;
