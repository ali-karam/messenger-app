const db = require('../models');

exports.findUser = async function (req, res, next) {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const options = { page, limit };

        const result = await db.User.findOtherUsersByUsername(
            req.user,
            req.query.username,
            options
        );
        res.status(200).json({ users: result.docs, hasNext: result.hasNextPage });
    } catch (err) {
        return next({ status: 400, message: err.message });
    }
};

exports.getUser = async function (req, res, next) {
    try {
        const user = await db.User.findById(req.params.id);
        const { username, avatar } = user;
        return res.status(200).json({ username, avatar });
    } catch (err) {
        return next({ status: 404, message: err.message });
    }
};

exports.updateUser = async function (req, res, next) {
    try {
        const user = await db.User.findById(req.params.id);
        user.avatar = req.file.buffer;
        await user.save();
        const { username, avatar } = user;
        return res.status(200).json({ username, avatar });
    } catch (err) {
        return next({ status: 400, message: err.message });
    }
};
