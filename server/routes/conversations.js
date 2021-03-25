const express = require('express');
const router = express.Router();

const { 
    startConversation, 
    getAllConversations, 
    getConversation, 
    sendMessage 
} = require('../handlers/conversations');

router.route('/')
    .post(startConversation)
    .get(getAllConversations);
router.route('/:id')
    .get(getConversation)
    .post(sendMessage);

module.exports = router;