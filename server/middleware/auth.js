const jwt = require('jsonwebtoken');

exports.loginRequired = function(req, res, next) {
    try {
        const token = req.cookies.token;
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if(decoded) {
                req.user = decoded.id;
                return next();
            } else {
                return next({ status: 401, message: 'Please log in first'});
            }
        })
    } catch(err) {
        return next({ status: 401, message: 'Please log in first'});
    }
};

exports.ensureCorrectUser = function(req, res, next) {
    try {
        if(req.user !== req.params.id) {
            return next({ status: 401, message: 'Unauthorized'});
        }
        return next();
    } catch(err) {
        return next({ status: 401, message: 'Unauthorized'});
    }
};