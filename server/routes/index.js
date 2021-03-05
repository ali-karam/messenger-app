const express = require("express");
const router = express.Router();

router.get("/welcome", function (req, res, next) {
  res.status(200).send({ welcomeMessage: "Welcome!" });
});

module.exports = router;
