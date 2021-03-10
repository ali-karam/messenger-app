const db = require('../models');

exports.register = async function(req, res, next) {
    try {
        const user = await db.User.create(req.body);
        const { id, username} = user;
        return res.status(201).json({ username });
    } catch(err) {
        if(err.code === 11000) {
            err.message = 'Sorry, that username and/or email is taken'
        }
        return next({status: 400, message: err.message});
    }
};

exports.login = async function(req, res, next) {
    try {
        const user = await db.User.findOne({ username: req.body.username });
        const { id, username } = user;
        const isMatch = await user.comparePassword(req.body.password);
        if(isMatch) {
            return res.status(200).json({ username });
        } else {
            return next({status: 400, message: 'Invalid username/password'});
        }
    } catch(err) {
        return next({status: 400, message: 'Invalid username/password'});
    }
};