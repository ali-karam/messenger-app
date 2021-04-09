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

        socket.on('join', ({ convoId }) => {
            socket.join(convoId);
        });

        socket.on('sendMessage', async ({ message, otherUserId, convoId }) => {
            const newMsg = await sendMessage(convoId, userId, message);
            io.to(convoId).emit('message', newMsg);
            const recepient = users.find((user) => user.userId === otherUserId);
            if (recepient) {
                socket.broadcast.to(recepient.clientId).emit('newMessage', newMsg);
            }
        });

        socket.on('read', async ({ messageId, convoId }) => {
            await db.Message.updateOne({ _id: messageId }, { read: true });
            socket.broadcast.to(convoId).emit('userReadMsg');
        });

        socket.on('leave', ({ convoId }) => {
            socket.leave(convoId);
        });

        socket.on('disconnect', () => {
            users = users.filter((user) => user.clientId !== socket.id);
        });
    });
};

module.exports = sockets;
