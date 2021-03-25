const express = require('express');
const router = express.Router();

const { findUser } = require('../handlers/users');

router.get('/', findUser);

module.exports = router;