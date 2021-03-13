const db = require('../models');
const jwt = require('jsonwebtoken');

const expirationTimeInDays = 30;

generateToken = id => (
    jwt.sign({ id }, process.env.SECRET_KEY, 
        { expiresIn: 60 * 60 * 24 * expirationTimeInDays })
);

saveToken = (res, token) => (
    res.cookie('token', token, 
        { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * expirationTimeInDays})
);

exports.register = async function(req, res, next) {
    try {
        const user = await db.User.create(req.body);
        const { id } = user;
        const token = generateToken(id);
        saveToken(res, token);
        return res.status(201).json({ id, token });
    } catch(err) {
        if(err.code === 11000) {
            err.message = 'Sorry, that username and/or email is taken'
        }
        return next({status: 400, message: err.message});
    }
};

exports.login = async function(req, res, next) {
    try {
        const user = await db.User.findOne({ email: req.body.email });
        const { id } = user;
        const isMatch = await user.comparePassword(req.body.password);
        if(isMatch) {
            const token = generateToken(id);
            saveToken(res, token);
            return res.status(200).json({ id, token });
        } else {
            return next({status: 400, message: 'Invalid email/password'});
        }
    } catch(err) {
        return next({status: 400, message: 'Invalid email/password'});
    }
};