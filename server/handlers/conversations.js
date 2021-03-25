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
        let conversation = await db.Conversation.initiateConversation(currentUser, otherUser);
        conversation = await db.Conversation.populate(conversation, {
            path: 'users', select: 'username' 
        });
        res.status(201).json({ conversation });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.getAllConversations = async function(req, res, next) {
    try {
        const currentUser = await db.User.findById(req.user);
        const conversations = await db.Conversation.find({ users: currentUser })
            .populate('users', 'username');

        res.status(200).json({ conversations });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.getConversation = async function(req, res, next) {
    try {
        const conversation = await db.Conversation.findById(req.params.id)
            .populate('users', 'username');

        res.status(200).json({ conversation });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};