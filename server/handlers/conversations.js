const db = require('../models');
const FileType = require('file-type');

exports.startConversation = async function (req, res, next) {
    try {
        const currentUser = await db.User.findById(req.user);
        const otherUser = await db.User.findById(req.body.userId);

        if (!otherUser) {
            throw new Error('That user does not exist');
        }
        if (currentUser._id == otherUser._id) {
            throw new Error('You cannot start a conversation with yourself');
        }
        const conversation = await db.Conversation.initiateConversation(currentUser, otherUser);
        const payload = {
            messages: [],
            hasNext: false,
            conversationId: conversation._id,
            otherUser: {
                username: otherUser.username,
                avatar: otherUser.avatar,
                _id: otherUser._id
            }
        };
        if (conversation.lastMessage) {
            const result = await db.Message.findConvoMessages(conversation, 1, 20);
            payload.messages = result.docs;
            payload.hasNext = result.hasNextPage;
        }
        res.status(conversation.status).json(payload);
    } catch (err) {
        return next({ status: 400, message: err.message });
    }
};

exports.getAllConversations = async function (req, res, next) {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 15;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const conversations = await db.Conversation.findConversations(req.user, page, limit);
        for (conversation of conversations.docs) {
            const lastMessage = conversation.lastMessage;
            if (lastMessage && !lastMessage.read && lastMessage.creator._id != req.user) {
                conversation.numUnread = await db.Message.countUnreadMessages(
                    conversation,
                    req.user
                );
            }
        }
        res.status(200).json({
            conversations: conversations.docs,
            hasNext: conversations.hasNextPage
        });
    } catch (err) {
        return next({ status: 400, message: err.message });
    }
};

exports.getConversation = async function (req, res, next) {
    try {
        const conversation = await db.Conversation.findConversation(req.params.id, req.user);
        const otherUser = conversation.users.find((user) => user != req.user);
        const { username, avatar } = await db.User.findById(otherUser);
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        await db.Message.markMessagesRead(conversation, req.user);

        const result = await db.Message.findConvoMessages(conversation, page, limit);
        res.status(200).json({
            messages: result.docs,
            hasNext: result.hasNextPage,
            otherUser: { username, avatar, id: otherUser }
        });
    } catch (err) {
        return next({ status: 400, message: err.message });
    }
};

exports.sendMessage = async function (convoId, currentUser, sentMessage) {
    try {
        const conversation = await db.Conversation.findConversation(convoId, currentUser);
        const creator = currentUser;
        let message = sentMessage;
        let newMessage;
        if (typeof message === 'object') {
            const fileType = await FileType.fromBuffer(message);
            if (!fileType.mime.match(/^image\/(jpe?g|png)$/)) {
                throw new Error('Image must be either a png, jpg, or jpeg');
            }
            if (Buffer.from(message).byteLength > 1000000) {
                throw new Error('Image too large. Max size is 1MB');
            }
            const img = message;
            newMessage = await db.Message.create({ conversation, creator, img });
        } else {
            if (!message || !message.trim()) {
                throw new Error('Message cannot be empty');
            }
            newMessage = await db.Message.create({ conversation, creator, text: message });
        }
        newMessage = await db.Message.populate(newMessage, {
            path: 'creator conversation',
            select: 'username avatar'
        });
        await db.Conversation.updateOne(conversation, { lastMessage: newMessage });
        return newMessage;
    } catch (err) {
        console.log(err);
    }
};
