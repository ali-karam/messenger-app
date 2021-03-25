const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    lastMessage: {type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
}, { timestamps: true });

conversationSchema.statics.initiateConversation = async function(currentUser, otherUser) {
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
};

conversationSchema.statics.findConversation = async function(convoId, userId) {
    const conversation = await Conversation.findOne({
        _id: convoId,
        users: {
            _id: userId
        }
    });
    return conversation;
};

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;