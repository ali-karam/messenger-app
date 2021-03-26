const db = require('../models');
const multer = require('multer');

exports.findUser = async function(req, res, next) {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const currentUser = await db.User.findById(req.user);
        const result = await currentUser.findOtherUsersByUsername(req.query.username, page, limit);
        res.status(200).json({ users: result.docs, hasNext: result.hasNextPage });
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};

exports.getUser = async function(req, res, next) {
    try {
        const user = await db.User.findById(req.params.id);
        const { username, avatar } = user;
        return res.status(200).json({ username, avatar });
    } catch(err) {
        return next({status: 404, message: err.message});
    }
};

exports.upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpe?g|png)$/)) {
            return cb('Please upload a jpg, jpeg, or png image');
        }
        cb(undefined, true);
    }
});

exports.uploadAvatar = async function(req, res, next) {
    try {
        const user = await db.User.findById(req.params.id);
        user.avatar = req.file.buffer;
        await user.save();
        res.send();
    } catch(err) {
        return next({status: 400, message: err.message});
    }
};