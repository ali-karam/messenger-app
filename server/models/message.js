const mongoose = require('mongoose');

const messageSchmea = new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    read: Boolean
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchmea);

module.exports = Message;