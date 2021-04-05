const db = require('../models');

exports.startConversation = async function(req, res, next) {
    try {
        const currentUser = await db.User.findById(req.user);
        const otherUser = await db.User.findById(req.body.userId);

        if(!otherUser) {
            throw new Error('That user does not exist');
        }
        if(currentUser._id.equals(otherUser._id)) {
            throw new Error('You cannot start a conversation with yourself');
        }
        const conversation = await db.Conversation.initiateConversation(currentUser, otherUser);
        const payload = {
            messages: [],
            hasNext: false,
            conversationId: conversation._id,
            otherUser: { 
                username: otherUser.username,
                avatar: otherUser.avatar
            } 
        };
        if(conversation.lastMessage) {
            const result = await db.Message.findConvoMessages(conversation, 1, 20);
            payload.messages = result.docs;
            payload.hasNext = result.hasNextPage;
        }
        res.status(conversation.status).json(payload);
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.getAllConversations = async function(req, res, next) {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 15;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const conversations = await db.Conversation.findConversations(req.user, page, limit);
        for(conversation of conversations.docs) {
            const lastMessage = conversation.lastMessage;
            if(lastMessage && !lastMessage.read && lastMessage.creator._id != req.user) {
                conversation.numUnread = await db.Message.countUnreadMessages(conversation, req.user);
            }
        }
        res.status(200).json({ 
            conversations: conversations.docs, 
            hasNext: conversations.hasNextPage 
        });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.getConversation = async function(req, res, next) {
    try {
        const conversation = await db.Conversation.findConversation(req.params.id, req.user);
        const otherUser = conversation.users.find(user => user != req.user);
        const { username, avatar } = await db.User.findById(otherUser);
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        
        await db.Message.markMessagesRead(conversation, req.user);

        const result = await db.Message.findConvoMessages(conversation, page, limit);
        res.status(200).json({ 
            messages: result.docs, 
            hasNext: result.hasNextPage, 
            otherUser: { username, avatar }
        });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.sendMessage = async function(req, res, next) {
    try {
        const conversation = await db.Conversation.findConversation(req.params.id, req.user);
        const creator = req.user;
        let message = req.body.message;
        let newMessage;

        if(req.file) {
            const img = req.file.buffer;
            const text = message;
            newMessage = await db.Message.create({ conversation, creator, img, text });
        } else {
            if(!message || !message.trim()) {
                throw new Error('Message cannot be empty');
            }
            newMessage = await db.Message.create({ conversation, creator, text: message });
        }
        newMessage = await db.Message.populate(newMessage, {
            path: 'creator conversation',
            select: 'username'
        });
        await db.Conversation.updateOne(conversation, { lastMessage: newMessage });
        res.status(201).json(newMessage);
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};
