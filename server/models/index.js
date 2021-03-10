const mongoose = require('mongoose');

mongoose
    .connect("mongodb://localhost:27017/messengerApp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log("Mongo connection open");
    })
    .catch((err) => {
        console.log("Mongo connection error");
        console.log(err);
    });

module.exports.User = require('./user');
