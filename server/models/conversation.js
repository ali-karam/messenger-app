const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, { timestamps: true });

conversationSchema.statics.initiateConversation = async function(currentUser, otherUser, next) {
    try {
        const existingConvo = await Conversation.findOne({
            users: { $all: [currentUser._id, otherUser._id] }
        });
        
        if(existingConvo) {
            return existingConvo;
        }
        const newConvo = new Conversation();
        newConvo.users.push(currentUser, otherUser);
        await newConvo.save();
        return newConvo;
    } catch(err) {
        return next(err);
    }
};

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;