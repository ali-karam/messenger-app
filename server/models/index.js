const mongoose = require('mongoose');

const DB_NAME = 
    process.env.NODE_ENV === 'test' ? 'messengerAppTest' : 'messengerApp';

mongoose
    .connect(`mongodb://localhost:27017/${DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

module.exports.User = require('./user');
module.exports.Conversation = require('./conversation');
