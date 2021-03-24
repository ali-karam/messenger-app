const express = require('express');
const router = express.Router();

const { findUser } = require('../handlers/users');
const { loginRequired } = require('../middleware/auth');

router.get('/', loginRequired, findUser);

module.exports = router;