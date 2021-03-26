const express = require('express');
const router = express.Router();

const { findUser, getUser, updateUser } = require('../handlers/users');
const { ensureCorrectUser } = require('../middleware/auth');
const { upload } = require('../middleware/fileUpload');

router.get('/', findUser);
router.route('/:id')
    .get(getUser)
    .patch(ensureCorrectUser, upload.single('avatar'), updateUser);


module.exports = router;