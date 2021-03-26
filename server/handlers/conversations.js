const db = require('../models');

exports.startConversation = async function(req, res, next) {
    try {
        const currentUser = await db.User.findById(req.user);
        const otherUser = await db.User.findOne({ username: req.body.username });

        if(!otherUser) {
            throw new Error('That user does not exist');
        }
        if(currentUser._id.equals(otherUser._id)) {
            throw new Error('You cannot start a conversation with yourself');
        }
        const conversation = await db.Conversation.initiateConversation(currentUser, otherUser);

        const result = await db.Message.findConvoMessages(conversation, 1, 15);
        res.status(200).json({ 
            messages: result.docs, 
            hasNext: result.hasNextPage, 
            conversation: conversation._id 
        });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.getAllConversations = async function(req, res, next) {
    try {
        const populateUser = {
            path: 'users', 
            select: 'username',  
            match: { _id : { $ne : req.user } }
        };
        const conversations = await db.Conversation.find({ users: req.user })
            .populate(populateUser)
            .populate('lastMessage', 'message creator read')
            .sort({ updatedAt: 'desc' });
        res.status(200).json({ conversations });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.getConversation = async function(req, res, next) {
    try {
        const conversation = await db.Conversation.findConversation(req.params.id, req.user);
        const limit = req.query.limit ? parseInt(req.query.limit) : 15;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        
        await db.Message.markMessagesRead(conversation, req.user);

        const result = await db.Message.findConvoMessages(conversation, page, limit);
        res.status(200).json({ messages: result.docs, hasNext: result.hasNextPage });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.sendMessage = async function(req, res, next) {
    try {
        const conversation = await db.Conversation.findConversation(req.params.id, req.user);
        const creator = req.user;
        let message = req.body.message;

        if(req.file) {
            message = req.file.buffer;
        }
        if(!message || (typeof message === 'string' && !message.trim())) {
            throw new Error('Message cannot be empty');
        }
        let newMessage = await db.Message.create({ conversation, creator, message });
        newMessage = await db.Message.populate(newMessage, {
            path: 'creator',
            select: 'username'
        });
        await db.Conversation.updateOne(conversation, { lastMessage: newMessage });
        res.status(201).json({ newMessage });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};