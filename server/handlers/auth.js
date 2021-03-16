const db = require('../models');
const jwt = require('jsonwebtoken');

const expirationTimeInDays = 30;

generateToken = (id, username) => (
    jwt.sign({ id, username }, process.env.SECRET_KEY, 
        { expiresIn: 60 * 60 * 24 * expirationTimeInDays })
);

saveToken = (res, token) => (
    res.cookie('token', token, 
        { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * expirationTimeInDays})
);

exports.register = async function(req, res, next) {
    try {
        const user = await db.User.create(req.body);
        const { id, username } = user;
        const token = generateToken(id, username);
        saveToken(res, token);
        return res.status(201).json({ id, username });
    } catch(err) {
        if(err.code === 11000) {
            if(err.message.search('email') !== -1) {
                err.message = 'Sorry that email is taken';
            } else {
                err.message = 'Sorry that username is taken';
            }
        }
        return next({status: 400, message: err.message});
    }
};

exports.login = async function(req, res, next) {
    try {
        const user = await db.User.findOne({ email: req.body.email });
        const { id, username } = user;
        const isMatch = await user.comparePassword(req.body.password);
        if(isMatch) {
            const token = generateToken(id, username);
            saveToken(res, token);
            return res.status(200).json({ id, username });
        } else {
            return next({status: 400, message: 'Invalid email/password'});
        }
    } catch(err) {
        return next({status: 400, message: 'Invalid email/password'});
    }
};

exports.logout = function(req, res) {
    res.clearCookie('token');
    return res.status(200).send();
};

exports.validToken = async function(req, res, next) {
    try {
        const token = req.cookies.token;
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if(decoded) {
                return res.status(200).json({ id: decoded.id, username: decoded.username });
            } else {
                return res.end();
            }
        })
    } catch(err) {
        return res.end();
    }
};