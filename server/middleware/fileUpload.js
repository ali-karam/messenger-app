const multer = require('multer');

exports.upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpe?g|png)$/)) {
            return cb('Please upload a jpg, jpeg, or png image');
        }
        cb(undefined, true);
    }
});
