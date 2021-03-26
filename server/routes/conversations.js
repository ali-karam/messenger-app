const express = require('express');
const router = express.Router();

const { 
    startConversation, 
    getAllConversations, 
    getConversation, 
    sendMessage 
} = require('../handlers/conversations');
const { upload } = require('../middleware/fileUpload');

router.route('/')
    .post(startConversation)
    .get(getAllConversations);
router.route('/:id')
    .get(getConversation)
    .post(upload.single('message'), sendMessage);

module.exports = router;