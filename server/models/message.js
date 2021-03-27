const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

messageSchema.plugin(mongoosePaginate);

messageSchema.statics.markMessagesRead = async function(conversation, user) {
    const query = {
        conversation,
        creator: {$ne: user}
    };
    await Message.updateMany(query, { read: true });
};

messageSchema.statics.countUnreadMessages = async function(conversation, user) {
    const query = {
        conversation,
        read: false,
        creator: {$ne: user}
    };
    const result = await Message.countDocuments(query);
    return result;
};

messageSchema.statics.findConvoMessages = async function(conversation, page, limit) {
    const options = {
        page,
        limit,
        populate: {
            path: 'creator',
            select: 'username'
        },
        sort: {
            createdAt: 'desc'
        }
    };
    const result = await Message.paginate({ conversation }, options);
    return result;
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;