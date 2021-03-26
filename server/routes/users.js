const express = require('express');
const router = express.Router();

const { findUser, upload, uploadAvatar } = require('../handlers/users');
const { ensureCorrectUser } = require('../middleware/auth');

router.get('/', findUser);
router.patch('/:id', ensureCorrectUser, upload.single('avatar'), uploadAvatar);


module.exports = router;