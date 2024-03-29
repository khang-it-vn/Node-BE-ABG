const express = require("express");
const router = express.Router();


router.use("/binance",require(__dirname + "/binancecontroller"));
router.use("/util", require(__dirname + "/utilcontroller"));
router.use('/admindoc', require(__dirname + "/admindoccontroller"));
router.use('/adminstore', require(__dirname + "/adminstorecontroller"));
router.use('/user', require(__dirname + "/usercontroller"));

router.use("/",require(__dirname + "/accountcontroller"));

module.exports = router;