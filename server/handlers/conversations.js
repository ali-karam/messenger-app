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
        const messages = await db.Message.find({ conversation })
            .populate('creator', 'username');
        res.status(201).json({ messages, conversation: conversation._id });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.getAllConversations = async function(req, res, next) {
    try {
        const populateOptions = {
            path: 'users', 
            select: 'username',  
            match: { _id : { $ne : req.user } }
        };
        const conversations = await db.Conversation.find({ users: req.user })
            .populate(populateOptions)
            .sort({ updatedAt: 'desc' });
        res.status(200).json({ conversations });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.getConversation = async function(req, res, next) {
    try {
        const conversation = await db.Conversation.findConversation(req.params.id, req.user);
        const messages = await db.Message.find({ conversation })
            .populate('creator', 'username');
        res.status(200).json({ messages });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.sendMessage = async function(req, res, next) {
    try {
        const conversation = await db.Conversation.findConversation(req.params.id, req.user);
        const creator = req.user;
        const message = req.body.message;
        if(!conversation) {
            throw new Error('Conversation does not exist');
        }
        if(!message || (typeof message === 'string' && !message.trim())) {
            throw new Error('Message cannot be empty');
        }

        let newMessage = await db.Message.create({ conversation, creator, message });
        newMessage = await db.Message.populate(newMessage, {
            path: 'creator',
            select: 'username'
        });
        res.status(201).json({ newMessage });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};