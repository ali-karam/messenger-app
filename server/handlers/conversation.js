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
        res.status(200).json({ conversation });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};
