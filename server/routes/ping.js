const express = require("express");
const router = express.Router();

router.post("/", function (req, res, next) {
  const message = req.body.message;
  res.status(200).send({ response: `Server is running. Message received: ${message}` });
});

module.exports = router;
