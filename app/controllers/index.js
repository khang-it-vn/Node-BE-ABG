const express = require("express");
const router = express.Router();


router.use("/binance",require(__dirname + "/binancecontroller"));

router.use("/",require(__dirname + "/accountcontroller"));

module.exports = router;