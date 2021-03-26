const express = require('express');
const router = express.Router();

const { findUser, getUser, upload, uploadAvatar } = require('../handlers/users');
const { ensureCorrectUser } = require('../middleware/auth');

router.get('/', findUser);
router.route('/:id')
    .get(getUser)
    .patch(ensureCorrectUser, upload.single('avatar'), uploadAvatar);


module.exports = router;