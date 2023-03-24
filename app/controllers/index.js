const express = require("express");
const router = express.Router();

router.use("/",require(__dirname + "/accountcontroller"));

module.exports = router;