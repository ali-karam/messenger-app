const sockets = {};
const { sendMessage } = require('./handlers/conversations');
const db = require('./models');
let users = [];

sockets.init = function (server) {
    const io = require('socket.io')(server);

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        const user = {
            userId: userId,
            clientId: socket.id
        };
        users.push(user);

        socket.emit(
            'onlineUserList',
            users.map((user) => user.userId)
        );

        socket.broadcast.emit('newUser', userId);

        socket.on('join', ({ convoId }) => {
            socket.join(convoId);
        });

        socket.on('sendMessage', async ({ message, otherUserId, convoId }, callback) => {
            try {
                const newMsg = await sendMessage(convoId, userId, message);
                io.to(convoId).emit('message', newMsg);
                const recepient = users.find((user) => user.userId === otherUserId);
                if (recepient) {
                    socket.broadcast.to(recepient.clientId).emit('newMessage', newMsg);
                }
            } catch (err) {
                callback(err.message);
            }
        });

        socket.on('read', async ({ messageId, convoId }, callback) => {
            if (messageId) {
                try {
                    await db.Message.updateOne({ _id: messageId }, { read: true });
                } catch (err) {
                    callback(err.message);
                }
            }
            socket.broadcast.to(convoId).emit('userReadMsg');
        });

        socket.on('leave', ({ convoId }) => {
            socket.leave(convoId);
        });

        socket.on('disconnect', () => {
            socket.broadcast.emit('userLeft', userId);
            users = users.filter((user) => user.clientId !== socket.id);
        });
    });
};

module.exports = sockets;
