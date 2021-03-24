const db = require('../models');

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