const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../handlers/auth');
const { loginRequired } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', loginRequired, logout);

module.exports = router;