const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

messageSchema.statics.markMessagesRead = async function(conversation, user) {
    const query = {
        conversation,
        creator: {$ne: user}
    };
    await Message.updateMany(query, { read: true });
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;