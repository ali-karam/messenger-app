const db = require('../models');

const configOptions = (user) => { 
    return {
        path: 'users', 
        select: 'username',  
        match: { _id : { $ne : user } }
    }
};

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
        let conversation = await db.Conversation.initiateConversation(currentUser, otherUser);
        conversation = await db.Conversation.populate(conversation, configOptions(req.user));
        res.status(201).json({ conversation });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.getAllConversations = async function(req, res, next) {
    try {
        const conversations = await db.Conversation.find({ users: req.user })
            .populate(configOptions(req.user))
            .sort({ updatedAt: 'desc' });
        res.status(200).json({ conversations });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.getConversation = async function(req, res, next) {
    try {
        let conversation = await db.Conversation.findConversation(req.params.id, req.user);
        conversation = await db.Conversation.populate(conversation, configOptions(req.user));
        res.status(200).json({ conversation });
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